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
    },

    model: function( company ) {
        return this.store.find('company', company.company_id);
    },

    actions: {
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
            var self = this, controller = self.controllerFor('company.search-company');

            controller.set('companyRecord', value);
            controller.set('company_id', value.get('id'));
            controller.set('tabListDetails', false);
            controller.set('tabListUsers', false);
            controller.set('tabListFiles', false);

            this.transitionTo(path, value.id);
        }

    }
});
