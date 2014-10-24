import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, app_controller= self.controllerFor('application');

        if( !app_controller.autocompleteCompany.get('length') ) {
            self.store.findQuery("company").then(function(comp){
                app_controller.set("autocompleteCompany", comp);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }
    }
});
