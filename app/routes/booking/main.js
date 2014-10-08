import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('booking.main');

        //imposto la tab details come default per 'company'
        if( controller.tabList.details !== true &&
            controller.tabList.freightPlan !== true &&
            controller.tabList.revenues !== true &&
            controller.tabList.container !== true &&
            controller.tabList.roro !== true &&
            controller.tabList.bb !== true &&
            controller.tabList.itemStatus !== true &&
            controller.tabList.files !== true ) {

            controller.set('tabList.details', true);
        }

        if( controller.subTabLists.details !== true &&
            controller.subTabLists.goods !== true &&
            controller.subTabLists.haulage !== true &&
            controller.subTabLists.customs !== true &&
            controller.subTabLists.status !== true &&
            controller.subTabLists.revenues !== true &&
            controller.subTabLists.files !== true ) {

            controller.set('subTabLists.goods', true);
        }

        controller.set('isView', true);
        controller.set('itemListActive', false);
        controller.set('newContainerItemActive', false);

//      *** BOOKING NEW
        //filter on search port of origin and port of destination in the template
        if( !app_controller.autocompletePoiPort.get('length')  ) {
            self.store.findQuery("poi", {tags: "Port"}).then(function(port){
                app_controller.set("autocompletePoiPort", port);
            });
        }

        if( !app_controller.autocompleteCompany.get('length') ) {
            self.store.findQuery("company").then(function(comp){
                app_controller.set("autocompleteCompany", comp);
            });
        }

        controller.set('searchCompany', []);
        controller.set('searchCompanyToShare', []);

        //GOODS
        if( !app_controller.autocompletePoiDepot.get('length') ) {
            self.store.findQuery("poi", {tags: "Depot"}).then(function(val){
                app_controller.set("autocompletePoiDepot", val);
            });
        }

        //to create new container Item
        if( !app_controller.autocompleteEqClassificationContainer.get('length') ) {
            var queryExpression = {}, searchPath = "equipmentType";
            queryExpression[searchPath] = 'container';
            searchPath = "available";
            queryExpression[searchPath] = true;

            self.store.findQuery("equipmentClassification", queryExpression).then(function(comp){
                app_controller.set("autocompleteEqClassificationContainer", comp);
            });
        }

        if( !app_controller.autocompleteEquipment.get('length') ) {
            self.store.findQuery("equipment").then(function(comp){
                app_controller.set("autocompleteEquipment", comp);
            });
        }

        //freightPlan list: fixme: questo creava problemi se inizializzato come = Ember.A()
        controller.set('freightPlanList', []);



//      *** CUSTOMS
        if( !app_controller.autocompletePoi.get('length') ) {
            self.store.findQuery("poi").then(function(allPoi){
                app_controller.set("autocompletePoi", allPoi);
            });
        }

