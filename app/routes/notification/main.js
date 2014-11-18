import Ember from 'ember';

export default Ember.Route.extend({
    model: function( company ) {
        return this.store.find('company', company.company_id);
    },
    actions: {
        /**
         Riassegna un valore ad un attrobuto di un record. Nel caso specifico definisco quali notifiche devono essere
         evidenziate in giallo e quali no.

         @action change_state
         @for notification/main-page
         @param {record} uno specifico record di un model
         @param {string} attributo del record che deve essere modificato
         @param {object} nuovo valore dell'attributo
         */
        change_state: function( record, attr, value ) {
            if( attr === 'status' ){
                record.set('highlighted', false).save();
            }
            record.set(attr, value).save();
        },

        custom_acceptedLink: function( record, recordFrom, recordTo, actionToken ){
            var self = this, app_controller = self.controllerFor('application'),
            data = this.getProperties();

//                data.companyFrom = recordFrom.get('id');
//                data.companyTo = recordTo.get('id');
                data.actionFn = 'linkCompanies';

                $.post('api/action?actionToken=' + actionToken, data).then(function(response){
                    if (response.success) {
                        record.set('actionToken', '');
                        record.set('highlighted', false).save();
                        recordFrom.reload();
                        recordTo.reload();

                        //NOT SAVED
                        new PNotify({
                            title: 'Success',
                            text: 'The request was accepted.',
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
        //********************************************
        //MODAL
        open_modal: function( path, item ) {
            var self = this, controller = self.controllerFor('notification.main');

            controller.set("notification_record", item);
            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        close_item: function(){
            var self = this, app_controller = self.controllerFor('application');

            app_controller.send('close_modal', 'overview', 'application');
        },

        link_to: function( path, entity, record ){
            record.set('highlighted', false).save();
            this.transitionTo(path, entity);
        }

    }
});
