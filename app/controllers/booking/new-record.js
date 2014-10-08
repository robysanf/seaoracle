import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

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
    }.property('app_controller_companyType'),

    isNotRequest: true,

    //instantiated on the Template
    searchPortOrigin: null,
    searchPortDestination: null,
    searchCustomManifestHandler: null,
    searchCompany: null, //svolge il ruolo di client o agency a differenza che tu stia creando una booking request o un new booking
    searchConsignee: null,
    searchShipper: null,
    searchNotify: null,
    searchAgency: null,

    currencyClassification: [
        'EUR',
        'USD'
    ]

});
