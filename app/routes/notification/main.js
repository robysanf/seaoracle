import Ember from 'ember';

export default Ember.Route.extend({
    model: function( company ) {
        return this.store.find('company', company.company_id);
    },
    actions: {
        post_notification: function( company ){
            var self = this, controller = self.controllerFor('notification.main'), app_controller = self.controllerFor('application');

            this.store.find('booking', 17592186267368).then(function(book_record){
                var today = new Date();

                self.store.createRecord('notification', {
                    name: 'credit',
                    company: company,
                    date: moment(today).format("YYYY-MM-DD"),
                    fromCompanyDetail: '',
                    description: 'stanno per esaurire i crediti',
                    entityType: 'account',
                    entity: book_record,
                    status: 'show',
                    highlighted: false,
                    visibility: 'public'
                }).save();
            });


        }
    }
});