//      *** FREIGHT PLAN
        if( !app_controller.autocompleteVoyage.get('length') ) {
            self.store.findQuery("voyage").then(function(val){
                app_controller.set("autocompleteVoyage", val);
            });
        }
        controller.set('searchVoy', []);
    },
    model: function(booking) {
        return this.store.find('booking', booking.booking_id);
    },

    actions: {
        /****************************************************************************************************
         * BOOKING NAVIGATION
         * */
        /**
         Gestione della tab navigation in 'your-profile'; rende attiva la tab selezionata dall'utente

         @action setTabs
         @for your-profile/main-page
         @param {string} tab selezionata dall'utente - (company/driver/truck/trailer/clerk)
         */
        setTabs: function ( tabToActive, book ) {
            var self = this, controller = self.controllerFor('booking.main'), app_controller = self.controllerFor('application');

            controller.set('tabList.details', false);
            controller.set('tabList.freightPlan', false);
            controller.set('tabList.revenues', false);
            controller.set('tabList.container', false);
            controller.set('tabList.roro', false);
            controller.set('tabList.bb', false);
            controller.set('tabList.itemStatus', false);
            controller.set('tabList.files', false);

            controller.set('isView', true);

            controller.set('itemListActive', false);
            controller.set('newContainerItemActive', false);
//            this.controller.set('itemNewActive', false);
//            this.controller.set('itemEditActive', false);

            controller.set('tabList.' + tabToActive, true);

            /**
             REVENUES
             carico tutti i charges che come regione hanno la stessa associata
             alla destinazione di questo booking.
             */
            if(tabToActive == "revenues") {
                var queryExpression_segment = {}, searchPath = "";
                var queryExpression_charge = {};

                controller.set('revenuesTabList.general', true);
                controller.set('revenuesTabList.bookingCharges', false);
                controller.set('revenuesTabList.containerCharges', false);
                controller.set('revenuesTabList.roroCharges', false);
                controller.set('revenuesTabList.bbCharges', false);
                controller.set('revenuesTabList.itemCharges', false);

                //recupero l'origine e la destinazione definite nel booking
                self.store.find("poi", book.get("destination").get("id")).then(function(myDest){
                    searchPath = "destination";
                    queryExpression_segment[searchPath] = myDest.get('id');
                    self.store.find("poi", book.get("origin").get("id")).then(function(myOrigin){
                        searchPath = "origin";
                        queryExpression_segment[searchPath] = myOrigin.get('id');

                        self.store.findQuery("segment", queryExpression_segment).then(function(val){
                            val.filter(function(mySeg){

                                searchPath = "segment";
                                queryExpression_charge[searchPath] = mySeg.get('id');
                                searchPath = "available";
                                queryExpression_charge[searchPath] ='true';
                                self.store.findQuery("charge", queryExpression_charge).then(function(chargeVal){
                                    app_controller.set("autocompleteCharge", chargeVal);
                                });
                            });

                        });
                    });
                });

                controller.set('searchApplyCharge', []);
            }

        },

        iHaveSelected: function() {
            var checkedItems = this.get('controller.checkedItems');
            alert('you checked ' +checkedItems.length + ' items');
        },
        /**
         Gestione delle sotto-tab dei booking items

         @action selectSubTab
         @for Booking Item NavBar
         @param {String}
         */
        selectSubTab: function( subTabToActive ) {
            var self = this, controller = self.controllerFor('booking.main'), app_controller = self.controllerFor('application');

            controller.set('subTabLists.goods', false);
            controller.set('subTabLists.details', false);
            controller.set('subTabLists.haulage', false);
            controller.set('subTabLists.customs', false);
            controller.set('subTabLists.status', false);
            controller.set('subTabLists.revenues', false);
            controller.set('subTabLists.files', false);

            controller.set('subTabLists.' + subTabToActive, true);

            //controller.setSubTabs('subTabLists.'+ name);
            //controller.set('activeSubTab', name);

//            this.render("bookings.tabs.subTab." + name, {
//                into: 'bookings.tabs.'+ controller.activeTab,
//                outlet: 'subTab'
//            });
        },

        remove_item: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('booking.main');

            switch ( controller.remove_use_case ){
                case 'booking.modals.remove-charge-item':
                    controller.charge_item_record.deleteRecord();
                    controller.charge_item_record.save().then(function(){});
                    break;
                case 'booking.modals.remove-item':
                    var record_type = controller.item_record.get('type'), record_id = controller.item_record.get('id');
//                    controller.item_record.get('freightEquipments').then(function(freightEquipments){
//                        freightEquipments.filter(function(val){
                            //self.store.find('freightEquipment', val.id).then(function(fEq){
//                                freightEquipments.removeObject(fEq);
//                                controller.item_record.save().then(function(){
//                            val.deleteRecord();
//                            val.save().then(function(){
//                                        //when freightEquipments is empty go on
//                                        if( freightEquipments.get('length') === 0 ) {
////
//                                            controller.item_record.deleteRecord();
//                                            controller.item_record.save();
//                                        }
//                                    });

//                                });


//                            //});
//                        });
//                    });

                    controller.item_record.deleteRecord();
                    controller.item_record.save().then(function(){
//                        if( record_type === 'roro' ) {
//                            app_controller.autocompleteRoRo.forEach(function(item, index){
//                                if( item ) {
//                                    if( item.get('id') === record_id ) {
//                                        app_controller.autocompleteRoRo.removeAt(index);
//                                    }
//                                }
//                            });
//                        }
                    });
                    break;
            }
        },

        /****************************************************************************************************
         * MODAL-MANAGER
         * */
        open_modal: function( path, booking, item ) {
            var self = this, controller = self.controllerFor('booking.main'), app_controller = self.controllerFor('application'),
                queryExpression = {}, searchPath = "";

            switch ( path ){
                case 'booking.modals.memo':
                    controller.set("booking_record", booking);

                    this.render(path, {
                        into: 'application',
                        outlet: 'overview',
                        view: 'modal-manager'
                    });
                    break;

                case 'booking.modals.delay':
                    var bookItemsList = this.get("controller").get("delayItemsList").filterBy("isChecked").mapBy("id").join(",").split(",");

                    if(bookItemsList !== ''){
                        controller.set('codeBooking', null);

                        this.render(path, {
                            into: 'application',
                            outlet: 'overview',
                            view: 'modal-manager'
                        });
                    }else{
                        new PNotify({
                            title: 'Attention',
                            text: 'Please check to have selected some item to delay.',
                            delay: 3000
                        });
                    }

                    break;
                case 'booking.modals.remove-file':
                    controller.set("remove_use_case", 'booking.modals.remove-file');

                    controller.set("booking_record", booking);
                    controller.set("file_record", item);

                    this.render(path, {
                        into: 'application',
                        outlet: 'overview',
                        view: 'modal-manager'
                    });
                    break;
                case 'booking.modals.remove-item':
                    controller.set("remove_use_case", 'booking.modals.remove-item');

                    controller.set("booking_record", booking);
                    controller.set("item_record", item);

                    this.render(path, {
                        into: 'application',
                        outlet: 'overview',
                        view: 'modal-manager'
                    });
                    break;
                case 'booking.modals.remove-charge-item':
                    controller.set("remove_use_case", 'booking.modals.remove-charge-item');

                    controller.set("booking_record", booking);
                    controller.set("charge_item_record", item);

                    this.render(path, {
                        into: 'application',
                        outlet: 'overview',
                        view: 'modal-manager'
                    });
                    break;
                case 'booking.modals.replica':
                    controller.set("booking_record", booking);
                    controller.set("item_record", item);

                    this.render(path, {
                        into: 'application',
                        outlet: 'overview',
                        view: 'modal-manager'
                    });
                    break;
                case 'booking.modals.loaded-on':
                    //controllo che sia stato effettivamente selezionato qualcosa di cui fare il loaded on
                    var list = controller.get("loadedOnItemsList");
                    var loadedOnList = list.filterBy("isChecked").mapBy("id").join(",").split(",");//this.get("controller").get("loadedOnItemsList").filterBy("isChecked").mapBy("id").join(",").split(",");

                    controller.set("booking_record", booking);
                    //controller.set("item_record", item);

                    if(loadedOnList !== ''){
                        searchPath = "tu";
                        queryExpression[searchPath] = 'roro';     //You can't use appendChild outside of the rendering process; sono in roro e
                        searchPath = "bookingItemType";
                        queryExpression[searchPath] = "item";
                        searchPath = "booking";
                        queryExpression[searchPath] = booking.get('id');

                        self.store.findQuery("booking-item", queryExpression).then(function( val ){
                            app_controller.set("autocompleteRoRo", val);
                        });

                        controller.set( 'searchRoRoCode', [] );
                        this.render(path, {
                            into: 'application',
                            outlet: 'overview',
                            view: 'modal-manager'
                        });
                    }else{
                        new PNotify({
                            title: 'Attention',
                            text: 'Please check to have selected some item to load.',
                            delay: 3000
                        });
                    }
                    break;
            }
        },

        close_item: function(){
            var self = this, app_controller = self.controllerFor('application');

            app_controller.send('close_modal', 'overview', 'application');
            this.send('closeSearch');
        },

        /****************************************************************************************************
         * DETAILS TAB - update
         * */
        /**
         Funzione PUT per l'aggiornamento dei campi del booking che si trovano nel tab Details

         @action update_details
         @for Booking
         @param {Number} - unique key
         @param {Boolean}
         */
        update_details: function( book, isEditing ){

            var clientDetList = null, agencyDetList = null, shipperDetList = null, consigneeDetList = null, notifyDetList = null;

            if(isEditing) {
                // controllo se i campi client, shipper, consignee e notify sono stati compilati dall'utente e, nel caso, vengono salvati.
                if(book.get('client')){
                    if(book.get('client').get("name")){
                        clientDetList = book.get('client').get("name");
                    }
                    if(book.get('client').get("street")){
                        clientDetList = clientDetList + ", " + book.get('client').get("street");
                    }
                    if(book.get('client').get("city")){
                        clientDetList = clientDetList + ", " + book.get('client').get("city");
                    }
                    if(book.get('client').get("country")){
                        clientDetList = clientDetList + ", " + book.get('client').get("country");
                    }
                    if(book.get('client').get("vat")){
                        clientDetList = clientDetList + ", " + book.get('client').get("vat");
                    }
                    book.set('clientDetail', clientDetList);
                } else {
                    book.set('clientDetail', '');
                }

                if(book.get('agency')){
                    if(book.get('agency').get("name")){
                        agencyDetList = book.get('agency').get("name");
                    }
                    if(book.get('agency').get("street")){
                        agencyDetList = agencyDetList + ", " + book.get('agency').get("street");
                    }
                    if(book.get('agency').get("city")){
                        agencyDetList = agencyDetList + ", " + book.get('agency').get("city");
                    }
                    if(book.get('agency').get("country")){
                        agencyDetList = agencyDetList + ", " + book.get('agency').get("country");
                    }
                    if(book.get('agency').get("vat")){
                        agencyDetList = agencyDetList + ", " + book.get('agency').get("vat");
                    }
                    book.set('agencyDetail', agencyDetList);
                } else {
                    book.set('agencyDetail', '');
                }

                if(book.get('shipper')){
                    if(book.get('shipper').get("name")){
                        shipperDetList = book.get('shipper').get("name");
                    }
                    if(book.get('shipper').get("street")){
                        shipperDetList = shipperDetList + ", " + book.get('shipper').get("street");
                    }
                    if(book.get('shipper').get("city")){
                        shipperDetList = shipperDetList + ", " + book.get('shipper').get("city");
                    }
                    if(book.get('shipper').get("country")){
                        shipperDetList = shipperDetList + ", " + book.get('shipper').get("country");
                    }
                    if(book.get('shipper').get("vat")){
                        shipperDetList = shipperDetList + ", " + book.get('shipper').get("vat");
                    }
                    book.set('shipperDetail', shipperDetList);
                } else {
                    book.set('shipperDetail', '');
                }

                if(book.get('consignee')){
                    if(book.get('consignee').get("name")){
                        consigneeDetList = book.get('consignee').get("name");
                    }
                    if(book.get('consignee').get("street")){
                        consigneeDetList = consigneeDetList + ", " + book.get('consignee').get("street");
                    }
                    if(book.get('consignee').get("city")){
                        consigneeDetList = consigneeDetList + ", " + book.get('consignee').get("city");
                    }
                    if(book.get('consignee').get("country")){
                        consigneeDetList = consigneeDetList + ", " + book.get('consignee').get("country");
                    }
                    if(book.get('consignee').get("vat")){
                        consigneeDetList = consigneeDetList + ", " + book.get('consignee').get("vat");
                    }
                    book.set('consigneeDetail', consigneeDetList);
                } else {
                    book.set('consigneeDetail', '');
                }

                if(book.get('notify')){
                    if(book.get('notify').get("name")){
                        notifyDetList = book.get('notify').get("name");
                    }
                    if(book.get('notify').get("street")){
                        notifyDetList = notifyDetList + ", " + book.get('notify').get("street");
                    }
                    if(book.get('notify').get("city")){
                        notifyDetList = notifyDetList + ", " + book.get('notify').get("city");
                    }
                    if(book.get('notify').get("country")){
                        notifyDetList = notifyDetList + ", " + book.get('notify').get("country");
                    }
                    if(book.get('notify').get("vat")){
                        notifyDetList = notifyDetList + ", " + book.get('notify').get("vat");
                    }

                    book.set('notifyDetail', notifyDetList).save().then(function(){
                        //SUCCESS
                        new PNotify({
                            title: 'Saved',
                            text: 'You successfully saved details.',
                            type: 'success',
                            delay: 1000
                        });
                    }, function(){
                        //NOT SAVED
                        new PNotify({
                            title: 'Not saved',
                            text: 'A problem has occurred.',
                            type: 'error',
                            delay: 2000
                        });
                    });
                } else {
                    book.set('notifyDetail', '').save().then(function(){
                        //SUCCESS
                        new PNotify({
                            title: 'Saved',
                            text: 'You successfully saved details.',
                            type: 'success',
                            delay: 1000
                        });
                    }, function(){
                        //NOT SAVED
                        new PNotify({
                            title: 'Not saved',
                            text: 'A problem has occurred.',
                            type: 'error',
                            delay: 2000
                        });
                    });
                }
            } else {
                book.save().then(function(){
                    //SUCCESS
                    new PNotify({
                        title: 'Saved',
                        text: 'You successfully saved details.',
                        type: 'success',
                        delay: 1000
                    });
                }, function(){
                    //NOT SAVED
                    new PNotify({
                        title: 'Not saved',
                        text: 'A problem has occurred.',
                        type: 'error',
                        delay: 2000
                    });
                });
            }
        },


        /****************************************************************************************************
         * REVENUES TAB
         * */

        changeModeType: function( modeType, book_record ) {
            this.controllerFor('booking.main').set('booking_record', book_record);

            book_record.set('chargeMode', modeType).save().then(function(){
            }, function(){
                //NOT SAVED
                new PNotify({
                    title: 'Not saved',
                    text: 'A problem has occurred.',
                    type: 'error',
                    delay: 2000
                });
            });
        },

        /**
         funzione custom per applicare i costi standard per una specifica tratta

         @action update_applyCharge
         @for Booking - Revenues Tab - general sub-tab
         @param {Number} - unique key
         */
        update_applyCharge: function( book_record ) {
            var self = this, controller = self.controllerFor('booking.main'), app_controller = self.controllerFor('application'),
                data = this.getProperties();

            // se è stata selezionata una charge genero l'azione lato server per applicare il template dei costi a questo booking
            if( controller.searchApplyCharge !== "" && controller.searchApplyCharge !== null ){

                book_record.save().then(function(val){
                    data.billTo = val.get("client").get("id");
                    data.booking = val.get("id");
                    data.currency = val.get("currency");
                    data.changeRate = self.get("controller").get("changeRate");
                    data.charge = controller.searchApplyCharge.get("id");

                    $.post('api/custom/applyCharge?token=' + app_controller.token, data).then(function(response){
                        if (response.success) {
                            book_record.reload();
                            app_controller.set('autocompleteCharge', []);
                        }
                    });
                }, function(){
                    //NOT SAVED
                    new PNotify({
                        title: 'Not saved',
                        text: 'A problem has occurred.',
                        type: 'error',
                        delay: 2000
                    });
                });
            } else {
                //WARNING
                new PNotify({
                    title: 'Attention',
                    text: 'Please select a charge to apply.',
                    delay: 2000
                });
            }
        },

        /**
         azione di PUT per gli attributi presenti nella sotto-tab 'General' della tab 'Revenues' del booking

         @action update_general
         @for Booking - Revenues Tab - general sub-tab
         @param {String}
         @param {Number} - unique key
         */
        update_general: function( name, book_record ) {
            var self = this, controller = self.controllerFor('booking.main'), app_controller = self.controllerFor('application');

            //controllo che sia stato inserito il chargeMode (PP/COLL) in caso contrario lo setto a COLL
            if( !book_record.get('chargeMode') ) {
                book_record.set('chargeMode', 'PP');
            }

            book_record.save().then(function(){
                //SUCCESS
                new PNotify({
                    title: 'Saved',
                    text: 'You successfully saved general charge.',
                    type: 'success',
                    delay: 1000
                });

                controller.set('revenuesTabList.general', false);
                controller.set('revenuesTabList.bookingCharges', true);
                controller.set('revenuesTabList.containerCharges', false);
                controller.set('revenuesTabList.roroCharges', false);
                controller.set('revenuesTabList.bbCharges', false);
                controller.set('revenuesTabList.itemCharges', false);

                }, function(){
                    //NOT SAVED
                    new PNotify({
                        title: 'Not saved',
                        text: 'A problem has occurred.',
                        type: 'error',
                        delay: 2000
                    });
                });

        },


        /****************************************************************************************************
         * FREIGHT PLAN TAB
         *

        cambio di modalità fra il manual e il filter

         @action freightPlan_changeType
         @for Booking FreightPlan Tab
         @param {String}
         */
        freightPlan_changeMode: function( type, booking_record ) {
            var self = this, controller = self.controllerFor('booking.main'), app_controller = self.controllerFor('application');

            controller.set('research_is_active', false);
            controller.set('freightPlanList', []);

            controller.set('freightPlan_mode.search', false);
            controller.set('freightPlan_mode.manual', false);
            controller.set('freightPlan_mode.no_freight_plan', false);

            controller.set('freightPlan_mode.' + type, true);

            if( type === 'manual' ){
                this.store.findQuery("voyage").then(function(val){
                    app_controller.set("autocompleteVoyage", val);
                });
                controller.set('searchVoy', []);
            }

            if ( type === 'no_freight_plan' ) {
                booking_record.set('noFreightPlan', true).save();
            } else {
                booking_record.set('noFreightPlan', false).save();
            }



            //this.controllerFor('bookings.bookFreightSearch').send('closeSearch');
        },


        search_freigth_plan: function( booking_record ) {
            var self = this, controller = self.controllerFor('booking.main'), app_controller = self.controllerFor('application'),
                queryExpression = {}, searchPath = "";

            controller.set('research_is_active', true);

            if ( controller.freightPlan_mode.manual ){
                if( controller.searchVoy.get('length') !== 0 ) {   //FIXME: nel caso in cui sia selezionato qualcosa è UNDEFINED
                     //controllo che il viaggio che si sta per inserire non sia già contenuto nella lista

                    if( !controller.freightPlanList.get('length') ){
                        controller.freightPlanList.pushObject(controller.searchVoy);

                        controller.sorted_list.pushObject({
                            sort_index: Number(controller.freightPlanList.get('length')) - 1,
                            record_index: controller.searchVoy.get('id')
                        });
                        controller.set('searchVoy', []);

                    } else {
                        controller.freightPlanList.forEach(function( val, index ){
                            if( val === controller.searchVoy ){
                                new PNotify({
                                    title: 'Attention',
                                    text: 'This voyage was already added to the list.',
                                    type: 'warning',
                                    delay: 2000
                                });
                                controller.set('searchVoy', []);
                            } else {
                                if( index +1 === controller.freightPlanList.get('length') ){
                                    controller.freightPlanList.pushObject(controller.searchVoy);

                                    controller.sorted_list.pushObject({
                                        sort_index: Number(controller.freightPlanList.get('length')) - 1,
                                        record_index: controller.searchVoy.get('id')
                                    });
                                    controller.set('searchVoy', []);
                                }
                            }
                        });
                    }
                }

            } else if ( controller.freightPlan_mode.search ){
                var data = this.get("controller").getProperties('dtd', 'dtdRange', 'dta', 'dtaRange');

                controller.set('freightPlanList', []);
                if ( data.dtd ) {
                    searchPath = "dtd"; queryExpression[searchPath] = data.dtd;
                }
                if ( data.dta ) {
                    searchPath = "dta"; queryExpression[searchPath] = data.dta;
                } else {
                    var dta = moment(data.dtd).add(controller.weeksOut, 'w');
                    var format = moment(dta._d).format("YYYY-MM-DD");
                    searchPath = "dta"; queryExpression[searchPath] = format;
                }

                searchPath = "origin"; queryExpression[searchPath] = booking_record.get("origin").get("id");
                searchPath = "destination"; queryExpression[searchPath] = booking_record.get("destination").get("id");

                if ( controller.transhipmentNum !== 'All' ) {
                    searchPath = "transhipments"; queryExpression[searchPath] = controller.transhipmentNum;
                }

                self.store.findQuery('freightPlan', queryExpression ).then(function( results ){
                    controller.set('freightPlanList', results);
                });
            }
        },

        remove_freight_item: function( indexToRemove ){
            var self = this, controller = self.controllerFor('booking.main'),
                temp_array = [];

            $("#"+indexToRemove).parent().hide();

            $.each(controller.sorted_list, function(index, val){

                if( val.sort_index === indexToRemove ){

                    controller.sorted_list.splice(index, 1);  //elimino l'item selezionato dalla lista con il sort

                    $.each(controller.sorted_list, function(index, val){
                        temp_array.pushObject(controller.freightPlanList[ val.sort_index ]);  //riordino la lista dei viaggi in una variabile temporanea
                        val.sort_index = index;     //assegno il nuovo indice di sort (si torna all'ordine crescente, 0,1,2..)

                        if( index +1 === controller.sorted_list.get('length') ){
                            controller.set('freightPlanList', []);
                            controller.set('freightPlanList', temp_array);   //qunado ho finito di ordinare aggionro la lista di viaggi
                        }
                    });
                    return false;
                }
            });

        },


        isEmark_changeMode: function( val, leg_record, schedules_record ){
            leg_record.set( 'embarking', false );
            leg_record.set( 'disembarkation', false );

            if( val !== false ){
                if( schedules_record ){
                    schedules_record._data.schedules.forEach(function( other_leg, index ){
                        other_leg.set( val, false);
                        if( index +1 === schedules_record._data.schedules.get('length') ){
                            leg_record.set( val, true );
                        }
                    });
                } else {
                    leg_record.set( val, true );
                }
            }
        },

        /*
        * salvataggio del freight-plan: viene gestito in modo diverso per mode: MANUAL o mode: SEARCH

         @action save_freightPlan
         @for booking/partials/freight-plan/-manual-result.hbs
         @param { record } - booking
         @param { record } - poi
         @param { record } - poi
         */
        save_freightPlan: function( booking_record, book_origin, book_destination ){
            var self = this, controller = self.controllerFor('booking.main'),
                ordered_voyages = [], ordered_transhipments_leg = [], ordered_transhipments_poi = [], path = [], origin_leg = null, destination_leg = null,
                previous_disembark = null, next_is_child = false, ordered_voyages_without_child_voyage = [];

            if ( controller.freightPlan_mode.manual ){

                $.each(controller.sorted_list, function(index, val){
                    ordered_voyages.pushObject(controller.freightPlanList[ val.sort_index ]);  //riordino la lista dei viaggi in una variabile temporanea

                    if( index +1 === controller.sorted_list.get('length') ){ //quando ho aggiornato la lista procedo
                        ordered_voyages.forEach( function( val, index ){ //scorro 1 ad 1 i voyages


                            if( index === 0 ){       //primo voyage
                                    if( val.get('embarkingLeg') === book_origin){   //confronto la leg di imbarco del primo viaggio con l'origine del booking. devono essere uguali
                                        if( val.get('embark') && val.get('disembark') ){   //verifico che embark e disembark non siano nulli, tutti i viaggi devono averli

                                            if( val.get('childVoyages').get('length') && ordered_voyages.get('length') > 1 ){      //verifico se il voyage ha dei child voyages
                                                var next_voyage = controller.sorted_list[ index + 1 ].record_index;   //prendo il viaggio successivo
                                               //var val1 = val.get('data');
                                               // var val3 = val.get('childVoyages')

                                                    val.get('childVoyages').forEach(function( child, child_index ){   //per tutti i childs
                                                        if( next_voyage === child.get('id') ){  //verifico se il successivo è uno dei child di quello attuale
                                                            next_is_child = true;
                                                        }

                                                        if( child_index + 1 === val._data.childVoyages.get('length') ){    //quando ho controllato tutti i child...

                                                            origin_leg = val.get('embark');
                                                            path.pushObject(val.get('embark').get('id'));
                                                            path.pushObject(val.get('id'));
                                                            ordered_voyages_without_child_voyage.pushObject(val);
                                                            previous_disembark = val.get('disembarkationLeg');

                                                            if( !next_is_child ){   // se next_is_child === true non inserisco nel path e nei transhipments la destination leg e nel viaggio successivo non inserisco origin e voyage
                                                                ordered_transhipments_leg.pushObject(val.get('disembark'));
                                                                ordered_transhipments_poi.pushObject(val.get('disembark').get('poi'));
                                                                path.pushObject(val.get('disembark').get('id'));
                                                            }
                                                        }

                                                    });

                                            } else if ( ordered_voyages.get('length') === 1 ) {          //cè solo un voyage
                                                    origin_leg = val.get('embark');
                                                    destination_leg = val.get('disembark');
                                                    path.pushObject(val.get('embark').get('id'));
                                                    path.pushObject(val.get('id'));
                                                    path.pushObject(val.get('disembark').get('id'));
                                                    ordered_voyages_without_child_voyage.pushObject(val);

                                                    var newFreightPlan = self.store.createRecord('freightPlan', {
                                                        booking: booking_record,
                                                        origin: booking_record.get('origin'),
                                                        originLeg: origin_leg,
                                                        destination: booking_record.get('destination'),
                                                        destinationLeg:  destination_leg,
                                                        path: path
                                                    });

                                                    newFreightPlan.get('voyages').then(function(voyages) {
                                                        newFreightPlan.get('orderedVoyages').then(function(orderedVoyages) {
                                                            newFreightPlan.get('orderedTranshipmentLegs').then(function(orderedTranshipmentLegs) {
                                                                newFreightPlan.get('transhipmentLegs').then(function(transhipmentLegs) {
                                                                    newFreightPlan.get('transhipments').then(function(transhipments) {
                                                                        voyages.pushObjects( ordered_voyages_without_child_voyage );
                                                                        orderedVoyages.pushObjects( ordered_voyages_without_child_voyage );
                                                                        orderedTranshipmentLegs.pushObjects( ordered_transhipments_leg );
                                                                        transhipmentLegs.pushObjects( ordered_transhipments_leg );
                                                                        transhipments.pushObjects( ordered_transhipments_poi );

                                                                        newFreightPlan.save().then(function(){
                                                                            booking_record.reload();
                                                                            controller.set('freightPlanList', []);
                                                                            controller.set('sorted_list', []);
                                                                            new PNotify({
                                                                                title: 'Success',
                                                                                text: 'Record saved successfully.',
                                                                                type: 'success',
                                                                                delay: 2000
                                                                            });
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });

                                            } else {           // non ha un child e ci sono più voyages
                                                ordered_transhipments_leg.pushObject(val.get('disembark'));
                                                ordered_transhipments_poi.pushObject(val.get('disembark').get('poi'));

                                                origin_leg = val.get('embark');
                                                path.pushObject(val.get('embark').get('id'));
                                                path.pushObject(val.get('id'));
                                                path.pushObject(val.get('disembark').get('id'));
                                                ordered_voyages_without_child_voyage.pushObject(val);

                                                previous_disembark = val.get('disembarkationLeg');
                                            }

                                        } else {
                                            new PNotify({
                                                title: 'Attention',
                                                text: 'The first voyage does not have a transhipment.',
                                                type: 'warning',
                                                delay: 2000
                                            });
                                        }
                                    } else {
                                        new PNotify({
                                            title: 'Attention',
                                            text: 'The embarking of the first voyage does not match with booking origin.',
                                            type: 'warning',
                                            delay: 2000
                                        });
                                    }


                            } else if ( index +1 === ordered_voyages.get('length') ) {    //ultimo voyage
                                    if( val.get('disembarkationLeg') === book_destination ){ //confronto la leg di imbarco del primo viaggio con la destination del booking. devono essere uguali

                                        if( previous_disembark !== val.get('embarkingLeg') ) {
                                            new PNotify({
                                                title: 'Attention',
                                                text: 'Transhipments do not match.',
                                                type: 'warning',
                                                delay: 2000
                                            });
                                        } else {
                                            if( val.get('embark') && val.get('disembark') ){

                                                if( !next_is_child ){
                                                    ordered_transhipments_leg.pushObject(val.get('embark'));
                                                    ordered_transhipments_poi.pushObject(val.get('embark').get('poi'));
                                                    path.pushObject(val.get('embark').get('id'));
                                                    path.pushObject(val.get('id'));
                                                    ordered_voyages_without_child_voyage.pushObject(val);
                                                }

                                                destination_leg = val.get('disembark');
                                                path.pushObject(val.get('disembark').get('id'));

                                                var newFreightPlan = self.store.createRecord('freightPlan', {
                                                    booking: booking_record,
                                                    origin: booking_record.get('origin'),
                                                    originLeg: origin_leg,
                                                    destination: booking_record.get('destination'),
                                                    destinationLeg:  destination_leg,
                                                    path: path
                                                });

                                                newFreightPlan.get('voyages').then(function(voyages) {
                                                    newFreightPlan.get('orderedVoyages').then(function(orderedVoyages) {
                                                        newFreightPlan.get('orderedTranshipmentLegs').then(function(orderedTranshipmentLegs) {
                                                            newFreightPlan.get('transhipmentLegs').then(function(transhipmentLegs) {
                                                                newFreightPlan.get('transhipments').then(function(transhipments) {
                                                                    voyages.pushObjects( ordered_voyages_without_child_voyage );
                                                                    orderedVoyages.pushObjects( ordered_voyages_without_child_voyage );
                                                                    orderedTranshipmentLegs.pushObjects( ordered_transhipments_leg );
                                                                    transhipmentLegs.pushObjects( ordered_transhipments_leg );
                                                                    transhipments.pushObjects( ordered_transhipments_poi );

                                                                    newFreightPlan.save().then(function(){
                                                                        booking_record.reload();
                                                                        controller.set('freightPlanList', []);
                                                                        controller.set('sorted_list', []);
                                                                        new PNotify({
                                                                            title: 'Success',
                                                                            text: 'Record saved successfully.',
                                                                            type: 'success',
                                                                            delay: 2000
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });

                                            } else {
                                                new PNotify({
                                                    title: 'Attention',
                                                    text: 'The last voyage does not have a transhipment.',
                                                    type: 'warning',
                                                    delay: 2000
                                                });
                                            }
                                        }

                                    } else {
                                        new PNotify({
                                            title: 'Attention',
                                            text: 'The disembarkation of the last voyage does not match with booking destination.',
                                            type: 'warning',
                                            delay: 2000
                                        });
                                    }
                            } else {   //voyages centrali

                                if( val.get('embark') && val.get('disembark') ){
                                   if( previous_disembark !== val.get('embarkingLeg') ) {
                                       new PNotify({
                                           title: 'Attention',
                                           text: 'Transhipments do not match.',
                                           type: 'warning',
                                           delay: 2000
                                       });
                                   } else {

                                       if( val.get('childVoyages').get('length') ){   //verifico se il voyage ha un dei child voyages
                                           var this_is_child = next_is_child;
                                           next_is_child = false;

                                           var next_voyage = controller.sorted_list[ index + 1 ].record_index;  //prendo il viaggio successivo e vedo se fa parte dei childs

                                               val._data.childVoyages.forEach(function( child, child_index ){
                                                   if( next_voyage === child.get('id') ){
                                                       next_is_child = true;
                                                   }
                                                   if( child_index + 1 === val._data.childVoyages.get('length') ){
                                                       if( !this_is_child ){
                                                           origin_leg = val.get('embark');
                                                           path.pushObject(val.get('embark').get('id'));
                                                           path.pushObject(val.get('id'));
                                                           ordered_voyages_without_child_voyage.pushObject(val);
                                                       }
                                                       if( !next_is_child ){
                                                           ordered_transhipments_leg.pushObject(val.get('disembark'));
                                                           ordered_transhipments_poi.pushObject(val.get('disembark').get('poi'));
                                                           path.pushObject(val.get('disembark').get('id'));
                                                       }

                                                       previous_disembark = val.get('disembarkationLeg');
                                                   }
                                               });

                                       } else {
                                           if( !next_is_child ){
                                               ordered_transhipments_leg.pushObject(val.get('embark'));
                                               ordered_transhipments_poi.pushObject(val.get('embark').get('poi'));
                                               path.pushObject(val.get('embark').get('id'));
                                               path.pushObject(val.get('id'));
                                           }

                                           ordered_voyages_without_child_voyage.pushObject(val);
                                           ordered_transhipments_leg.pushObject(val.get('disembark'));
                                           ordered_transhipments_poi.pushObject(val.get('disembark').get('poi'));
                                           path.pushObject(val.get('disembark').get('id'));

                                           previous_disembark = val.get('disembarkationLeg');
                                           next_is_child = false;
                                       }
                                   }

                                } else {
                                    new PNotify({
                                        title: 'Attention',
                                        text: 'Some voyage not have the transhipment details.',
                                        type: 'warning',
                                        delay: 2000
                                    });
                                }
                            }
                        });
                    }
                });


            } else if ( controller.freightPlan_mode.search ) {
                var freightPlan_tempId = this.get("controller").get("freightPlanItemsList").filterBy("isChecked").mapBy("id").join(",").split(",");

                if( freightPlan_tempId.length > 1 ){
                    new PNotify({
                        title: 'Attention',
                        text: 'You can select only one freight plan.',
                        type: 'warning',
                        delay: 2000
                    });
                } else {
                    controller.freightPlanList.store.find('freightPlan', freightPlan_tempId[0]).then(function(val){
                       var freight = val;

                        var newFreightPlan = self.store.createRecord('freightPlan', {     //creazione del Freight Plan
                            booking: booking_record,
                            origin: val.get('origin'),
                            originLeg: val.get('originLeg'),
                            destination: val.get('destination'),
                            destinationLeg:  val.get('destinationLeg'),
                            path: val._data.paths
                        });

                        newFreightPlan.get('voyages').then(function(voyages) {
                            newFreightPlan.get('orderedVoyages').then(function(orderedVoyages) {
                                newFreightPlan.get('orderedTranshipmentLegs').then(function(orderedTranshipmentLegs) {
                                    newFreightPlan.get('transhipmentLegs').then(function(transhipmentLegs) {
                                        newFreightPlan.get('transhipments').then(function(transhipments) {
                                            voyages.pushObjects(val._data.voyages);
                                            orderedVoyages.pushObjects(val._data.orderedVoyages);
                                            orderedTranshipmentLegs.pushObjects(val._data.orderedTranshipmentLegs);
                                            transhipmentLegs.pushObjects(val._data.transhipmentLegs);
                                            transhipments.pushObjects(val._data.transhipments);

                                            newFreightPlan.save().then(function(){
                                                booking_record.reload();
                                                controller.set('freightPlanList', []);
                                                new PNotify({
                                                    title: 'Success',
                                                    text: 'Record saved successfully.',
                                                    delay: 2000
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                }
            }
        },


        /**Cancellazione del freightPlan associato al booking.

         @action change_freightPlans
         @for Booking FreightPlan Tab
         @param {Number} - unique key
         @param {Number} - unique key
         */
        change_freightPlans: function( frPlan_record, book_record ) {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('booking.main');

            //pulisco le legs in modo che gli attributi embark e disembark siano settati a false
            frPlan_record.get('orderedVoyages').then(function(voy){
                voy.get('schedules').then(function(schedules){
                    schedules.forEach(function(leg){
                        leg.set('embarking', false);
                        leg.set('disembarkation', false);
                    });
                });
            });

            frPlan_record.deleteRecord();
            frPlan_record.save().then(function(){
                //      *** FREIGHT PLAN

            self.store.findQuery("voyage").then(function(val){
                app_controller.set("autocompleteVoyage", val);
                controller.set('searchVoy', []);
            });

            book_record.reload();
//            }, function(){
//                //NOT SAVED
//                new PNotify({
//                    title: 'Not saved',
//                    text: 'A problem has occurred.',
//                    type: 'error',
//                    delay: 2000
//                });
            });

        },
        /****************************************************************************************************
         * CONTAINER/RORO/BB TAB - ITEM-LIST
         * */

        /**
         funzione custom per la creazione di copie identiche di un booking item. Viene passato alla
         funzione il numero di copie che si vogliono e il booking item da copiare.

         @action send_replica
         @for Booking - Item List Container/RoRo/BB
         */
        send_replica: function(){
            var self = this, controller = self.controllerFor('booking.main'), app_controller = self.controllerFor('application'),
                data = this.getProperties();

            data.token = app_controller.token;
            data.bookingItemId = controller.item_record.get('id');
            data.replica = controller.replicaNumber;

            $.post('api/custom/replica?token=' + app_controller.token, data).then(function(response){
                if (response.success) {
                    controller.booking_record.reload();
                }
            }, function(){
                // NOT SAVED
                new PNotify({
                    title: 'Not saved',
                    text: 'A problem has occurred.',
                    type: 'error',
                    delay: 2000
                });
            });
        },

        /**
         per spostare un booking item da un booking ad un altro.

         @action send_delay
         @for Booking - Tab Container/roro/bb
         */
        send_delay: function() {
            var self = this, controller = self.controllerFor('booking.main'), app_controller = self.controllerFor('application'),
                bookItemsList = this.get("controller").get("delayItemsList").filterBy("isChecked").mapBy("id").join(",").split(","),
                data = this.getProperties('token');

            data.token = App.token;
            data.bookingItem = bookItemsList;

            if(controller.codeBooking !== "" && controller.codeBooking !== null){
                data.booking = controller.bookingCodeId;
                $.post('api/custom/delay?token=' + app_controller.token, data).then(function(response){
                    if (response.success) {
                        controller.codeBooking = null;
                        controller.bookingCodeId = null;
                        self.transitionTo('booking.main', response);
                    }
                }, function(){
                    new PNotify({
                        title: 'Attention',
                        text: 'An error occurred.',
                        delay: 2000
                    });
                });
            } else {
                new PNotify({
                    title: 'Attention',
                    text: 'You did not selected booking to delay items.',
                    delay: 2000
                });
            }
        },

        /**
         * LOADED-ON
         per caricare degli item all'interno di un roro item. ciò implica il non conteggio dei metri quadri della merce caricata.

         @action send_loadedOn
         @for booking/partials/container/-item-list.hbs && booking/partials/roro/-item-list.hbs && booking/partials/bb/-item-list.hbs
         */
        send_loadedOn: function(){
            var self = this, controller = self.controllerFor('booking.main'), app_controller = self.controllerFor('application'),
                loadedOnList = this.get("controller").get("loadedOnItemsList").filterBy("isChecked").mapBy("id").join(",").split(",");       // recupero gli item selezioni per essere caricati

            if( controller.searchRoRoCode !== "" && controller.searchRoRoCode !== null ){
                loadedOnList.forEach(function(val, index){
                    self.store.find("bookingItem", val).then(function(bookItem){
                        bookItem.set("loadedOn", true);
                        bookItem.set("referringItemLoadedOn", controller.searchRoRoCode);       //definisco su quale roro vengono caricati
                        bookItem.save().then(function(){
                            if(loadedOnList.length -1 === index){
                                controller.set('loadedOnItemsList', []);
                                controller.booking_record.reload();     //necessaro il reload?
                            }
                        });
                    });
                });
            }
        },

        /**
         * LOADED-ON
         per togliere il loaded-on da uno specifico item in modo che vengano contati i suoi metri lineari.

         @action remove_loadedOn
         @for booking/partials/container/-item-list.hbs && booking/partials/roro/-item-list.hbs && booking/partials/bb/-item-list.hbs
         @param {record}  - booking
         @param {record}  - item
         */
        remove_loadedOn: function( booking, item_record ) {

            item_record.set("referringItemLoadedOn", null);
            item_record.set("loadedOn", false);
            item_record.save().then(function(val){
                booking.reload();
            });
        },

        /**
         funzione custom per la creazione di copie identiche di un booking item a livello dei Break Bulks.
         Viene passato alla funzione il numero di copie che si vogliono e il booking item da copiare.

         @action split
         @for Booking - BB Tab - Item List
         @param {Number} - unique key
         @param {Number}
         */
        split: function( booking, item_record, splitNumber ){
            var self = this, app_controller = self.controllerFor('application'),
                data = this.getProperties();

            data.token = app_controller.token;
            data.bookingItemId = item_record.get('id');
            data.split = splitNumber;

            $.post('api/custom/split?token=' + app_controller.token, data).then(function(response){
                if (response.success) {
                    item_record.reload();
                    booking.reload();
                    // NOT SAVED
                    new PNotify({
                        title: 'Success',
                        text: 'Well done.',
                        type: 'success',
                        delay: 2000
                    });
                }
            }, function(error){
                // NOT SAVED
                new PNotify({
                    title: 'Not saved',
                    text: 'A problem has occurred.',
                    type: 'error',
                    delay: 2000
                });
            });
        },

        /**
         Azione per vedere una sub-tab di un item in modalità EDIT

         @action goToView
         @for Booking Item List/NewItem
         @param {record} - record selezionato
         */
        goToView: function( itemRecord ){
            var self = this, controller = self.controllerFor('booking.main');
            controller.set('isView', false);

            controller.set('revenuesTable.revenues', true);
            controller.set('revenuesTable.costs', false);

            controller.set('itemId', itemRecord.get('id'));
            controller.set('item_record', itemRecord);

            controller.set('subTabLists.details', false);
            controller.set('subTabLists.haulage', false);
            controller.set('subTabLists.customs', false);
            controller.set('subTabLists.status', false);
            controller.set('subTabLists.revenues', false);
            controller.set('subTabLists.files', false);
            controller.set('subTabLists.goods', true);
            //controller.setSubTabs('subTabLists.goods');
            //controller.set('activeSubTab',"goods");

            //this.render("bookings.tabs.subTab.goods", { into: 'bookings.tabs.'+tu, outlet: 'subTab' });

            controller.set('itemListActive', true);
            controller.set('newContainerItemActive', false);
        },

        /**
         Gestione delle sotto-tab delle revenues

         @action setRevenuesTabs
         @for Revenues NavBar
         @param {String}
         @param {Number} - unique key
         */
        setRevenuesTabs: function( tabToActive ) {
            var self = this, controller = self.controllerFor('booking.main');

            controller.set('revenuesTable.revenues', true);
            controller.set('revenuesTable.costs', false);

            controller.set('revenuesTabList.general', false);
            controller.set('revenuesTabList.bookingCharges', false);
            controller.set('revenuesTabList.containerCharges', false);
            controller.set('revenuesTabList.roroCharges', false);
            controller.set('revenuesTabList.bbCharges', false);
            controller.set('revenuesTabList.itemCharges', false);
//
//            controller.set('isView', true);
//
//            controller.set('itemListActive', false);
//            controller.set('newContainerItemActive', false);

            controller.set('revenuesTabList.' + tabToActive, true);

        },


        /**
         Gestione delle sotto-tab delle revenues

         @action setRevenuesTable
         @for Revenues NavBar
         @param {String}
         @param {Number} - unique key
         */
        setRevenuesTable: function( tabToActive ) {
            var self = this, controller = self.controllerFor('booking.main');

            controller.set('revenuesTable.revenues', false);
            controller.set('revenuesTable.costs', false);

            controller.set('revenuesTable.' + tabToActive, true);
        },

//        /**
//         Gestione delle sotto-tab delle revenues
//
//         @action setRevenuesSubTable
//         @for Revenues NavBar
//         @param {String}
//         @param {Number} - unique key
//         */
//        setRevenuesSubTable: function( tabToActive ) {
//            var self = this, controller = self.controllerFor('booking.main');
//
//            controller.set('revenuesSubTable.revenues', false);
//            controller.set('revenuesSubTable.costs', false);
//
//            controller.set('revenuesSubTable.' + tabToActive, true);
//        },

        /**
         Gestione della vista a livello di booking item della pagina relativa alla creazione di un
         nuovo booking item o della lista dei booking item precedentemente creati:

         button "Go to view list" --> val = false
         button "Add Item" --> val = true

         @action setContainerTab
         @for Booking Item List/NewItem
         @param {Boolean}
         */
        setContainerTab: function( val ){
            var self = this, controller = self.controllerFor('booking.main');

            controller.set('itemListActive', val);
            controller.set('newContainerItemActive', val);

            controller.set('isView', false);

            //clear container tab
            controller.set('itemId', null);
            controller.set('item_record', null);
        },

        /**
         l'utente può scaricare un file

         @action download_file
         @for Booking Item List
         @param {record}
         */
        download_file: function( fileId ) {
            var self = this, app_controller = self.controllerFor('application'),
                path = 'api/files/' + fileId + '?token=' + app_controller.token + '&download=true';

            $.fileDownload(path)
                // .done(function () { alert('File download a success!'); })
                .fail(function () {
                    new PNotify({
                        title: 'Error',
                        text: 'The file was removed or cancelled.',
                        type: 'error',
                        delay: 4000
                    });
                });
        },
        /****************************************************************************************************
         * CONTAINER/RORO/BB TAB - NEW ITEM
         * */
        createRecord_item: function( bookItem_type, tu_type, item, booking_record, val ){
            var self = this, controller = self.controllerFor('booking.main'), app_controller = self.controllerFor('application');

            //this.store.find("booking", bookingId).then(function(book){
                var bookingItem = self.get('store').createRecord('bookingItem',  {
                    tu: tu_type,
                    packNum: 1,
                    booking: booking_record,
                    bookingItemType: bookItem_type,
                    shipper: booking_record.get('shipper'),
                    shipperDetail: booking_record.get('shipperDetail'),
                    consignee: booking_record.get('consignee'),
                    consigneeDetail: booking_record.get('consigneeDetail'),
                    notify: booking_record.get('notify'),
                    notifyDetail: booking_record.get('notifyDetail'),
                    customManifestHandler: booking_record.get('customManifestHandler'),
                    haulageType: "Merchant",
                    visibility: 'private'
                });

                if( item ) {    //è un item creato dalla sezione memo
                    bookingItem.set('referringMemo', item);
                }

                if(bookItem_type == "memo") {
                    bookingItem.set('eLength', controller.totMtl);
                    bookingItem.set('eWeight', controller.totWeight);
                }

                bookingItem.save().then(function(bookPromise){
                    if(bookItem_type == "item") {

                        var freightEquipment = self.get('store').createRecord('freightEquipment',  {
                            booking: booking_record
                        });

                        freightEquipment.get('bookingItems').then(function(bookItem) {
                            bookItem.pushObject(bookPromise);
                            freightEquipment.save().then(function(freightPromise){

                                bookPromise.get('freightEquipments').then(function(freightEq) {
                                    freightEq.pushObject(freightPromise);

                                    bookPromise.save().then(function(){
                                        booking_record.reload();

                                        //at the end
                                        self.store.findQuery("equipment").then(function(comp){
                                            app_controller.set("autocompleteEquipment", comp);
                                        });

                                        controller.set('subTabLists.details', false);
                                        controller.set('subTabLists.haulage', false);
                                        controller.set('subTabLists.customs', false);
                                        controller.set('subTabLists.status', false);
                                        controller.set('subTabLists.revenues', false);
                                        controller.set('subTabLists.files', false);
                                        controller.set('subTabLists.goods', true);

                                        controller.set('itemListActive', val);
                                        controller.set('newContainerItemActive', false);

                                        controller.set('isView', false);

                                        controller.set('item_record', bookPromise);
                                        controller.set('itemId', bookPromise.id);

//                                        controller.setSubTabs('subTabLists.goods');
//                                        controller.set('activeSubTab',"goods");
//
//
//                                        self.render("bookings.tabs.subTab.goods", {
//                                            into: 'bookings.tabs.' + controller.activeTab,
//                                            outlet: 'subTab' });

                                    }, function(){
                                        //NOT SAVED
                                        new PNotify({
                                            title: 'Not saved',
                                            text: 'A problem has occurred.',
                                            type: 'error',
                                            delay: 2000
                                        });
                                    });
                                });

                            });
                        });
                    } else {

                        controller.set('totMtl', null);
                        controller.set('totWeight', null);
                        booking_record.reload();
                    }
                }, function(){
                    //NOT SAVED
                    new PNotify({
                        title: 'Not saved',
                        text: 'A problem has occurred.',
                        type: 'error',
                        delay: 2000
                    });
                });
           // });
        },


        /***********************************************************************************************************
         * CONTAINER/RORO/BB - EDIT ITEM
         * */


        /*  GOODS TAB
         * ******************
         Azione richiamata alla selezione di un Type di container. Vengono quindi estratti tutti i container
         facenti parte di quella tipologia per poi essere mostrati nel campo di ricerca 'Identifier'.
         Questo permette all'utente di vedere una lista filtrata (per tipo) di equipment.

         @action filterIdentifier
         @for Tab container - SubTab goods
         @param {Number} - unique key
         @return 'autocompleteEquipment' con valori filtrati in base al tipo di equipment classification selezionato
         */
        filterIdentifier: function(eqUnit) {
            var self = this, controller = self.controllerFor('booking.main'), app_controller = self.controllerFor('application'),
                queryExpression = {}, searchPath = "";

            app_controller.set("autocompleteEquipment", []);

            searchPath = 'equipmentClassification';
            queryExpression[searchPath] = eqUnit.get('id');
            searchPath = 'equipmentType';
            queryExpression[searchPath] = eqUnit.get('equipmentType');

            this.store.findQuery("equipment", queryExpression).then(function(val){
                app_controller.set("autocompleteEquipment", val);
            });
        },



        /*  HAULAGE TAB
         * ******************
         selezione del tipo di haulage per uno specifico booking item

         @action haulageType
         @for Booking - Haulage subTab
         @param {String} - Merchant/Carrier
         */
        haulageType: function( val ){
            var controller = this.controllerFor('booking.main');

            controller.item_record.set("haulageType", val).save();
        },


        /*  HAULAGE TAB
         * ******************
         gestore delle azioni per il subTab Haulage (new edit save close remove)

         @action carrierManager
         @for Booking - Files Tab
         @param {String}
         @param {String}
         @param {Boolean}
         @param {Number} - unique key
         */
        carrierManager: function(fun, val, bool, id, record) {
            var self = this, controller = self.controllerFor('booking.main'),
                stringCarrier = null, stringPickUpCompany = null;

            if( fun === "new" ) {
//           *** CREATE new carrier haulage
                //this.store.find("bookingItem", controller.itemId).then(function(bookItem){
                    var haulage = self.get('store').createRecord('haulage',  {
                        bookingItem: controller.item_record,
                        visibility: 'private'
                    });
                    haulage.save().then(function(hau){
                        controller.set("haulage_record", hau);
                        controller.set("haulageId", hau.id);
                        controller.item_record.reload();
                        controller.set(val, bool);
                    });
                //});

            } else if (fun === "close") {
                controller.set(val, bool);

            } else if (fun === "save") {
//             *** SET new carrier haulage
                //this.store.find("haulage", controller.haulageId).then(function(hau){
                    if(controller.haulage_record.get('pickUpCompany')){
                        if(controller.haulage_record.get('pickUpCompany').get('name')) {
                            stringPickUpCompany = controller.haulage_record.get('pickUpCompany').get('name');
                        }
                        controller.haulage_record.set('pickUpCompanyDetail', stringPickUpCompany);
                    } else {
                        controller.haulage_record.set('pickUpCompanyDetail', stringPickUpCompany);
                    }

                    if(controller.haulage_record.get('carrier')){
                        if(controller.haulage_record.get('carrier').get('name')) {
                            stringCarrier = controller.haulage_record.get('carrier').get('name');
                        }
                        if(controller.haulage_record.get('carrier').get('street')) {
                            stringCarrier = stringCarrier + ", " + controller.haulage_record.get('carrier').get('street');
                        }
                        if(controller.haulage_record.get('carrier').get('city')) {
                            stringCarrier = stringCarrier + ", " + controller.haulage_record.get('carrier').get('city');
                        }
                        if(controller.haulage_record.get('carrier').get('country')) {
                            stringCarrier = stringCarrier + ", " + controller.haulage_record.get('carrier').get('country');
                        }
                        if(controller.haulage_record.get('carrier').get('phone')) {
                            stringCarrier = stringCarrier + ", " + controller.haulage_record.get('carrier').get('phone');
                        }
                        if(controller.haulage_record.get('carrier').get('vat')) {
                            stringCarrier = stringCarrier + ", " + controller.haulage_record.get('carrier').get('vat');
                        }
                        controller.haulage_record.set('carrierDetail', stringCarrier);
                    } else {
                        controller.haulage_record.set('carrierDetail', stringCarrier);
                    }
                    controller.haulage_record.save().then(function(){
                        controller.set(val, bool);
                    });
                //});

            } else if (fun === "edit") {

                controller.set("haulage_record", record);
                controller.set("haulageId", id);
                controller.set(val, bool);


            } else if (fun === "remove") {
//                this.store.find("haulage", id).then(function(hau){
                    record.deleteRecord();
                    record.save();
//                });
            }
        },


        /*  HAULAGE TAB
         * ******************
         funzione custom per la pick up request.

         @action haulagePickUpRequest
         @for Booking - haulage subTab
         @param {number} - unique key
         @param {number} - unique key
         */
        haulagePickUpRequest: function(bookItemId, haulage_record) {
            var self = this, controller = self.controllerFor('booking.main'), app_controller = self.controllerFor('application'),
                data = this.getProperties();

            data.haulageId = haulage_record.get('id');

            $.post('api/custom/haulagePickUpRequest?token=' + app_controller.token, data).then(function(response){
                if (response.success) {
                    new PNotify({
                        title: 'Success',
                        text: 'The haulage pick up request was successfully generated.',
                        type: 'success',
                        delay: 2000
                    });
                    haulage_record.reload();

                } else {
                    new PNotify({
                        title: 'Error',
                        text: 'An error was occurred.',
                        type: 'error'
                    });
                }
            }, function(){
                new PNotify({
                    title: 'Error',
                    text: 'An error was occurred.',
                    type: 'error'
                });
            });
        },


        /*  HAULAGE TAB
         * ******************
         invio della mail dopo aver effettuato la pick up request

         @action send_haulagePickUpRequestEmail
         @for Booking - haulage subTab
         @param {number} - unique key
         */
        send_haulagePickUpRequestEmail: function(haulage) {
            var self = this, controller = self.controllerFor('booking.main'), app_controller = self.controllerFor('application'),
                data = this.getProperties();

            data.haulageId = haulage.get('id');

            $.post('api/custom/haulagePickUpRequestEmail?token=' + app_controller.token, data).then(function(response){
                if (response.success) {
                    new PNotify({
                        title: 'Success',
                        text: 'The e-mail was successfully sent.',
                        type: 'success',
                        delay: 2000
                    });
                }
            }, function(response){
                var json = response.responseText, obj = JSON.parse(json);

                new PNotify({
                    title: 'Error',
                    text: obj.error,
                    type: 'error'
                });
            });

        },

        /*  STATUS TAB
         * ******************
         cambio degli status di un booking item. per facilitare l'utente ad ogni cambio di stato vengono settate:
         la data di fine dello stato precedente viene settata con la data di oggi e la data di
         inizio del nuovo stato è settata ad oggi.

         @action progressBar_changeState
         @for Booking - STATUSES Sub-Tab
         @param {Number} - unique key
         @param {String}
         */
        progressBar_changeState: function( frEquipment_record, item){
            var self = this, controller = self.controllerFor('booking.main'),
                myIndex = null, today = new Date();

            //verifico se sono al primo stato
            if(frEquipment_record.get("currentStatus") == null) {
                frEquipment_record.set("currentStatus", controller.statuses[0])
                    .set("currentStatusCode", controller.statusesCode[0])
                    .set("currentStatusDateFrom", moment(today).format("YYYY-MM-DD"));

                var status = self.get('store').createRecord('equipmentStatus', {
                    status: frEquipment_record.get("currentStatus"),
                    statusCode: frEquipment_record.get("currentStatusCode"),
                    equipment: frEquipment_record.get("equipment"),
                    bookingItem: item,
                    freightEquipment: frEquipment_record.get("id"),
                    from: moment(today).format("YYYY-MM-DD")
                });

                status.save().then(function(eqStatus){
                    frEquipment_record.get('orderedEquipmentStatuses').then(function(eqStatuses){
                        eqStatuses.pushObject(eqStatus);
                        frEquipment_record.save().then(function(){
                            item.reload();
                        });
                    });

                });


                //per gli altri stati
            } else if(frEquipment_record.get("currentStatus") != "Delivered to Receiver") {
                var myIndex = null;

                if(item.get('tu') === "container") {
                    myIndex = controller.statuses.indexOf(frEquipment_record.get("currentStatus")) + 1;
                } else {
                    myIndex = controller.statuses_roro_bb.indexOf(frEquipment_record.get("currentStatus")) + 1;
                }


                frEquipment_record.get('orderedEquipmentStatuses').then(function(eqStatuses){
                    var lastId = eqStatuses.get("lastObject").get("id");
                    self.store.find("equipmentStatus", lastId).then(function(lastObj){
                        if(lastObj.get('to') === null){
                            lastObj.set("to", moment(today).format("YYYY-MM-DD"));
                        }
                    });
                });

                var status = self.get('store').createRecord('equipmentStatus',  {
                    equipment: frEquipment_record.get("equipment"),
                    bookingItem:  item,
                    freightEquipment: frEquipment_record.get("id"),
                    from: moment(today).format("YYYY-MM-DD")
                });
                if(item.get('tu') === "container") {
                    status.set('status', controller.statuses[myIndex]).set('statusCode', controller.statusesCode[myIndex])
                } else {
                    status.set('status', controller.statuses_roro_bb[myIndex]).set('statusCode', controller.statusesCode_roro_bb[myIndex])
                }

                status.save().then(function(eqStatus){
                    frEquipment_record.get('orderedEquipmentStatuses').then(function(eqStatuses){
                        eqStatuses.pushObject(eqStatus);

                        if(item.get('tu') === "container") {
                            frEquipment_record.set('currentStatus', controller.statuses[myIndex])
                                .set('currentStatusCode', controller.statusesCode[myIndex])
                                .set("currentStatusDateFrom", moment(today).format("YYYY-MM-DD"));
                        } else {
                            frEquipment_record.set('currentStatus', controller.statuses_roro_bb[myIndex])
                                .set('currentStatusCode', controller.statusesCode_roro_bb[myIndex])
                                .set("currentStatusDateFrom", moment(today).format("YYYY-MM-DD"));
                        }
                        frEquipment_record.save().then(function(){
                            item.reload();
                        });
                    });

                });
            }
        },

        /*  STATUS TAB
         * ******************
         rimozione dell'ultimo status dalla lista dei booking item statuses

         @action progressBar_removeState
         @for Booking - STATUSES Sub-Tab
         @param {Number} - unique key
         @param {String}
         */
        progressBar_removeState: function( frEquipment_record, item ){
            var self = this, controller = self.controllerFor('booking.main'), myIndex = null;

            frEquipment_record.get('orderedEquipmentStatuses').then(function(eqStatuses) {
                    eqStatuses.popObject();
                    var last = eqStatuses.get('lastObject');

                    if( item.get('tu') === "container" ) {
                        myIndex = controller.statuses.indexOf(frEquipment_record.get("currentStatus")) - 1;
                        frEquipment_record.set("currentStatus", controller.statuses[myIndex])
                            .set("currentStatusCode", controller.statusesCode[myIndex])
                            .set("currentStatusDateFrom", last.get('from'));
                    } else {
                        myIndex = controller.statuses_roro_bb.indexOf(frEquipment_record.get("currentStatus")) - 1;
                        frEquipment_record.set("currentStatus", controller.statuses_roro_bb[myIndex])
                            .set("currentStatusCode", controller.statusesCode_roro_bb[myIndex])
                            .set("currentStatusDateFrom", last.get('from'));
                    }

                frEquipment_record.save().then(function(){
                    item.reload();
                        });
                    });
        },

        /**
         azione PUT per il salvataggio dei costi: bookingCharges, Container/Roro/BB Charges

         @action update_Charges
         @for Booking - Revenues Tab - booking/container/roro/bb sub-tab
         @param {String} - booking/container/roro/bb
         @param {Number} - unique key
         @param {String}
         @param {String}
         */
        update_Charges: function( next, book_record, type, entityType) {
            var self = this, controller = self.controllerFor('booking.main');

            book_record.get("chargeItems").then(function(chargeIt){
                chargeIt.forEach(function(charge){

                    if(type === charge.get('type') && entityType === charge.get('entityType')) {

                        charge.save().then(function(){
                            if(charge === book_record.get("chargeItems").get("lastObject")) {
                                //SUCCESS
                                new PNotify({
                                    title: 'Saved',
                                    text: 'You successfully saved charge.',
                                    type: 'success',
                                    delay: 1000
                                });

                                controller.set('revenuesTabList.general', false);
                                controller.set('revenuesTabList.bookingCharges', false);
                                controller.set('revenuesTabList.containerCharges', false);
                                controller.set('revenuesTabList.roroCharges', false);
                                controller.set('revenuesTabList.bbCharges', false);
                                controller.set('revenuesTabList.itemCharges', false);

                                controller.set('revenuesTabList.' + next, true);

                            }
                        }, function(){
                            //NOT SAVED
                            new PNotify({
                                title: 'Not saved',
                                text: 'A problem has occurred.',
                                type: 'error',
                                delay: 2000
                            });
                        });
                    }  else if (charge === book_record.get("chargeItems").get("lastObject")) {

                        //SUCCESS
                        new PNotify({
                            title: 'Saved',
                            text: 'You successfully saved charge.',
                            type: 'success',
                            delay: 1000
                        });

                        controller.set('revenuesTabList.general', false);
                        controller.set('revenuesTabList.bookingCharges', false);
                        controller.set('revenuesTabList.containerCharges', false);
                        controller.set('revenuesTabList.roroCharges', false);
                        controller.set('revenuesTabList.bbCharges', false);
                        controller.set('revenuesTabList.itemCharges', false);

                        controller.set('revenuesTabList.' + next, true);
                    }
                });
            });

        },

        /*  REVENUES TAB
         * ********************
         azione POST per l'aggiunta di un nuovo charge item

         @action add_ChargeItem
         @for Booking - Revenues Tab - booking/container/roro/bb sub-tab
         @param {Number} - unique key
         @param {Number} - unique key
         @param {String} - container/roro/bb/none
         @param {String} - booking/item
         */
        add_ChargeItem: function( booking_record, type, enType, is_shipowner ) {
            var self = this, controller = self.controllerFor('booking.main'), app_controller = self.controllerFor('application'),
                data = this.getProperties();

                //this.store.find('company', controller.booking_record.get("client")).then(function(client){
                data.changeRate = self.get("controller").get("newCharge");

                var chItem = self.get('store').createRecord('chargeItem', {
                    name: data.changeRate,
                    booking: booking_record,
                    //originalRevenue: 0,
                    //originalRevenueCurrency: booking_record.get("currency"),
                    //revenue: 0,
                    //revenueCurrency: booking_record.get("currency"),
                    //originalCost: 0,
                    //originalCostCurrency: booking_record.get("currency"),
                    //cost: 0,
                    //costCurrency: booking_record.get("currency"),
                    billTo: booking_record.get("client"),
                    num: 1
                });

            if ( is_shipowner ) {
                chItem.set('chargeType', 'cost');
                chItem.set('cost', 0);
                chItem.set('costCurrency', booking_record.get("currency"));
            } else {
                chItem.set('chargeType', 'revenue');
                chItem.set('originalRevenue', 0);
                chItem.set('originalRevenueCurrency', booking_record.get("currency"));
                chItem.set('revenue', 0);
                chItem.set('revenueCurrency', booking_record.get("currency"));
            }

                var myChargeItem = self.get("controller").get('ChargesAll').filterBy('value', data.changeRate);

                //se l'entità è di tipo item passo l'id dell'item associato a questo charge
                if(enType === 'item') {
                    chItem.set('bookingItem', controller.item_record);
                }

                myChargeItem.every(function(item) {
                    chItem.set('code', item.code);
                    chItem.set('type', type);
                    chItem.set('entityType', enType);

                    if(type === 'container') {
                        chItem.set('multiplier', 'QTY');
                    } else if(type === 'roro') {
                        chItem.set('multiplier', 'LNG');
                    } else if(type === 'bb') {
                        chItem.set('multiplier', 'VOL');
                    } else {
                        chItem.set('multiplier', 'NUM');
                    }

                    chItem.save().then(function(){
//                        if(type === 'roro') {
//                            app_controller.autocompleteRoRo.pushObject(myVal);
//                        }
                        booking_record.reload();
                        if( is_shipowner ){
                            controller.set('revenuesTable.revenues', false);
                            controller.set('revenuesTable.costs', true);
                        } else {
                            controller.set('revenuesTable.revenues', true);
                            controller.set('revenuesTable.costs', false);
                        }
                        if(enType === 'item') {
                            controller.item_record.reload();
                        }

                    });
                });
        },

        /*  FILES TAB
         * ******************
         update selected file

         @action update_filesList
         @for Booking - Files Tab
         @param {Number} - unique key
         @param {String}
         @param {String}
         */
        update_filesList: function(val, mod, $btn){
            this.store.find(mod, val).then(function(myval){
                myval.reload().then(function(){
                    $btn.button('reset');
                });
            });
        },

        /*  FILES TAB
         * ******************
         funzione custom per la generazione della cartella del booking

         @action generate_bookFolder
         @for Booking
         @param {number} - unique key
         @return file di tipo booking folder
         */
        generate_bookFolder: function(booking_record) {
            var self = this, controller = self.controllerFor('booking.main'), app_controller = self.controllerFor('application'),
                data = this.getProperties();

            $('#button_generate').button('generating');
            data.bookingId = booking_record.get('id');

                $.post('api/custom/bookingFolder?token=' + app_controller.token, data).then(function(response){
                    if (response.success) {
                        booking_record.reload().then(function(){
                            $('#button_generate').button('reset');
                        });
                    } else {
                        $('#button_generate').button('reset');

                        new PNotify({
                            title: 'Error',
                            text: 'A problem was occurred.',
                            type: 'error',
                            delay: 4000
                        });
                    }
                }, function(){
                    $('#button_generate').button('reset');

                    new PNotify({
                        title: 'Error',
                        text: 'A problem was occurred.',
                        type: 'error',
                        delay: 4000
                    });
                });

        },

        /*  FILES TAB
         * ******************
         funzione custom per la generazione del documento di booking confirmation.

         @action generate_confirmation
         @for Booking
         @param {number} - unique key
         @return file di tipo booking confirmation
         */
        generate_confirmation: function(booking_record) {
            var self = this, controller = self.controllerFor('booking.main'), app_controller = self.controllerFor('application'),
                data = this.getProperties();

            data.bookingId = booking_record.get('id');

            $.post('api/custom/bookingConfirmation?token=' + app_controller.token, data).then(function(response){
                if (response.success) {
                    new PNotify({
                        title: 'Success',
                        text: 'The booking confirmation was successfully generated.',
                        type: 'success',
                        delay: 2000
                    });
                    booking_record.reload();
                } else {
                    new PNotify({
                        title: 'Error',
                        text: 'An error was occurred.',
                        type: 'error'
                    });
                }
            }, function(){
                new PNotify({
                    title: 'Error',
                    text: 'An error was occurred.',
                    type: 'error'
                });
            });
        },

        /*  FILES TAB
         * ******************
         invio della mail dopo la creazione della booking confirmation o della booking note.

         @action send_bookingConfirmationEmail
         @for Booking
         @param {number} - unique key
         @param {string} - tipo di documento che deve essere inviato per mail (confirmation/note)
         */
        send_bookingConfirmationEmail: function(booking_record, type) {
            var self = this, controller = self.controllerFor('booking.main'), app_controller = self.controllerFor('application'),
                data = this.getProperties();

            data.bookingId = booking_record.get('id');
            if(type === 'confirmation'){
                $.post('api/custom/bookingConfirmationEmail?token=' + app_controller.token, data).then(function(response){
                    if (response.success) {
                        new PNotify({
                            title: 'Success',
                            text: 'The e-mail was successfully sent.',
                            type: 'success',
                            delay: 2000
                        });
                    }
                }, function(response){
                    var json = response.responseText, obj = JSON.parse(json);

                    new PNotify({
                        title: 'Error',
                        text: obj.error,
                        type: 'error'
                    });
                });

            } else if(type === 'note') {
                $.post('api/custom/bookingNoteEmail?token=' + app_controller.token, data).then(function(response){
                    if (response.success) {
                        new PNotify({
                            title: 'Success',
                            text: 'The e-mail was successfully sent.',
                            type: 'success',
                            delay: 2000
                        });
                    }
                }, function(response){
                    var json = response.responseText, obj = JSON.parse(json);

                    new PNotify({
                        title: 'Error',
                        text: obj.error,
                        type: 'error'
                    });
                });
            }
        },

        /*  FILES TAB
         * ******************
         azione di rimozione di un file.

         @action remove_file
         @for Booking - Tab Files
         */
        remove_file: function(){
            var controller = this.controllerFor('booking.main');

            controller.file_record.deleteRecord();
            controller.file_record.save();
        },

        save_editItem: function( booking_record, fun_status ){
            var self = this, controller = self.controllerFor('booking.main'), app_controller = self.controllerFor('application');

            if( controller.subTabLists.revenues ){
                    booking_record.get("chargeItems").filter(function(charge){

                        charge.save().then(function(){
                            if(charge === booking_record.get("chargeItems").get("lastObject")) {
                                // SUCCESS
                                new PNotify({
                                    title: 'Saved',
                                    text: 'You successfully saved new booking item.',
                                    type: 'success',
                                    delay: 1000
                                });

                                controller.set('subTabLists.details', false);
                                controller.set('subTabLists.haulage', false);
                                controller.set('subTabLists.customs', false);
                                controller.set('subTabLists.status', false);
                                controller.set('subTabLists.revenues', false);
                                controller.set('subTabLists.files', false);
                                controller.set('subTabLists.goods', true);

                            }
                        }, function(){
                            // NOT SAVED
                            new PNotify({
                                title: 'Not saved',
                                text: 'A problem has occurred.',
                                type: 'error',
                                delay: 2000
                            });
                        });
                    });

            } else if ( controller.subTabLists.status ){

                controller.item_record.get("freightEquipments").filter(function (frEquipment) {

                    frEquipment.get('orderedEquipmentStatuses').then(function(eqStatuses) {
                        var length = eqStatuses.get("length");
                        var count = 1;
                        //check che ci sia almeno uno stato nell array
                        if(eqStatuses.get("firstObject")) {

                            eqStatuses.filter(function(eqStatus){
                                eqStatus.save().then(function(){

                                    if(length === count){
                                        frEquipment.set('currentStatusDateFrom', eqStatuses.get("lastObject").get('from')).save().then(function(val){
                                            // SUCCESS
                                            new PNotify({
                                                title: 'Saved',
                                                text: 'You successfully saved booking item.',
                                                type: 'success',
                                                delay: 1000
                                            });
//                                            if( app_controller.companyType === 'shipowner' ){
//                                                controller.set('subTabLists.details', false);
//                                                controller.set('subTabLists.haulage', false);
//                                                controller.set('subTabLists.customs', false);
//                                                controller.set('subTabLists.status', false);
//                                                controller.set('subTabLists.revenues', false);
//                                                controller.set('subTabLists.files', false);
//                                                controller.set('subTabLists.goods', true);
//                                            } else{
                                                controller.set('subTabLists.details', false);
                                                controller.set('subTabLists.haulage', false);
                                                controller.set('subTabLists.customs', false);
                                                controller.set('subTabLists.status', false);
                                                controller.set('subTabLists.revenues', true);
                                                controller.set('subTabLists.files', false);
                                                controller.set('subTabLists.goods', false);
//                                            }
                                        });
                                    }
                                    count = count +1;
                                }, function(){
                                    // NOT SAVED
                                    new PNotify({
                                        title: 'Not saved',
                                        text: 'A problem has occurred.',
                                        type: 'error',
                                        delay: 2000
                                    });
                                });

                            });
                            //altrimenti passo alla tab successiva
                        } else {
//                            if(app_controller.companyType == 'shipowner'){
//                                controller.set('subTabLists.details', false);
//                                controller.set('subTabLists.haulage', false);
//                                controller.set('subTabLists.customs', false);
//                                controller.set('subTabLists.status', false);
//                                controller.set('subTabLists.revenues', false);
//                                controller.set('subTabLists.files', false);
//                                controller.set('subTabLists.goods', true);
//                            } else{
                                controller.set('subTabLists.details', false);
                                controller.set('subTabLists.haulage', false);
                                controller.set('subTabLists.customs', false);
                                controller.set('subTabLists.status', false);
                                controller.set('subTabLists.revenues', true);
                                controller.set('subTabLists.files', false);
                                controller.set('subTabLists.goods', false);
//                            }
                        }
                    });
                });

            } else if ( controller.subTabLists.customs ){

                booking_record.save().then(function(){
                        // SUCCESS
                        new PNotify({
                            title: 'Saved',
                            text: 'You successfully saved new booking item.',
                            type: 'success',
                            delay: 1000
                        });

                    controller.set('subTabLists.details', false);
                    controller.set('subTabLists.haulage', false);
                    controller.set('subTabLists.customs', false);
                    controller.set('subTabLists.status', true);
                    controller.set('subTabLists.revenues', false);
                    controller.set('subTabLists.files', false);
                    controller.set('subTabLists.goods', false);
                    }, function(){
                        // NOT SAVED
                        new PNotify({
                            title: 'Not saved',
                            text: 'A problem has occurred.',
                            type: 'error',
                            delay: 2000
                        });
                    });

            } else if ( controller.subTabLists.goods ){

                switch ( controller.item_record.get('tu') ){
                    case 'container':
                        var eqClass = null;
                            controller.item_record.get("freightEquipments").filter(function (frEquipment) {
                                if (fun_status === 'E' || fun_status === 'L') {
                                    if ( frEquipment.get('equipment') ) {
                                        eqClass = frEquipment.get('equipment');
                                        frEquipment.set("equipmentCode", eqClass.get('code'));
                                    } else {
                                        frEquipment.set("equipmentCode", null);
                                    }
                                    if ( frEquipment.get('equipmentClassification') ) {
                                        eqClass = frEquipment.get('equipmentClassification');
                                        frEquipment.set("equipmentClassificationName", eqClass.get('name')).set("equipmentClassificationSizeCode", eqClass.get('sizeCode')).set("equipmentClassificationTypeCode", eqClass.get('typeCode')).set("equipmentClassificationIsoCode", eqClass.get('isoCode'));
                                    } else {
                                        frEquipment.set("equipmentClassificationName", null).set("equipmentClassificationSizeCode", null).set("equipmentClassificationTypeCode", null).set("equipmentClassificationIsoCode", null);
                                    }
                                }

                                frEquipment.save().then(function () {
                                    controller.item_record.save().then(function () {
                                        // SUCCESS
                                        new PNotify({
                                            title: 'Saved',
                                            text: 'You successfully saved new booking item.',
                                            type: 'success',
                                            delay: 1000
                                        });

                                        controller.set('subTabLists.details', true);
                                        controller.set('subTabLists.haulage', false);
                                        controller.set('subTabLists.customs', false);
                                        controller.set('subTabLists.status', false);
                                        controller.set('subTabLists.revenues', false);
                                        controller.set('subTabLists.files', false);
                                        controller.set('subTabLists.goods', false);

                                    }, function () {
                                        // NOT SAVED
                                        new PNotify({
                                            title: 'Not saved',
                                            text: 'A problem has occurred.',
                                            type: 'error',
                                            delay: 2000
                                        });
                                    });

                                }, function () {
                                    // NOT SAVED
                                    new PNotify({
                                        title: 'Not saved',
                                        text: 'A problem has occurred.',
                                        type: 'error',
                                        delay: 2000
                                    });
                                });
                            });

                        break;
                    case 'roro':
                        var chass_len = controller.item_record.get('chassisNum').length;
                        ( controller.item_record.get('chassisNum') !== null && chass_len > 0 ? $('span#1.input-group-addon').removeClass('alert-danger') : $('span#1.input-group-addon').addClass('alert-danger'));

                        if ( controller.item_record.get('chassisNum') !== null && chass_len > 0 ) {
                            $('div.alert.alert-danger').css('display', 'none');
                            if (fun_status === 'E' || fun_status === 'Req') {
                                if(controller.item_record.get('eLength') && controller.item_record.get('eWidth') && controller.item_record.get('eHeight')) {
                                    controller.item_record.set('eVolume', controller.item_record.get('is_eVolume'));
                                }
                            } else if (fun_status === 'L') {
                                if(controller.item_record.get('length') && controller.item_record.get('width') && controller.item_record.get('height')) {
                                    controller.item_record.set('volume', controller.item_record.get('is_volume'));
                                }
                            }

                            controller.item_record.get("freightEquipments").filter(function (frEquipment) {
                                if (fun_status === 'E' || fun_status === 'L') {
                                    if ( frEquipment.get('equipment') ) {
                                        eqClass = frEquipment.get('equipment');
                                        frEquipment.set("equipmentCode", eqClass.get('code'));
                                    } else {
                                        frEquipment.set("equipmentCode", null);
                                    }
                                }

                                frEquipment.save().then(function () {
                                    controller.item_record.save().then(function(val){

                                        app_controller.autocompleteRoRo.forEach(function(item, index){
                                            var item_id = item.get('id');

                                            if( item_id === controller.itemId ) {
                                                app_controller.autocompleteRoRo.removeAt(index);
                                                app_controller.autocompleteRoRo.pushObject(val);
                                            }
                                        });

                                        if(controller.item_record.get("referringMemo") && fun_status === 'E') { //controllo se il booking item è stato creato a partire da un memo; nel tal caso faccio il reload del memo in modo da aggiornare il count dei metri lineari
                                            controller.item_record.get("referringMemo").reload().then(function(){
                                                // SUCCESS
                                                new PNotify({
                                                    title: 'Saved',
                                                    text: 'You successfully saved new booking item.',
                                                    type: 'success',
                                                    delay: 1000
                                                });

                                                controller.set('subTabLists.details', true);
                                                controller.set('subTabLists.haulage', false);
                                                controller.set('subTabLists.customs', false);
                                                controller.set('subTabLists.status', false);
                                                controller.set('subTabLists.revenues', false);
                                                controller.set('subTabLists.files', false);
                                                controller.set('subTabLists.goods', false);

                                            });
                                        } else {
                                            // SUCCESS
                                            new PNotify({
                                                title: 'Saved',
                                                text: 'You successfully saved new booking item.',
                                                type: 'success',
                                                delay: 1000
                                            });

                                            controller.set('subTabLists.details', true);
                                            controller.set('subTabLists.haulage', false);
                                            controller.set('subTabLists.customs', false);
                                            controller.set('subTabLists.status', false);
                                            controller.set('subTabLists.revenues', false);
                                            controller.set('subTabLists.files', false);
                                            controller.set('subTabLists.goods', false);

                                        }

                                    }, function(error){
                                        // NOT SAVED
                                        new PNotify({
                                            title: 'Not saved',
                                            text: 'A problem has occurred.',
                                            type: 'error',
                                            delay: 2000
                                        });
                                    });
                                });
                            });

                        } else {
                            $('div.alert.alert-danger').css('display', 'inline-block');
                        }
                        break;
                    case 'bb':
//                  *** GET equipment
                        if (fun_status === 'E' || fun_status === 'Req') {
                            if(controller.item_record.get('eLength') && controller.item_record.get('eWidth') && controller.item_record.get('eHeight')) {
                                controller.item_record.set('eVolume', controller.item_record.get('is_eVolume'));
                            }
                        } else if (fun_status === 'L') {
                            if(controller.item_record.get('length') && controller.item_record.get('width') && controller.item_record.get('height')) {
                                controller.item_record.set('volume', controller.item_record.get('is_volume'));
                            }
                        }
                        controller.item_record.get("freightEquipments").filter(function(frEquipment){
                            if(fun_status === 'E' && frEquipment.get('equipmentCode')) {

                                var eqClass = frEquipment.get('equipment');

                                frEquipment.set("equipmentCode", eqClass.get('code')).save().then(function(){
                                    controller.item_record.save().then(function(){
                                        // SUCCESS
                                        new PNotify({
                                            title: 'Saved',
                                            text: 'You successfully saved booking item.',
                                            type: 'success',
                                            delay: 1000
                                        });
                                        controller.set('subTabLists.details', true);
                                        controller.set('subTabLists.haulage', false);
                                        controller.set('subTabLists.customs', false);
                                        controller.set('subTabLists.status', false);
                                        controller.set('subTabLists.revenues', false);
                                        controller.set('subTabLists.files', false);
                                        controller.set('subTabLists.goods', false);
                                    }, function(){
                                        // NOT SAVED
                                        new PNotify({
                                            title: 'Not saved',
                                            text: 'A problem has occurred.',
                                            type: 'error',
                                            delay: 2000
                                        });
                                    });
                                }, function(){
                                    // NOT SAVED
                                    new PNotify({
                                        title: 'Not saved',
                                        text: 'A problem has occurred.',
                                        type: 'error',
                                        delay: 2000
                                    });
                                });

                            } else {
                                controller.item_record.save().then(function(){
                                    // SUCCESS
                                    new PNotify({
                                        title: 'Saved',
                                        text: 'You successfully saved booking item.',
                                        type: 'success',
                                        delay: 1000
                                    });
                                    controller.set('subTabLists.details', true);
                                    controller.set('subTabLists.haulage', false);
                                    controller.set('subTabLists.customs', false);
                                    controller.set('subTabLists.status', false);
                                    controller.set('subTabLists.revenues', false);
                                    controller.set('subTabLists.files', false);
                                    controller.set('subTabLists.goods', false);
                                }, function(){
                                    // NOT SAVED
                                    new PNotify({
                                        title: 'Not saved',
                                        text: 'A problem has occurred.',
                                        type: 'error',
                                        delay: 2000
                                    });
                                });
                            }

                        });

                        break;
                }

            } else if ( controller.subTabLists.haulage ){
                // SUCCESS
                new PNotify({
                    title: 'Saved',
                    text: 'You successfully saved booking item.',
                    type: 'success',
                    delay: 1000
                });
                if(fun_status === 'Req') {
                    controller.set('subTabLists.details', false);
                    controller.set('subTabLists.haulage', false);
                    controller.set('subTabLists.customs', false);
                    controller.set('subTabLists.status', false);
                    controller.set('subTabLists.revenues', false);
                    controller.set('subTabLists.files', false);
                    controller.set('subTabLists.goods', true);
                } else {
                    controller.set('subTabLists.details', false);
                    controller.set('subTabLists.haulage', false);
                    controller.set('subTabLists.customs', true);
                    controller.set('subTabLists.status', false);
                    controller.set('subTabLists.revenues', false);
                    controller.set('subTabLists.files', false);
                    controller.set('subTabLists.goods', false);
                }

            } else if ( controller.subTabLists.details ){

                if(fun_status === 'E' || fun_status === 'Req') {
                    var shipperDetList= null, consigneeDetList=null, notifyDetList=null;

                    //this.store.find("bookingItem", controller.itemId).then(function(bookItem){


                        //if($("a#autocomplete-itemShipperName button.btn.btn-primary").text() != ""){

                            if(controller.item_record.get('shipper')){
                                if(controller.item_record.get('shipper').get("name")){
                                    shipperDetList = controller.item_record.get('shipper').get("name");
                                }
                                if(controller.item_record.get('shipper').get("street")){
                                    shipperDetList = shipperDetList + ", " + controller.item_record.get('shipper').get("street");
                                }
                                if(controller.item_record.get('shipper').get("city")){
                                    shipperDetList = shipperDetList + ", " + controller.item_record.get('shipper').get("city");
                                }
                                if(controller.item_record.get('shipper').get("country")){
                                    shipperDetList = shipperDetList + ", " + controller.item_record.get('shipper').get("country");
                                }
                                if(controller.item_record.get('shipper').get("vat")){
                                    shipperDetList = shipperDetList + ", " + controller.item_record.get('shipper').get("vat");
                                }
                                controller.item_record.set('shipperDetail', shipperDetList);
                            } else {
                                controller.item_record.set("shipper", null).set('shipperDetail', null);
                                //controller.item_record.set('shipperDetail', '')
                            }
//                        } else {
//                            controller.item_record.set("shipper", null).set('shipperDetail', null);
//                        }

//                        if($("a#autocomplete-itemConsigneeName button.btn.btn-primary").text() != ""){
                            if(controller.item_record.get('consignee')){
                                if(controller.item_record.get('consignee').get("name")){
                                    consigneeDetList = controller.item_record.get('consignee').get("name");
                                }
                                if(controller.item_record.get('consignee').get("street")){
                                    consigneeDetList = consigneeDetList + ", " + controller.item_record.get('consignee').get("street");
                                }
                                if(controller.item_record.get('consignee').get("city")){
                                    consigneeDetList = consigneeDetList + ", " + controller.item_record.get('consignee').get("city");
                                }
                                if(controller.item_record.get('consignee').get("country")){
                                    consigneeDetList = consigneeDetList + ", " + controller.item_record.get('consignee').get("country");
                                }
                                if(controller.item_record.get('consignee').get("vat")){
                                    consigneeDetList = consigneeDetList + ", " + controller.item_record.get('consignee').get("vat");
                                }
                                controller.item_record.set('consigneeDetail', consigneeDetList);
                            } else {
                                controller.item_record.set("consignee", null).set('consigneeDetail', null);
                                //controller.item_record.set('consigneeDetail', '');
                            }
//                        } else {
//                            controller.item_record.set("consignee", null).set('consigneeDetail', null);
//                        }

//                        if($("a#autocomplete-itemNotifyName button.btn.btn-primary").text() != ""){
                            if(controller.item_record.get('notify')){
                                if(controller.item_record.get('notify').get("name")){
                                    notifyDetList = controller.item_record.get('notify').get("name");
                                }
                                if(controller.item_record.get('notify').get("street")){
                                    notifyDetList = notifyDetList + ", " + controller.item_record.get('notify').get("street");
                                }
                                if(controller.item_record.get('notify').get("city")){
                                    notifyDetList = notifyDetList + ", " + controller.item_record.get('notify').get("city");
                                }
                                if(controller.item_record.get('notify').get("country")){
                                    notifyDetList = notifyDetList + ", " + controller.item_record.get('notify').get("country");
                                }
                                if(controller.item_record.get('notify').get("vat")){
                                    notifyDetList = notifyDetList + ", " + controller.item_record.get('notify').get("vat");
                                }
                                controller.item_record.set('notifyDetail', notifyDetList);
                            } else {
                                controller.item_record.set("notify", null).set('notifyDetail', null);
                                //controller.item_record.set('notifyDetail', '');
                            }
//                        } else {
//                            controller.item_record.set("notify", null).set('notifyDetail', null);
//                        }


                        controller.item_record.save().then(function(){
                            // SUCCESS
                            new PNotify({
                                title: 'Saved',
                                text: 'You successfully saved booking item.',
                                type: 'success',
                                delay: 1000
                            });

                            if( controller.item_record.get('tu') === "roro" || app_controller.companyType === 'shipowner') {
                                if(fun_status == 'Req') {
                                    controller.set('subTabLists.details', false);
                                    controller.set('subTabLists.haulage', false);
                                    controller.set('subTabLists.customs', false);
                                    controller.set('subTabLists.status', false);
                                    controller.set('subTabLists.revenues', false);
                                    controller.set('subTabLists.files', false);
                                    controller.set('subTabLists.goods', true);
//                                    controller.set('activeSubTab', 'goods');
//                                    controller.setSubTabs('subTabLists.goods');
//
//                                    self.render("bookings.tabs.subTab.goods", {
//                                        into: 'bookings.tabs.' + tu,
//                                        outlet: 'subTab'
//                                    });
                                } else {
                                    controller.set('subTabLists.details', false);
                                    controller.set('subTabLists.haulage', false);
                                    controller.set('subTabLists.customs', true);
                                    controller.set('subTabLists.status', false);
                                    controller.set('subTabLists.revenues', false);
                                    controller.set('subTabLists.files', false);
                                    controller.set('subTabLists.goods', false);
//                                    controller.set('activeSubTab', 'customs');
//                                    controller.setSubTabs('subTabLists.customs');
//
//                                    self.render("bookings.tabs.subTab.customs", {
//                                        into: 'bookings.tabs.' + tu,
//                                        outlet: 'subTab'
//                                    });
                                }
                            } else {
                                controller.set('subTabLists.details', false);
                                controller.set('subTabLists.haulage', true);
                                controller.set('subTabLists.customs', false);
                                controller.set('subTabLists.status', false);
                                controller.set('subTabLists.revenues', false);
                                controller.set('subTabLists.files', false);
                                controller.set('subTabLists.goods', false);
//                                controller.set('activeSubTab', 'haulage');
//                                controller.setSubTabs('subTabLists.haulage');
//
//                                self.render("bookings.tabs.subTab.haulage", {
//                                    into: 'bookings.tabs.' + tu,
//                                    outlet: 'subTab'
//                                });
                            }

                        }, function(){
                            // NOT SAVED
                            new PNotify({
                                title: 'Not saved',
                                text: 'A problem has occurred.',
                                type: 'error',
                                delay: 2000
                            });
                        });
                    //});
                } else {
                    // SUCCESS
                    new PNotify({
                        title: 'Saved',
                        text: 'You successfully saved booking item.',
                        type: 'success',
                        delay: 1000
                    });

                    if(controller.item_record.get('tu') === "roro") {
                        controller.set('subTabLists.details', false);
                        controller.set('subTabLists.haulage', false);
                        controller.set('subTabLists.customs', true);
                        controller.set('subTabLists.status', false);
                        controller.set('subTabLists.revenues', false);
                        controller.set('subTabLists.files', false);
                        controller.set('subTabLists.goods', false);

//                        controller.set('activeSubTab', 'customs');
//                        controller.setSubTabs('subTabLists.customs');
//
//                        self.render("bookings.tabs.subTab.customs", {
//                            into: 'bookings.tabs.' + tu,
//                            outlet: 'subTab'
//                        });
                    } else {
                        controller.set('subTabLists.details', false);
                        controller.set('subTabLists.haulage', true);
                        controller.set('subTabLists.customs', false);
                        controller.set('subTabLists.status', false);
                        controller.set('subTabLists.revenues', false);
                        controller.set('subTabLists.files', false);
                        controller.set('subTabLists.goods', false);

//                        controller.set('activeSubTab', 'haulage');
//                        controller.setSubTabs('subTabLists.haulage');
//
//                        self.render("bookings.tabs.subTab.haulage", {
//                            into: 'bookings.tabs.' + tu,
//                            outlet: 'subTab'
//                        });
                    }
                }
            }
        },

        /*  ITEM STATUS TAB
         * ******************
         azione per fare l'upload degli status. Verfico che un item sia stato realmente modificato (isDirty === true)
         prima di farne il salvataggio.

         @action updateAll
         @for booking/partials/-tab-item-status.hbs
         */
        updateAll: function( booking_record ) {

            booking_record.get("items").filter(function(item, index){
                //item.get('freightEquipments').filter(function(freightEquipment, index){
                    if( item.get('isDirty') ){
                        item.save().then(function(){

                            if(index+1 == booking_record.get("items").get('length')){
                                new PNotify({
                                    title: 'Saved',
                                    text: 'You successfully saved item status.',
                                    type: 'success',
                                    delay: 1000,
                                    nonblock: {
                                        nonblock: true,
                                        nonblock_opacity: .2
                                    }
                                });
                            }
                        }, function(){
                            new PNotify({
                                title: 'Not saved',
                                text: 'A problem has occurred.',
                                type: 'error',
                                delay: 2000,
                                nonblock: {
                                    nonblock: true,
                                    nonblock_opacity: .8
                                }
                            });
                        })
                    }
                //});

            });
        }
    }

});
