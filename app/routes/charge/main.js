import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('charge.main');

        //imposto la tab details come default per 'company'
        if( controller.tabList.details !== true && controller.tabList.chargeItems_book !== true && controller.tabList.chargeItems_cont !== true && controller.tabList.chargeItems_roro !== true && controller.tabList.chargeItems_bb !== true ) {

            controller.set('tabList.details', true);
            controller.set('isView', true);
            controller.set('itemNewActive', false);
            controller.set('itemEditActive', false);
        }

        if( !app_controller.autocompleteSegment.get('length') ) {             //filter on search port of origin and port of destination in the template
            this.store.findQuery( "segment" ).then(function( model ){
                app_controller.set( "autocompleteSegment", model );
            });
        }
    },

    model: function( charge ) {
        return this.store.find('charge', charge.charge_id);
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
            this.controller.set('tabList.chargeItems_book', false);
            this.controller.set('tabList.chargeItems_cont', false);
            this.controller.set('tabList.chargeItems_roro', false);
            this.controller.set('tabList.chargeItems_bb', false);

            this.controller.set('isView', true);
            this.controller.set('itemNewActive', false);
            this.controller.set('itemEditActive', false);

            this.controller.set('tabList.' + tabToActive, true);

        },

        /**
         Permette di cambiare il parziale visto dall'utente all'interno di un determinato template;
         nel caso in cui variable === 'itemNewActive' && bool === true viene fatta una POST per la creazione di un
         nuovo charge item.

         @action change_partial
         @for charge/main.js
              partials/-book-charge-items.hbs
              partials/-cont-charge-items.hbs
              partials/-bb-charge-items.hbs
              partials/-roro-charge-items.hbs
         @param {string} nome della variabile a cui riassegnare il valore
         @param {bool} valore da riassegnare
         */
        change_partial: function( variable, bool, record, type ){
            var self = this, controller = self.controllerFor('charge.main');
            controller.set( 'item_record', null );

            if( variable === 'itemNewActive' && bool === true ){

                var chItem = self.get('store').createRecord('chargeItem', {
                    originalCostCurrency: record.get("currency"),
                    originalRevenueCurrency: record.get("currency"),
                    chargeType: 'revenue',
                    entityType: 'charge',
                    type: type
                });

                chItem.set("charge", record).save().then(function(itemProm){
                    controller.set( 'item_record', itemProm );
                    record.reload().then(function(){
                        controller.set( variable, bool );
                    });
                });

            } else if ( variable === 'itemEditActive' && bool === true ) {
                controller.set( 'item_record', record );
                controller.set(variable, bool);
            }

            controller.set(variable, bool);
        },

        /**
         Gestione della cambio di stato da edit a view. nel caso 'edit --> view' viene fatta una POST del record

         @action change_state
         @for charge/main.js
         @param {boolean} true si passa a 'stato === view'; false si passa a 'stato === edit'
         @param {record} entità di riferimento
         */
        change_state: function( bool, record ) {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('charge.main');

            if( bool === true ) {
                controller.set("charge_record", record);

                record.save().then(function(val) {

                    app_controller.autocompleteCharge.forEach(function(item, index){
                        if( item.get('id') === record.get('id') ) {
                            app_controller.autocompleteCharge.removeAt(index);
                            app_controller.autocompleteCharge.pushObject(val);
                        }
                    });

                    self.controller.set('isView', bool);

                    //SUCCESS
                    new PNotify({
                        title: 'Saved',
                        text: 'You successfully saved charge.',
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
                this.controller.set('isView', bool);
            }
        },

        /**
         salvataggio dei chargeItems sia nuovi che in stato edit

         @action save_record
         @for charge/main.js

         @param {record} entità di riferimento
         @param {string} nome della variabile da aggiornare con bool
         @param {boolean} true si passa a 'stato === view'; false si passa a 'stato === edit'
         */
        save_record: function( record, variable, bool ) {
            var self = this, controller = self.controllerFor('charge.main');

            controller.get('ChargesAll').filterBy('value', record.get("name")).every(function(item) {
                record.set('code', item.code);
                record.save().then(function(){
                    controller.set( 'item_record', null );
                    controller.set(variable, bool);

                });
            });
        },

        //********************************************
        //MODAL
        open_modal: function( path, item ) {
            var self = this, controller = self.controllerFor('charge.main');

            controller.set("item_record", item);
            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        remove_item: function(){
            var self = this, controller = self.controllerFor('charge.main');

            controller.item_record.deleteRecord();
            controller.item_record.save();
        },

        close_item: function(){
            var self = this, app_controller = self.controllerFor('application');

            app_controller.send('close_modal', 'overview', 'application');
            this.send('closeSearch');
        }

    }

});
