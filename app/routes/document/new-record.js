import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('document.new-record');

////      **************
////      INIT.
//        //filter on search port of origin and port of destination in the template
        if( !app_controller.autocompletePoi.get('length') ){
            this.store.findQuery("poi", {tags: 'Port'}).then(function(val){
                app_controller.set("autocompletePoiPort", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }
        if( !app_controller.autocompleteVoyage.get('length') ){
            this.store.findQuery("voyage").then(function(val){
                app_controller.set("autocompleteVoyage", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        this.store.find("file", {company: app_controller.company, type: 'JRXML'}).then(function(val){
            app_controller.set("files_jrxml", val);
        }, function( reason ){
            app_controller.send( 'error', reason );
        });

//        //reset search variables
        controller.set('searchOrigin', []);
        controller.set('searchDestination', []);
        controller.set('searchVoyage', []);
    },

    actions: {
        searchRecords: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('document.new-record'),
                queryExpression = {}, searchPath = "", doSearch = [false, false, false];

            /*     ***infinite scroll***     */
            app_controller.set('searchResultList', []);
            app_controller.set('isAll', false);
            app_controller.set('perPage', 25);
            app_controller.set('firstIndex', 0);
            app_controller.set('items', []);


            if(controller.searchOrigin !== null && controller.searchOrigin !== ''){
                controller.set('actualOrigin', controller.searchOrigin);
                searchPath = "origin";
                queryExpression[searchPath] = controller.searchOrigin.get("id");
                doSearch[0] = true;
            }
            if(controller.searchDestination !== null && controller.searchDestination !== ''){
                controller.set('actualDestination', controller.searchDestination);
                searchPath = "destination";
                queryExpression[searchPath] = controller.searchDestination.get("id");
                doSearch[1] = true;
            }
            if(controller.searchVoyage !== null && controller.searchVoyage !== ''){
                controller.set('actualVoyage', controller.searchVoyage);
                searchPath = "voyage";
                queryExpression[searchPath] = controller.searchVoyage.get("id");
                doSearch[2] = true;
            }

            searchPath = "booking"; queryExpression[searchPath] = '{"booking/state":"lock"}';

            if( doSearch[0] && doSearch[1] && doSearch[2] ) {
                searchPath = "sortBy";
                queryExpression[searchPath] = 'code';

                this.store.findQuery('freightPlan', queryExpression).then(function(queryExpressResults){

                    /*     ***infinite scroll***     */
                    app_controller.set("queryExpressResults_length", queryExpressResults.get('length'));
                    app_controller.set("queryExpressResults", queryExpressResults);

                    queryExpressResults.forEach(function(equ, index){
                        if(index+1 <= app_controller.perPage) {
                            app_controller.items.pushObject(equ);

                            if(index+1 === queryExpressResults.get('length')){
                                renderResults();
                                return false;
                            }
                        } else {
                            renderResults();
                            return false;
                        }
                    });

                    function renderResults() {
                        app_controller.set('firstIndex', app_controller.perPage);
                        app_controller.set("searchResultList", app_controller.items);

                        self.render('document.result-bl-search', {
                            into: 'application',
                            outlet: 'search-result'
                        });
                    }
                });
            } else {
                self.render('document.result-bl-search', {
                    into: 'application',
                    outlet: 'search-result'
                });
            }
        },

        //      **************
//      NEW
        saveLL: function( docType, $btn ){
            //*** initialize variables
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('document.new-record'),
                data = self.getProperties();

            var originList = this.get('controller').get('originList_LL').filterBy('isChecked').mapBy('id').join(",").split(",");
            var originPoi = this.get('controller').get('originList_LL').filterBy('isChecked').mapBy('poi').mapBy('id').join(",").split(",");
            var destinationList = this.get('controller').get('destinationList_LL').filterBy('isChecked').mapBy('id').join(",").split(",");
            var destinationPoi = this.get('controller').get('destinationList_LL').filterBy('isChecked').mapBy('poi').mapBy('id').join(",").split(",");

            //***initialize functions

            //settaggio di destinazione ed origine per il documento in questione
            function defineOriginDestination(self, newBL, originList, originPoi, destinationList, destinationPoi) {
                if( originList !== null ){
                    self.store.find('leg', originList).then(function(origin){
                        self.store.find('poi', originPoi).then(function(originP){
                            newBL.set('origin', originP);
                            newBL.set('originLeg', origin);

                            if( destinationList == null ){
                                newBL.save().then(success);
                            }
                        });
                    });
                }
                if( destinationList !== null ){
                    self.store.find('leg', destinationList).then(function(destination){
                        self.store.find('poi', destinationPoi).then(function(destinationP){
                            newBL.set('destination', destinationP);
                            newBL.set('destinationLeg', destination);
                            newBL.save().then(success);
                        });
                    });
                }
            }

            //se il salvataggio del documento è andato a buon fine rimetto le variabili a zero e cambio pagina
            function success(val) {
                $btn.button('reset');
                controller.set('originList_LL', []);
                controller.set('destinationList_LL', []);
                controller.set('name', null);
                controller.set('searchVoyage', null);
//                self.controllerFor('documents.document').setDocs(docType);
                //self.transitionTo('document.main', val);
                self.controllerFor('document.main').set('isView', false);

                self.transitionTo('document/main', val);
            }

            //core
            if( originList.length > 1 || destinationList.length > 1 ){
                $btn.button('reset');
                new PNotify({
                    title: 'Attention',
                    text: 'You can select only one origin and one destination for this voyage.',
                    type: 'info'
                });
            }
            else if( controller.name === '' || controller.name === null ) {
                $btn.button('reset');
                new PNotify({
                    title: 'Attention',
                    text: 'You must compile the code field.',
                    delay: 2000
                });
            } else {

                /**  rieseguo controllo sul code: potrebbe essere che uno inserisca il code e lasciando il cursore su quel
                 field prema col mouse sulla post. in questo caso non viene fatto il focusOut e non parte
                 il controllo del code  **/
                data.val = controller.name;
                data.type = docType;
                data.voyage = controller.searchVoyage.get('id');
                $.post('api/custom/checkDocumentCode?token=' + app_controller.token, data).then(function(response){
                    if (response.success) {

                        if(controller.searchVoyage !== ''){
                            //REMOVE THE WARNING
                            $('div.alert.alert-danger').css('display', 'none');
                            self.store.find('company', app_controller.company).then(function(comp){
                                var date = new Date();
                                var newBL = self.store.createRecord('document',  {
                                    name: controller.name,
                                    voyage: controller.searchVoyage,
                                    date: date,
                                    type: 'docLL',
                                    company: comp,
                                    nrOriginal: '01/ONE',
                                    visibility: 'private'
                                });

                                if( originList[0] !== '' && destinationList[0] !== '' ) {      //se sono stati inseriti sia origine che destinazione
                                    defineOriginDestination(self, newBL, originList, originPoi, destinationList, destinationPoi);
                                } else if ( originList[0] !== '' && destinationList[0] === '' ) {  //se è stata inserita solo l'origine
                                    defineOriginDestination(self, newBL, originList, originPoi, null, null);
                                } else if ( originList[0] === '' && destinationList[0] !== '' ) {   //se è stata inserita solo la destinazione
                                    defineOriginDestination(self, newBL, null, null, destinationList, destinationPoi);
                                } else {
                                    newBL.save().then(success);
                                }
                            });
                        } else {
//                          WARNING
                            $('div.alert.alert-danger').css('display', 'inline-block');
                        }
                    } else {
                        $btn.button('reset');
                        controller.set('name', null);
                        new PNotify({
                            title: 'Attention',
                            text: 'A document with this code already exists, please change it.',
                            type: 'warning'
                        });
                    }
                }, function(){
                    $btn.button('reset');
                    new PNotify({
                        title: 'Attention',
                        text: 'A problem occurred.',
                        type: 'info'
                    });
                });
            }
        },

        saveFP: function( docType, $btn ){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('document.new-record'),
                data = self.getProperties();

            if(controller.searchVoyage !== '' && controller.name !== '' && controller.name !== null ){
                data.val = controller.name;
                data.type = docType;
                data.voyage = controller.searchVoyage.get('id');
                $.post('api/custom/checkDocumentCode?token=' + app_controller.token, data).then(function(response){
                    if (response.success) {

                        //REMOVE THE WARNING
                        $('div.alert.alert-danger').css('display', 'none');

                        self.store.find('company', app_controller.company).then(function(comp){
                            var date = new Date();
                            var newBL = self.store.createRecord('document',  {
                                name: controller.name,
                                voyage: controller.searchVoyage,
                                date: date,
                                type: docType,
                                company: comp,
                                nrOriginal: controller.nOriginal,
                                visibility: 'private'
                            }).save().then(function(val){
                                //setTimeout(function () {
                                $btn.button('reset');
                                //}, 1000);
                                controller.set('name', null);
                                controller.set('searchVoyage', null);
                                //self.transitionTo('document.main', val);
                                self.controllerFor('document.main').set('isView', false);

                                self.transitionTo('document/main', val);
                            });
                        });

                    } else {
                        $btn.button('reset');
                        controller.set('name', null);
                        new PNotify({
                            title: 'Attention',
                            text: 'A document with this code already exists, please change it.',
                            type: 'warning'
                        });
                    }
                }, function(){
                    $btn.button('reset');
                    new PNotify({
                        title: 'Attention',
                        text: 'A problem occurred.',

                        type: 'warning'
                    });
                });

            } else {
                $btn.button('reset');
                new PNotify({
                    title: 'Attention',
                    text: 'You must compile the code and voyage field.',
                    type: 'warning'
                });
            }
        },

        saveCM: function(docType, $btn){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('document.new-record'),
                data = self.getProperties();

            if( ( controller.searchOrigin !== '' && controller.searchOrigin !== null ) &&
                ( controller.searchDestination !== '' && controller.searchDestination !== null ) &&
                ( controller.searchVoyage !== '' && controller.searchVoyage !== null ) &&
                ( controller.name !== '' && controller.name !== null ) ){
                //REMOVE THE WARNING
                $('div.alert.alert-danger').css('display', 'none');

                data.val = controller.name;
                data.type = 'docCM';
                data.voyage = controller.searchVoyage.get('id');
                $.post('api/custom/checkDocumentCode?token=' + app_controller.token, data).then(function(response){
                    if (response.success) {

                        self.store.find('company', app_controller.company).then(function(comp){

                            var date = new Date();
                            var newBL = self.store.createRecord('document',  {
                                name: controller.name,
                                origin: controller.searchOrigin,
                                destination: controller.searchDestination,
                                voyage: controller.searchVoyage,
                                date: date,
                                type: docType,
                                company: comp,
                                nrOriginal: '01/ONE',
                                visibility: 'private'
                            }).save().then(function(val){
                                //setTimeout(function () {
                                $btn.button('reset');
                                //}, 1000);
                                controller.set('name', null);
                                controller.set('searchOrigin', null);
                                controller.set('searchDestination', null);
                                controller.set('searchVoyage', null);
                                //self.transitionTo('document.main', val);
                                self.controllerFor('document.main').set('isView', false);

                                self.transitionTo('document/main', val);
                            }, function(response){
                                $btn.button('reset');

                                var error = JSON.parse(response.responseText);
                                new PNotify({
                                    title: 'Error',
                                    text: error.error,
                                    type: 'error'
                                });
                            });
                        });

                    } else {
                        $btn.button('reset');
                        controller.set('name', null);
                        new PNotify({
                            title: 'Attention',
                            text: 'A document with this code already exists, please change it.',
                            type: 'warning'
                        });
                    }
                }, function(){
                    $btn.button('reset');
                    new PNotify({
                        title: 'Attention',
                        text: 'A problem occurred.',

                        type: 'warning'
                    });
                });

            } else {
//                WARNING
                $('div.alert.alert-danger').css('display', 'inline-block');
                $btn.button('reset');
            }
        },

        save: function( docType ){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('document.new-record'),
                bookItemsList= [], allBook = [],
                shipper= null, consignee= null, notify= null,
                shipperCheck = true, consigneeCheck = true, notifyCheck = true,
                stringShipper = null, stringConsignee=null, stringNotify=null,
                bookItList = null,
                data = self.getProperties();

            if(controller.actualOrigin !== '' && controller.actualDestination !== '' && controller.actualVoyage !== '' && controller.name !== '' && controller.name !== null ){
                $('div.alert.alert-danger').css('display', 'none');   //REMOVE THE WARNING

                /*
                 *   bookItList --> lista dei booking items selezionati
                 *      allBook --> lista dei booking padre dei booking items. ciò mi serve per fare un
                 *                  riferimento inverso sul documento.
                 *
                 *
                 * */
                data.val = controller.name;
                data.type = docType;
                data.voyage = controller.actualVoyage.get('id');
                $.post('api/custom/checkDocumentCode?token=' + app_controller.token, data).then(function(response){
                    if (response.success) {

                        bookItList =  controller.get("selectedBookItList").filterBy("isChecked").mapBy("id").unique();

//                   var bookItListFilter =  bookItList.filterBy("isChecked");
                        if(bookItList.length !== 0){
                            bookItList.filter(function(val, index){
                                self.store.find('bookingItem', val).then(function(bookIt){
                                    allBook.pushObject(bookIt.get('booking'));

                                    if( bookItList.get( 'length') === index+1 ) {
                                        allBook = allBook.unique();      // tolgo possibili ripetizioni dalla lista di bookings padre
                                        bookItemsToBL( bookItList.join(",").split(","), allBook );
                                    }
                                });
                            });

                        } else {
                            new PNotify({
                                title: 'Attention',
                                text: 'You have not selected any booking item, please check it.'
                            });
                        }


                    } else {
                        controller.set('name', null);
                        new PNotify({
                            title: 'Attention',
                            text: 'A document with this code already exists, please change it.',
                            type: 'warning'
                        });
                    }

                }, function(){
                    new PNotify({
                        title: 'Attention',
                        text: 'A problem occurred.',

                        type: 'warning'
                    });
                });

            } else{
//              WARNING
                $('div.alert.alert-danger').css('display', 'inline-block');
            }

            function bookItemsToBL(allBookItems, allBook){
                allBookItems.filter(function(val){return val!==''}).forEach(function(bookItem, index_bi){   // tolgo possibili campi vuoti all'interno dell'array

                    self.store.find('bookingItem', bookItem).then(function(bookIt){  // recupero gli oggetti item tramite i loro id

                        if(shipper!== null) {    //controllo per shipper/consignee/notify
                            if(shipper !== bookIt.get('shipper')) {
                                shipperCheck = false;
                            }
                        }
                        if(consignee!== null) {
                            if(consignee != bookIt.get('consignee')) {
                                consigneeCheck = false;
                            }
                        }
                        if(notify!== null) {
                            if(notify != bookIt.get('notify')) {
                                notifyCheck = false;
                            }
                        }

                        bookItemsList.push(bookIt);

                        if(bookIt.get('shipper')){
                            shipper = bookIt.get('shipper');
                        }
                        if(bookIt.get('consignee')){
                            consignee = bookIt.get('consignee');
                        }
                        if(bookIt.get('notify')){
                            notify = bookIt.get('notify');
                        }

                        if(shipperCheck && consigneeCheck && notifyCheck) {
                            if(allBookItems.filter(function(val){return val!==''}).length === index_bi+1) {
                                self.store.find('company', app_controller.company).then(function(comp){
                                    var date = new Date(), arr = [], val2 = 'dangerous_good|' + false;      //svuoto l'array e successivamente lo ripopolo in modo da non mandare in errore la property bl_type in documentModel.js
                                    arr.push(val2);

                                    var newBL = self.store.createRecord('document',  {
                                        name: controller.name,
                                        origin: controller.actualOrigin,
                                        destination: controller.actualDestination,
                                        voyage: controller.actualVoyage,
                                        date: date,
                                        type: docType,
                                        company: comp,
                                        nrOriginal: '03/THREE',
                                        itemsIn: 'Document',
                                        tags: arr,
                                        visibility: 'private'
                                    });

                                    newBL.get('bookings').then(function(myBook){
                                        myBook.pushObjects(allBook);
                                    });

                                    if(bookIt.get('shipper')){
                                        self.store.find('company', shipper.get('id')).then(function(shipperObj){
                                            if(shipperObj.get('name')) {
                                                stringShipper = shipperObj.get('name');
                                            }
                                            if(shipperObj.get('street')) {
                                                stringShipper = stringShipper + "\n" + shipperObj.get('street');
                                            }
                                            if(shipperObj.get('city') && shipperObj.get('country')) {
                                                stringShipper = stringShipper + "\n" + shipperObj.get('city') + " " + shipperObj.get('country');
                                            }
                                            if(shipperObj.get('phone')) {
                                                stringShipper = stringShipper + "\n" + shipperObj.get('phone');
                                            }
                                            newBL.set('shipper', stringShipper);
                                        })
                                    }

                                    if(bookIt.get('consignee')){
                                        self.store.find('company', consignee.get('id')).then(function(consigneeObj){
                                            if(consigneeObj.get('name')) {
                                                stringConsignee = consigneeObj.get('name');
                                            }
                                            if(consigneeObj.get('street')) {
                                                stringConsignee = stringConsignee + "\n" + consigneeObj.get('street');
                                            }
                                            if(consigneeObj.get('city') && consigneeObj.get('country')) {
                                                stringConsignee = stringConsignee + "\n" + consigneeObj.get('city') + " " + consigneeObj.get('country');
                                            }
                                            if(consigneeObj.get('phone')) {
                                                stringConsignee = stringConsignee + "\n" + consigneeObj.get('phone');
                                            }
                                            newBL.set('consignee', stringConsignee);
                                        })
                                    }

                                    if(bookIt.get('notify')){
                                        self.store.find('company', notify.get('id')).then(function(notifyObj){
                                            if(notifyObj.get('name')) {
                                                stringNotify = notifyObj.get('name');
                                            }
                                            if(notifyObj.get('street')) {
                                                stringNotify = stringNotify + "\n" + notifyObj.get('street');
                                            }
                                            if(notifyObj.get('city') && notifyObj.get('country')) {
                                                stringNotify = stringNotify + "\n" + notifyObj.get('city') + " " + notifyObj.get('country');
                                            }
                                            if(notifyObj.get('phone')) {
                                                stringNotify = stringNotify + "\n" + notifyObj.get('phone');
                                            }
                                            newBL.set('notify', stringNotify);
                                        })
                                    }

                                    newBL.get('bookingItems').then(function(bookItems){
                                        bookItems.pushObjects(bookItemsList);
                                        newBL.save().then(function( val ){

                                            controller.set('name', null);
                                            controller.set('selectedBookItList', []);
                                            self.controllerFor('document.main').set('isView', false);

                                            self.transitionTo('document/main', val);
                                        }, function(){
                                            new PNotify({
                                                title: 'Not saved!',
                                                text: 'Something wrong happened.',
                                                type: 'error'
                                            });
                                        });
                                    });
                                });
                            }
                        } else {
                            self.render("documents.modals.modalAlert_ShipperConsigneeNotify", {
                                outlet: "alert",
                                into: "documents.documentsNew",
                                view: 'overview'
                            });
                        }

                    });
                });
            }
        }
    }
});
