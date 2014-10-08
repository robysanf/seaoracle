import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var self = this,  controller = self.controllerFor('port.main');

        //imposto la tab details come default per 'company'
        if( controller.tabList.details !== true &&  controller.tabList.depots !== true ) {
            controller.set('tabList.details', true);
        }
    },

    model: function( poi ) {
        return this.store.find('poi', poi.poi_id);
    },

    actions: {
        /**
         Gestione della tab navigation in 'your-profile'; rende attiva la tab selezionata dall'utente

         @action setTabs
         @for your-profile/main-page
         @param {string} tab selezionata dall'utente - (company/driver/truck/trailer/clerk)
         */
        setTabs: function( tabToActive ){
            this.controller.set('tabList.details',false);
            this.controller.set('tabList.depots',false);

            this.controller.set('tabList.' + tabToActive, true);
        },

        /**
         Gestione della cambio di stato da edit a view. nel caso 'edit --> view' viene fatta una POST del record

         @action change_state
         @for port/partials/-details.hbs
         @param {boolean} true si passa a 'stato === view'; false si passa a 'stato === edit'
         @param {record} entità poi di riferimento
         */
        change_state: function( bool, record ) {
            var self = this,  controller = self.controllerFor('port.main'), app_controller = self.controllerFor('application'),
                str_unLocode = null, unique = false, iso3 = null;

            if( bool === true ) {

                if( record.get('unLocode') ){
                    str_unLocode = record.get('unLocode').replace(/[^A-Z]/gi, "").toUpperCase();
                }

                ( ( str_unLocode !== null ) ? ( unique = str_unLocode !== "" && str_unLocode.length === 5 ) : self.set('unique', false) );

                (unique ? $('span#2.input-group-addon').removeClass('alert-danger') : $('span#2.input-group-addon').addClass('alert-danger'));

                if (unique) {
                    var this_nation = app_controller.nations.filterBy('country', record.get('country'));
                    if( this_nation[0] ){
                        iso3 = this_nation[0].iso3;
                    }
                    record.set('countryIso3', iso3);

                    record.set('unLocode', str_unLocode);
                    record.save().then(function(success){

                        controller.set('isView', bool);

                        //SAVED
                        new PNotify({
                            title: 'Saved',
                            text: 'You successfully saved new company.',
                            type: 'success',
                            delay: 1000
                        });

                        app_controller.autocompletePoiPort.forEach(function(item, index){
                            if( item.get('id') === record.get('id') ) {
                                app_controller.autocompletePoiPort.removeAt(index);
                                app_controller.autocompletePoiPort.pushObject(success);
                            }
                        });

                        app_controller.autocompletePoi.forEach(function(item, index){
                            if( item.get('id') === record.get('id') ) {
                                app_controller.autocompletePoi.removeAt(index);
                                app_controller.autocompletePoi.pushObject(success);
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
                        text: 'please check if required fields have been entered.',
                        type: 'error',
                        delay: 2000
                    });
                }
            } else {
                controller.set('isView', bool);
            }
        },

        //********************************************
        //MODAL
        open_modal: function( path, item ) {
            var self = this, controller = self.controllerFor('port.main');

            controller.set("poiRecord", item);
            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        remove_item: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('port.main');

            controller.poiRecord.deleteRecord();
            controller.poiRecord.save().then(function(){

                app_controller.autocompletePoiDepot.forEach(function(item, index){
                    if( item ) {
                        if( item.get('id') === controller.poiRecord.get('id') ) {
                            app_controller.autocompletePoiDepot.removeAt(index);
                        }
                    }
                });

                app_controller.autocompletePoi.forEach(function(item, index){
                    if( item ) {
                        if( item.get('id') === controller.poiRecord.get('id') ) {
                            app_controller.autocompletePoi.removeAt(index);
                        }
                    }
                });
            });
        },

        close_item: function(){
            var self = this, app_controller = self.controllerFor('application');

            app_controller.send('close_modal', 'overview', 'application');
            this.send('closeSearch');
        },

        goTo: function( val ) {
            var controller = this.controllerFor('port.main');

            controller.set('itemListActive', val);
            controller.set('itemEditActive', val);
        },

        create_record: function( poiRecord ){
            var self = this, controller = self.controllerFor('port.main'), app_controller = self.controllerFor('application'),
                tags = [], country = null, iso3 = null; tags.push("Depot");

            if( controller.newCountry ){
                country = controller.newCountry.country;
                iso3 = controller.newCountry.iso3;
            }

            (controller.newName !== null && controller.newName.length > 1 ? $('span#1.input-group-addon').removeClass('alert-danger') : $('span#1.input-group-addon').addClass('alert-danger'));

            if( controller.newName !== null && controller.newName.length > 1 ){
                var newDepot = this.store.createRecord('poi', {
                    name: controller.newName,
                    street: controller.newStreet,
                    province: controller.newProvince,
                    city: controller.newCity,
                    zipCode: controller.newZipCode,
                    country: country,
                    countryIso3: iso3,
                    phone: controller.newPhone,
                    notifyParty: controller.newNotifyParty,
                    tags: tags,
                    visibility: 'public'//data.newVisibility
                });

                newDepot.set('referringPoi', poiRecord).save().then(function(myDepot) {

                    //SAVED
                    new PNotify({
                        title: 'Saved',
                        text: 'You successfully saved new point of interest.',
                        type: 'success',
                        delay: 1000
                    });

                    app_controller.autocompletePoiDepot.pushObject(myDepot);
                    app_controller.autocompletePoi.pushObject(myDepot);

                    poiRecord.reload().then(function(){
                        //controller.set('id_newDepot', newDepot);
                        self.set('itemListActive',false);
                        self.set('itemEditActive',false);

                        controller.set('newName', null);
                        controller.set('newStreet', null);
                        controller.set('newProvince', null);
                        controller.set('newCity', null);
                        controller.set('newZipCode', null);
                        controller.set('newCountry', null);
                        controller.set('newPhone', null);
                        controller.set('newNotifyParty', null);
                    });
                }, function() {
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
                    text: 'Please check if required fields have been entered..',
                    delay: 2000
                });
            }



        },

        edit_record: function( record, bool ){
            var self = this, controller = self.controllerFor('port.main');

            controller.set("depotRecord", record);
            controller.set('itemEditActive', bool);
        },

        update_record: function( bool ) {
            var self = this, controller = self.controllerFor('port.main'), app_controller = self.controllerFor('application'),
                iso3 = null;

            (controller.depotRecord.name ? $('span#1.input-group-addon').removeClass('alert-danger') : $('span#1.input-group-addon').addClass('alert-danger'));

            if(controller.depotRecord.name){
                var this_nation = app_controller.nations.filterBy('country', controller.depotRecord.get('country'));
                if( this_nation[0] ){
                    iso3 = this_nation[0].iso3;
                }
                controller.depotRecord.set('countryIso3', iso3);
                controller.depotRecord.save().then(function(mydep) {
                    controller.set('itemEditActive', bool);

                    //SAVED
                    new PNotify({
                        title: 'Saved',
                        text: 'You successfully update point of interest.',
                        type: 'success',
                        delay: 1000
                    });

                    app_controller.autocompletePoi.forEach(function(item, index){
                        if( item.get('id') === controller.depotRecord.get('id') ) {
                            app_controller.autocompletePoi.removeAt(index);
                            app_controller.autocompletePoi.pushObject(mydep);
                        }
                    });
                    app_controller.autocompletePoiDepot.forEach(function(item, index){
                        if( item.get('id') === controller.depotRecord.get('id') ) {
                            app_controller.autocompletePoiDepot.removeAt(index);
                            app_controller.autocompletePoiDepot.pushObject(mydep);
                        }
                    });

                }, function() {
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
                    text: 'Please check if required fields have been entered..',
                    delay: 2000
                });
            }


        }

    }

});
