import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    app_controller_companyType: Ember.computed.alias('controllers.application.companyType'),

    is_admin: function(){
        return ( this.get('app_controller_companyType') === 'admin' );
    }.property('app_controller_companyType'),
    is_client : function(){
        return ( this.get('app_controller_companyType') === 'client' );
    }.property('app_controller_companyType'),
    is_agency : function(){
        return ( this.get('app_controller_companyType') === 'agencies' );
    }.property('app_controller_companyType'),
    is_shipowner : function(){
        return ( this.get('app_controller_companyType') === 'shipowner' );
    }.property('app_controller_companyType')
});
