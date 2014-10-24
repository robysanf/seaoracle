import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('voyage.main');

        if( !app_controller.autocompletePoiPort.get('length') ) {
            this.store.findQuery( "poi", {tags: "Port"} ).then(function(val){
                app_controller.set("autocompletePoiPort", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        if( !app_controller.autocompleteTemplate.get('length') ) {
            this.store.findQuery( "template" ).then(function(val){
                app_controller.set("autocompleteTemplate", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        if( !app_controller.autocompleteCompany.get('length') ) {
            self.store.findQuery("company").then(function(val){
                app_controller.set("autocompleteCompany", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        //imposto la tab details come default per 'company'
        if( controller.tabList.details !== true && controller.tabList.path !== true ) {
            controller.set('tabList.path', true);

            controller.set('isView', true);
            controller.set('details_isView', true);
        }
    },

    model: function( voyage ) {
      return this.store.find('voyage', voyage.voyage_id);
    },


    actions: {
        /**
         Gestione della tab navigation in 'your-profile'; rende attiva la tab selezionata dall'utente

         @action setTabs
         @for your-profile/main-page
         @param {string} tab selezionata dall'utente - (company/driver/truck/trailer/clerk)
         */
        setTabs: function (tabToActive) {
            this.controller.set('tabList.details', false);
            this.controller.set('tabList.path', false);

            this.controller.set('isView', true);
            this.controller.set('details_isView', true);
            this.controller.set('tabList.' + tabToActive, true);
        },

        /**
         bool === true
            salvataggio modifiche al voyage; se sono stati aggiunti nuovi poi vengono create le leg corrispondenti

         bool === false
             azione per registrare (al momento del caricamento in stato edit) la posizione degli elementi
             nella lista temporanea

         */
        change_state: function( bool, record, schedules, vessel, type ){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('voyage.main'),
            temp_list = [];

            switch( type ){
                case 'path':
                    if( bool ){
                        var count = controller.listOfElements.length, listOfLegs = [], countLeg = 0, data = controller.getProperties('name'), unique= null;

                        unique = data.name !== "" && data.name.length > 1;

                        (unique ? $('span#1.input-group-addon').removeClass('alert-danger') : $('span#1.input-group-addon').addClass('alert-danger'));

                        //check the enter name
                        if (unique) {
                            $('div.alert.alert-danger').css('display', 'none');

                            //set name, vessel and status
                            record.set('vesselName', vessel.get('name')).set('status', "complete");     //dovrebbe essere incomplete, lo metto a complete per evitare possibili errori

                            self.store.find('company', app_controller.company).then(function(company){

                                //remove all the legs in the schedules attr.
                                schedules.filter(function(legs){
                                    self.store.find('leg', legs.id).then(function(leg){
                                        schedules.removeObject(leg);

                                        //when schedules is empty go on
                                        if( schedules.get('length') === 0 )
                                        {
                                            //create the new legs selected by the user
                                            $.each(controller.listOfElements, function(index, value) {

                                                //se l'elemento in esame è un poi senza leg (quindi nuovo, appena inserito dall'utente)
                                                if(value.leg !== null){
                                                    listOfLegs[index] = value.leg;
//
                                                    countLeg = countLeg +1;
                                                    if(count === countLeg){
                                                        schedules.pushObjects(listOfLegs);
                                                        record.set('company', company);
                                                        record.save().then(function(){

                                                            //SUCCESS
                                                            new PNotify({
                                                                title: 'Success',
                                                                text: 'The record was succesfully saved.',
                                                                type: 'success',
                                                                delay: 2000
                                                            });
                                                            listOfLegs = [];
                                                            countLeg = 0;
                                                            controller.set( 'isView', bool );
                                                            controller.set('listOfElements', []);
                                                            controller.set('temporaryPath', []);
                                                        });
                                                    }

                                                    //altrimenti è un vecchio elemento che possiede già una leg, non devo creargliene una nuova
                                                } else if (value.leg === null){
                                                    var newLeg = self.store.createRecord('leg', {
                                                        poi: value.poi,
                                                        voyage: record.get("id"),
                                                        bookingStatus: "open",
                                                        visibility: 'public'
                                                    });

                                                    newLeg.save().then(function(myLeg){
                                                        listOfLegs[index] = myLeg;
                                                        countLeg = countLeg +1;

                                                        if(count === countLeg){
                                                            schedules.pushObjects(listOfLegs);
                                                            record.set('company', company);
                                                            record.save().then(function(){
                                                                //SUCCESS
                                                                new PNotify({
                                                                    title: 'Success',
                                                                    text: 'The record was succesfully saved.',
                                                                    type: 'success',
                                                                    delay: 2000
                                                                });
                                                                listOfLegs = [];
                                                                countLeg = 0;
                                                                controller.set( 'isView', bool );
                                                                controller.set('listOfElements', []);
                                                                controller.set('temporaryPath', []);

                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                });
                            });

                        }
                        else {
                            //WARNING
                            new PNotify({
                                title: 'Attention',
                                text: 'please check if vessel name has been entered.',
                                type: 'error',
                                delay: 2000
                            });
                        }

                    } else {
                        schedules.forEach(function(val, index){

                            controller.listOfElements.pushObject({      //array bindato a quello mostrato a layout (ce nè veramente bisogno??)
                                sortIndex: index,
                                poi: val.get('poi'),
                                leg: val
                            });

                            temp_list.pushObject({
                                poi: val.get('poi'),
                                leg: val
                            });

                            if( controller.listOfElements.length === index + 1 ){
                                controller.set( 'temporaryPath', temp_list );
                            }

                        });

                        controller.set( 'isView', bool );
                    }

                    break;
                case 'details':

                    if( bool ){
                        var count = 1;

                        record.set('status', 'complete').save();
                        schedules.filter(function(leg){
                            var date_eta = leg.get("eta"), date_etd = leg.get("etd"),
                                date_ata = leg.get("ata"), date_atd = leg.get("atd");


                            //se le date di arrivo o partenza sono vuote vengono compilate con il valore inserito per l altro campo
                            if( ( date_eta === null || date_eta === undefined ) && date_etd !== null ) {
                                leg.set( 'eta', date_etd );
                            } else if ( date_eta !== null && ( date_etd === null || date_etd === undefined ) ) {
                                leg.set( 'etd', date_eta );
                            }

                            if( ( date_ata === null || date_ata === undefined ) && date_atd !== null) {
                                leg.set('ata', date_atd );
                            } else if ( date_ata !== null && ( date_atd === null || date_atd === undefined ) ) {
                                leg.set('atd', date_ata );
                            }

                            if( leg.get('isDirty') ){
                                leg.save().then(function(){
                                    if(schedules.get("length") === count){
                                        //SUCCESS
                                        new PNotify({
                                            title: 'Saved',
                                            text: 'You successfully saved voyage path.',
                                            type: 'success',
                                            delay: 1000
                                        });
                                        controller.set( 'details_isView', bool );
                                    }
                                    count = count +1;
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
                                if(schedules.get("length") === count){
                                    //SUCCESS
                                    new PNotify({
                                        title: 'Saved',
                                        text: 'You successfully saved voyage path.',
                                        type: 'success',
                                        delay: 1000
                                    });
                                    controller.set( 'details_isView', bool );
                                }
                                count = count +1;
                            }


                        });



                    } else {
                        controller.set( 'details_isView', bool );
                    }

                    break;
            }


        },

        /**
         Ad ogni sort fatto dall'utente in stato edit registro il cambiamento di ordinamento nella variabile temporanea
         devo utilizzare delle variabili temporanee per ordinare le righe di 'temporary_path' secondo l'ordine dei sort

         @action update_temporaryRecordsList
         @for template/main.hbs (--> partials/-details.hbs)
         @param {array} lista di id ordinati
         */
        update_temporaryRecordsList: function(){        //ad ogni sort registro il cambiamento di ordinamento
            var self = this, controller = self.controllerFor('voyage.main');
            controller.temp_listOfElements = [];

            $.each(controller.temporary_index_list, function(index, val) {

                var temp_list = controller.listOfElements.filterBy('sortIndex', val);
                controller.temp_listOfElements.push(temp_list[0]);

                if( controller.temporary_index_list.length === index + 1 ){
                    controller.listOfElements = controller.temp_listOfElements;
                }
            });
        },

        remove_item: function( indexToRemove ){ //rimozione di un toggle a layout
            var self = this, controller = self.controllerFor('voyage.main'),
                arrayOrigin = [], arrayDestination = [];

            $.each(controller.listOfElements, function(index, val){
                if(val.sortIndex === indexToRemove){

                    if( val.leg !== null ){
                        arrayOrigin = val.leg.get('originFreightPlans');
                        arrayDestination = val.leg.get('destinationFreightPlans');

                        if( arrayOrigin === null || arrayOrigin === undefined ){
                            arrayOrigin = [];
                        }
                        if( arrayDestination === null || arrayDestination === undefined ){
                            arrayDestination = [];
                        }

                        if(arrayOrigin.length !== 0 || arrayDestination.length !== 0) {
                            new PNotify({
                                title: 'Attention',
                                text: 'It is not possible to remove this item.',
                                type: 'info'
                            });
                        } else {
                            val.leg.deleteRecord();
                            val.leg.save();
                            controller.temporary_index_list.splice(index, 1);
                            controller.listOfElements.splice(index, 1);
                            self.send('updateTemporaryPath');
                            return false;
                        }

                    } else {
                        controller.temporary_index_list.splice(index, 1);
                        controller.listOfElements.splice(index, 1);
                        self.send('updateTemporaryPath');
                        return false;
                    }
                }
            });
        },

        add_item: function(){
            var self = this, controller = self.controllerFor('voyage.main');

            if(controller.searchPort !== null && controller.searchPort !== ''){
                controller.listOfElements.pushObject({
                    sortIndex: controller.listOfElements.length,
                    poi: controller.searchPort,
                    leg: null
                });
                this.send('updateTemporaryPath');

                controller.set('searchPort', null);
            }

            if(controller.searchTemplate !== null && controller.searchTemplate !== ''){

                controller.searchTemplate.get('paths').then(function(path){
                    path.forEach(function(val){
                        controller.listOfElements.pushObject({
                            sortIndex: controller.listOfElements.length,
                            poi: val,
                            leg: null
                        });
                    });
                    self.send('updateTemporaryPath');
                    controller.set('searchTemplate', null);
                });
            }
        },

        /**
         l'array viene ordinato e i sortIndex vengono rimessi in ordine crescente

         @action updateTemporaryPath
         @for Voyage edit path
         */
        updateTemporaryPath: function(){
            var self = this, controller = self.controllerFor('voyage.main'),
                temp_list = [];

            if( controller.listOfElements.get('length') !== 0 ){
                $.each(controller.listOfElements, function(index, val){
                    val.sortIndex = index;


                    temp_list.pushObject({
                        poi: val.poi,
                        leg: val.leg
                    });

                    if(controller.listOfElements.length === index + 1){
                        controller.set('temporaryPath', temp_list);
                    }
                });
            } else {
                controller.set('temporaryPath', []);
            }


        },

        /**************************************************************************************************************
         * TAB DETAILS
         * */

        /**
         CAMBIO DI STATUS PER IL BOOKING : azione per modificare lo status dela leg da opened a closed

         @action change_bookingStatus
         @for voyage > partials > -tab-details.hbs
         @param {string} opened/closed
         @param {record}
         */
        change_bookingStatus: function( type, record ){

            record.set("bookingStatus", type).save();
        }
    }

});
