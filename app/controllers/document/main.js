import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    app_controller_token: Ember.computed.alias('controllers.application.token'),
    app_controller_companyType: Ember.computed.alias('controllers.application.companyType'),
    app_controller_company: Ember.computed.alias('controllers.application.company'),

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

    is_agency_notHaveCreateBL: function(){
        var comp1 = this.get('company').id;    //preso dal record in oggetto
        var comp2 = this.get('app_controller_company');
        return ( this.get('app_controller_companyType') === 'admin' && comp1 !== comp2 );
    }.property('company','app_controller_companyType', 'app_controller_company'),
//    is_admin: function(){
//        return ( this.get('app_controller_companyType') === 'admin' );
//    }.property('app_controller_companyType'),
    is_client : function(){
        return ( this.get('app_controller_companyType') === 'client' );
    }.property('app_controller_companyType'),
//    is_agency : function(){
//        return ( this.get('app_controller_companyType') === 'agency' );
//    }.property('app_controller_companyType'),
//    is_shipowner : function(){
//        return ( this.get('app_controller_companyType') === 'shipowner' );
//    }.property('app_controller_companyType'),

    document_record: null,
    /*********************
     * TAB MANAGER
     **/
    tabList: Ember.A(
        {'doc': false},
        {'items': false},
        {'details': false},
        {'files': false}
    ),

    isView: true,
    item_toRemove: null,
    type_doc: null,
    myTags: null,
    file_record: null,
//    setDocs: function(docToActive){
//        this.set('docLists.docBL',false);
//        this.set('docLists.docCM',false);
//        this.set('docLists.docLL',false);
//        this.set('docLists.docFP',false);
//
//        this.set('docLists.'+docToActive, true);
//    },

    docLists: Ember.A(
        {'docBL': false},
        {'docCM': false},
        {'docLL': false},
        {'docFP': false}
    ),

    searchStamp: null,

    itemsInList: [
        'Document',
        'Attached List'
    ]
});
