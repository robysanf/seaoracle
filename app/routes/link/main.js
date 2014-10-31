import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('link.main');

        if( !app_controller.autocompleteCompany.get('length') ) {
            self.store.findQuery("company").then(function(comp){
                app_controller.set("autocompleteCompany", comp);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        //imposto la tab details come default per 'company'
        if( controller.tabList.links !== true &&  controller.tabList.groups !== true ) {
            controller.set('tabList.links', true);
        }
    },

    model: function( company ) {
        return this.store.find('company', company.company_id);
    },

    actions: {
        /**
         Gestione della tab navigation in 'your-profile'; rende attiva la tab selezionata dall'utente

         @action setTabs
         @for your-profile/main-page
         @param {string} tab selezionata dall'utente - (company/driver/truck/trailer/clerk)
         */
        setTabs: function( tabToActive ){
            this.controller.set('tabList.links',false);
            this.controller.set('tabList.groups',false);

            this.controller.set('tabList.' + tabToActive, true);
        },

        /**
         Creazione di un nuovo gruppo

         @action create_group
         @for link/partials/-connected-companies.hbs
         @param {record} company che vuole creare il gruppo
         @param {string} nome del gruppo da creare
         @param {string} attr type : agent/other
         */
        create_group: function( record, name, type ){
            var self = this, controller = self.controllerFor('link.main'), app_controller = self.controllerFor('application');

            this.store.createRecord('group', {
                company: record,
                name: name,
                type: type
            }).save().then(function(){
                record.reload();
                new PNotify({
                    title: 'Success',
                    text: 'The request was sent.',
                    type: 'success',
                    delay: 2000
                });

            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        },

        //********************************************
        //MODAL
        open_modal: function( path, item ) {
            var self = this, controller = self.controllerFor('link.main');

            if( item ){
                controller.set("company_record", item);
                this.render(path, {
                    into: 'application',
                    outlet: 'overview',
                    view: 'modal-manager'
                });
            }

        },

        close_item: function(){
            var self = this, app_controller = self.controllerFor('application');

            app_controller.send('close_modal', 'overview', 'application');
        },

        getId: function( path, value ){
            var self = this, controller = self.controllerFor('link.main');

            controller.set('companyRecord', value);
            controller.set('company_id', value.get('id'));
            controller.set('tabListDetails', false);
            controller.set('tabListUsers', false);
            controller.set('tabListFiles', false);

            this.transitionTo(path, value.id);
        },
        remove_connection: function() {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('link.main'),
                data = this.getProperties();

            data.company = controller.company_record.get('id');

            $.post('api/custom/unbindLinkedCompanies?token=' + app_controller.token, data).then(function(response){
                if (response.success) {
                    //NOT SAVED
                    new PNotify({
                        title: 'Success',
                        text: 'The request was sent.',
                        type: 'success',
                        delay: 2000
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
        },

        custom_linkCompanies: function( record_id ){
            var self = this, app_controller = self.controllerFor('application'),
            data = this.getProperties();

            data.company = record_id;

            $.post('api/custom/linkCompanies?token=' + app_controller.token, data).then(function(response){
                if (response.success) {
                    //NOT SAVED
                    new PNotify({
                        title: 'Success',
                        text: 'The request was sent.',
                        type: 'success',
                        delay: 2000
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
        }
    }
});
