import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application', 'booking/main'],
    app_controller: Ember.computed.alias('controllers.application'),

    app_controller_companyType: Ember.computed.alias('controllers.application.companyType'),

    bookingMain_record: Ember.computed.alias('controllers.booking/main.booking_record'),

    tabList_details: Ember.computed.alias('controllers.booking/main.tabList.details'),
    tabList_freightPlan: Ember.computed.alias('controllers.booking/main.tabList.freightPlan'),
    tabList_revenues: Ember.computed.alias('controllers.booking/main.tabList.revenues'),
    tabList_container: Ember.computed.alias('controllers.booking/main.tabList.container'),
    tabList_roro: Ember.computed.alias('controllers.booking/main.tabList.roro'),
    tabList_bb: Ember.computed.alias('controllers.booking/main.tabList.bb'),
    tabList_itemStatus: Ember.computed.alias('controllers.booking/main.tabList.itemStatus'),
    tabList_files: Ember.computed.alias('controllers.booking/main.tabList.files'),


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
