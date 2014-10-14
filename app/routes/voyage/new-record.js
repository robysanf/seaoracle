import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var self = this, app_controller= self.controllerFor('application');

        //reset del campo di ricerca in caso di reload della pagina
        if( !app_controller.autocompleteVessel.get('length') ) {
            self.store.findQuery("vessel").then(function(vessel){
                app_controller.set("autocompleteVessel", vessel);
            });
        }

        if( !app_controller.autocompleteVoyage.get('length') ) {
            self.store.findQuery("voyage").then(function(voi){
                app_controller.set("autocompleteVoyage", voi);
            });
        }

        if( !app_controller.autocompletePoiPort.get('length') ) {
            self.store.findQuery( "poi", {tags: "Port"} ).then(function(val){
                app_controller.set("autocompletePoiPort", val);
            });
        }

        if( !app_controller.autocompleteTemplate.get('length') ) {
            self.store.findQuery( "template" ).then(function(val){
                app_controller.set("autocompleteTemplate", val);
            });
        }
    },

    actions: {
        /**
         Funzione per controllare che nno esista giù un viaggio codificato con quel Vascello e quel numero.

         @action checkUniqueNumber
         @for Voyage new
         @param {string}
         @param {string}
         @param {string}
         @param {string}
         @param {string}
         @return genera un errore e cancella il numero inserito nel field in caso di viaggio già esistente
         */
        check_uniqueVoyageNumber: function( model, filter_vessel, filter_number, vessel, number ){
            var self = this, controller = self.controllerFor('voyage.new-record'),
                queryExpression = {}, searchPath = '';

            searchPath = filter_vessel; queryExpression[searchPath] = vessel;
            searchPath = filter_number; queryExpression[searchPath] = number;

            this.store.findQuery(model, queryExpression).then(function(val){
                if(val.get('length') >= 1){
                    controller.set('newNumber', null);
                    //Attention
                    new PNotify({
                        title: 'Attention',
                        text: 'Already exists a voyage with this vessel and this number.',
                        delay: 2000
                    });
                }
            });
        },

        /**
         Ad ogni sort fatto dall'utente in stato edit registro il cambiamento di ordinamento nella variabile temporanea
         devo utilizzare delle variabili temporanee per ordinare le righe di 'temporary_path' secondo l'ordine dei sort

         @action update_temporaryRecordsList
         @for template/main.hbs (--> partials/-details.hbs)
         @param {array} lista di id ordinati
         */
        update_temporaryRecordsList: function(){        //ad ogni sort registro il cambiamento di ordinamento
            var self = this, controller = self.controllerFor('voyage.new-record');
            controller.temp_listOfElements = [];

            $.each(controller.temporary_index_list, function(index, val) {

                var temp_list = controller.listOfElements.filterBy('sortIndex', val);
                controller.temp_listOfElements.push(temp_list[0]);

                if( controller.temporary_index_list.length === index + 1 ){
                    controller.listOfElements = controller.temp_listOfElements;
                }
            });
        },

        add_item: function(){
            var self = this, controller = self.controllerFor('voyage.new-record');

            if(controller.searchPort !== null && controller.searchPort !== ''){
                controller.listOfElements.pushObject({
                    sortIndex: controller.listOfElements.length,
                    poi: controller.searchPort
                });
                this.send('updateTemporaryPath');

                controller.set('searchPort', null);
            }

            if(controller.searchTemplate !== null && controller.searchTemplate !== ''){

                controller.searchTemplate.get('paths').then(function(path){
                    path.forEach(function(val){
                        controller.listOfElements.pushObject({
                            sortIndex: controller.listOfElements.length,
                            poi: val
                        });
                    });
                    self.send('updateTemporaryPath');
                    controller.set('searchTemplate', null);
                });
            }
        },

        remove_item: function( indexToRemove ){ //rimozione di un toggle a layout
            var self = this, controller = self.controllerFor('voyage.new-record');

            $.each(controller.listOfElements, function(index, val){

                if(val.sortIndex === indexToRemove){
                    controller.temporary_index_list.splice(index, 1);
                    controller.listOfElements.splice(index, 1);
                    self.send('updateTemporaryPath');
                    return false;
                }
            });
        },

        /**
         l'array viene ordinato e i sortIndex vengono rimessi in ordine crescente

         @action updateTemporaryPath
         @for Voyage edit path
         */
        updateTemporaryPath: function(){
            var self = this, controller = self.controllerFor('voyage.new-record'),
                temp_list = [];

            if( controller.listOfElements.get('length') !== 0 ){
                $.each(controller.listOfElements, function(index, val){
                    val.sortIndex = index;

                    temp_list.pushObject({
                        poi: val.poi
                    });

                    if(controller.listOfElements.length === index + 1){
                        controller.set('temporaryPath', temp_list);
                    }
                });
            } else {
                controller.set('temporaryPath', []);
            }

        },

        create_record: function( ){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('voyage.new-record'),
                queryExpression = {}, searchPath = '',
                listOfLegs = [], count = controller.listOfElements.length, countLeg = 0;

            searchPath = 'vessel'; queryExpression[searchPath] = controller.searchVessel.get('id');
            searchPath = 'number'; queryExpression[searchPath] = controller.newNumber;

            this.store.findQuery('voyage', queryExpression).then(function(val){
                if(val.get('length') >= 1){
                    controller.set('newNumber', null);
                    //Attention
                    new PNotify({
                        title: 'Attention',
                        text: 'Already exists a voyage with this vessel and this number.',
                        delay: 2000
                    });
                } else {
                    if( controller.searchVessel !== null && controller.searchVessel !== undefined ) {
                        $('div.alert.alert-danger').css('display', 'none');

                        //create new Template
                        var newVoyage = self.store.createRecord('voyage', {
                            number: controller.newNumber,
                            vesselName: controller.searchVessel.get('name'),
                            vessel: controller.searchVessel,
                            status: "complete",   //dovrebbe essere incomplete, lo metto a complete per evitare possibili errori
                            visibility: 'public'
                        });

                        if ( controller.searchVoyage !== null && controller.searchVoyage !== '' ) {
                            newVoyage.set('parentVoyage', controller.searchVoyage );
                        }

                        //define company and pois list
                        self.store.find('company', app_controller.company).then(function(company){
                            newVoyage.save().then(function(voi){

                                voi.get('schedules').then(function(schedules) {
                                    $.each(controller.listOfElements, function(index, val) {

                                        //self.store.find('poi', val.get('id')).then(function(poi){
                                        var newLeg = self.store.createRecord('leg', {
                                            poi: val.poi,
                                            bookingStatus: "open",
                                            voyage: voi.get("id"),
                                            visibility: 'public'
                                        });
                                        newLeg.save().then(function(myLeg){

                                            $.each(controller.listOfElements, function(index, val) {
                                                if( (myLeg.get("poi").get("id") === val.poi.get('id')) && (listOfLegs[index] === null)){
                                                    listOfLegs[index] = myLeg;
                                                    return false;
                                                }
                                            });

                                            countLeg = countLeg + 1;
                                            if (countLeg === count) {
                                                schedules.pushObjects(listOfLegs);
                                                voi.set('company', company).save().then(function(new_voyage){

                                                    //SUCCESS
                                                    new PNotify({
                                                        title: 'Saved',
                                                        text: 'You successfully saved voyage path.',
                                                        type: 'success',
                                                        delay: 1000
                                                    });

                                                    controller.set( 'newNumber', null );
                                                    controller.set( 'listOfElements', [] );
                                                    controller.set( 'temporaryPath', [] );
                                                    controller.set( 'searchVessel', null );
                                                    controller.set( 'searchVoyage', null );

                                                    app_controller.autocompleteVoyage.pushObject(new_voyage);
                                                    self.transitionTo('voyage/main', new_voyage);

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

                                    });
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

                        });
                    }
                    else {
                        //WARNING
                        new PNotify({
                            title: 'Attention',
                            text: 'Please check if vessel name has been entered.',
                            delay: 2000
                        });
                    }
                }
            });
        }
    }
});
