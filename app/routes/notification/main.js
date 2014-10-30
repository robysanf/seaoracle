import Ember from 'ember';

export default Ember.Route.extend({
    model: function( company ) {
        return this.store.find('company', company.company_id);
    },
    actions: {
        post_notification: function( company ){
            var self = this, controller = self.controllerFor('notification.main'), app_controller = self.controllerFor('application');

            this.store.find('booking', 17592186075636).then(function(book_record){
                var today = new Date();

                self.store.createRecord('notification', {
                    name: 'link',
                    company: company,
                    date: moment(today).format("YYYY-MM-DD"),
                    fromCompanyDetail: 'Shipowner prova 1',
                    description: 'ha chiesto di connettersi alla tua rete',
                    entityType: 'booking',
                    entity: '17592186075636',
                    status: 'show',
                    highlighted: false,
                    visibility: 'public'
                }).save();
            });
        },

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
                record.set('highlighted', false)
            }
            record.set(attr, value).save();
        },

        custom_acceptedLink: function( recordFrom, recordTo, actionToken ){
            var data = this.getProperties();

            data.companyFrom = recordFrom;
            data.recordTo = recordTo;
            data.actionFn = 'linkCompanies';
            $.post('api/action?actionToken=' + actionToken, data).then(function(response){
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
        }

    }
});
