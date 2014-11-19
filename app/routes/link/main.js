import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('link.main');

        //filter on search port of origin and port of destination in the template
        if( !app_controller.autocompleteLink.get('length')  ) {
            self.store.find( "company", app_controller.company ).then(function(company){
                company.get('links').then(function(links){
                    app_controller.set("autocompleteLink", links);
                });
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        if( !app_controller.autocompleteCompany.get('length') ) {
            self.store.findQuery("company").then(function(comp){
                app_controller.set("autocompleteCompany", comp);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        if( !app_controller.autocompletePoiPort.get('length') ) {
            self.store.findQuery("poi", {tags: "Port"}).then(function(val){
                app_controller.set("autocompletePoiPort", val);
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
         @param {array} attr type : agent/other
         */
        create_group: function( record, name, type, list ){
            var self = this, controller = self.controllerFor('link.main'), app_controller = self.controllerFor('application');

            var group = this.store.createRecord('group', {
                company: record,
                name: name,
                type: type
            });

            group.get('linkedCompanies').then(function( linkedCompanies ){
                list.forEach(function( val, index ){
                    linkedCompanies.pushObject(val);

                    if( index +1 === list.get('length') ){
                        group.save().then(function(){
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
                    }
                });
            });
        },

        create_feature: function( value, referring_id ){
            var self = this, controller = self.controllerFor('link.main'), app_controller = self.controllerFor('application');

            var feature = self.store.createRecord('feature', {
                company: controller.company_record,
                linkedCompany: controller.linked_company_record,
                type: 'agent',
                value: value,
                visibility: 'private'
            });

            if( referring_id !== null ){
                feature.set('linkedEntity', referring_id).set('linkedEntityType', 'poi');
            }

            feature.save().then(function(){
                controller.set('referringPort', null);
                controller.linked_company_record.reload();
                new PNotify({
                    title: 'Success',
                    text: 'The feature was create.',
                    type: 'success',
                    delay: 2000
                });

            }, function( reason ){
                app_controller.send( 'error', reason );
            });

        },

        delete_record: function( entity_to_remove ) {
            entity_to_remove.deleteRecord();
            entity_to_remove.save();
        },

        //********************************************
        //MODAL
        open_modal: function( path, record1, record2 ) {
            var self = this, controller = self.controllerFor('link.main');

            switch ( path ){
                case 'link.modals.company-view':
                    controller.set("company_record", record1);
                    this.render(path, {
                        into: 'application',
                        outlet: 'overview',
                        view: 'modal-manager'
                    });
                    break;
                case 'link.modals.add-feature':
                    controller.set("linked_company_record", record1);
                    controller.set("company_record", record2);

                    this.render(path, {
                        into: 'application',
                        outlet: 'overview',
                        view: 'modal-manager'
                    });
                    break;
                case 'link.modals.company-remove':
                    controller.set("company_record", record1);
                    this.render(path, {
                        into: 'application',
                        outlet: 'overview',
                        view: 'modal-manager'
                    });
                    break
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

            this.store.find('company', app_controller.company).then(function( record ){
                $.post('api/custom/unbindLinkedCompanies?token=' + app_controller.token, data).then(function(response){
                    if (response.success) {

                        record.reload();
                        //SUCCESS
                        new PNotify({
                            title: 'Success',
                            text: 'The linked company was removed.',
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
            });

        },

        custom_linkCompanies: function( record_id ){
            var self = this, controller = self.controllerFor('link.main'), app_controller = self.controllerFor('application'),
            data = this.getProperties();

            data.company = record_id;
            this.store.find('company', app_controller.company).then(function( record ){

                $.post('api/custom/linkCompanies?token=' + app_controller.token, data).then(function(response){
                    if (response.success) {
                        controller.set('searchCompany', []);
                        record.reload();
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
            });
        },

        /*per passare da un partial ad un altro tramite il cambio di una variabile*/
        change_mode: function( variable, value, record ) {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('link.main');

            controller.set(variable, value);

            if( record ) {
                controller.set('group_to_set', record);
            }
        },

        set_group: function( record, variable, value ){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('link.main');

            record.save();
            controller.set(variable, value);
        }
    }
});
