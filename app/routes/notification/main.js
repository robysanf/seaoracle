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
                    entityType: 'company',
                    entity: book_record,
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
            record.set(attr, value);
        }
    }
});
