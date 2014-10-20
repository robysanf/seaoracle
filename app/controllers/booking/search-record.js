import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application', 'booking/main'],
    app_controller: Ember.computed.alias('controllers.application'),
    app_controller_companyType: Ember.computed.alias('controllers.application.companyType'),

    tabList_details: Ember.computed.alias('controllers.booking/main.tabList.details'),
    tabList_freightPlan: Ember.computed.alias('controllers.booking/main.tabList.freightPlan'),
    tabList_revenues: Ember.computed.alias('controllers.booking/main.tabList.revenues'),
    tabList_container: Ember.computed.alias('controllers.booking/main.tabList.container'),
    tabList_roro: Ember.computed.alias('controllers.booking/main.tabList.roro'),
    tabList_bb: Ember.computed.alias('controllers.booking/main.tabList.bb'),
    tabList_itemStatus: Ember.computed.alias('controllers.booking/main.tabList.itemStatus'),
    tabList_files: Ember.computed.alias('controllers.booking/main.tabList.files'),

    subTabList_goods: Ember.computed.alias('controllers.booking/main.subTabLists.goods'),
    subTabList_details: Ember.computed.alias('controllers.booking/main.subTabLists.details'),
    subTabList_haulage: Ember.computed.alias('controllers.booking/main.subTabLists.haulage'),
    subTabList_customs: Ember.computed.alias('controllers.booking/main.subTabLists.customs'),
    subTabList_status: Ember.computed.alias('controllers.booking/main.subTabLists.status'),
    subTabList_revenues: Ember.computed.alias('controllers.booking/main.subTabLists.revenues'),
    subTabList_files: Ember.computed.alias('controllers.booking/main.subTabLists.files'),

    is_client : function(){
        return ( this.app_controller_companyType === 'client' );
    }.property('app_controller_companyType'),
    is_shipowner : function(){
        return ( this.app_controller_companyType === 'shipowner' );
    }.property('app_controller_companyType'),

    before_search: false,
    is_loading: false,

    booking_record: null,
    searchPortOrigin: null,
    searchPortDestination: null,
    searchBookRef: null,
    searchCompany: null,
    searchShipper: null,
    searchConsignee: null,
    searchVoy: null,
    searchContainerNumber: null,
    searchChassis: null,

    searchState: null,
    stateList: [
        '',
        'request',
        'pending',
        'edit',
        'lock',
        'register'
    ],

    acknowledgeList: [
        '',
        'NaN',
        'accepted',
        'rejected'
    ],

    acknowledge_selectedValue: ''


});
