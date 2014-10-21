import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application', 'document/main'],
    app_controller: Ember.computed.alias('controllers.application'),
    app_controller_companyType: Ember.computed.alias('controllers.application.companyType'),

    document_record: Ember.computed.alias('controllers.document/main.document_record'),
    tabList_details: Ember.computed.alias('controllers.document/main.tabList.details'),
    tabList_doc: Ember.computed.alias('controllers.document/main.tabList.doc'),
    tabList_items: Ember.computed.alias('controllers.document/main.tabList.items'),
    tabList_files: Ember.computed.alias('controllers.document/main.tabList.files'),

    is_admin: function(){
        return ( this.get('app_controller_companyType') === 'admin' );
    }.property('app_controller_companyType'),
    is_client : function(){
        return ( this.get('app_controller_companyType') === 'client' );
    }.property('app_controller_companyType'),
    is_agency : function(){
        return ( this.get('app_controller_companyType') === 'agency' );
    }.property('app_controller_companyType'),
    is_shipowner : function(){
        return ( this.get('app_controller_companyType') === 'shipowner' );
    }.property('app_controller_companyType'),

    before_search: false,
    is_loading: false,

    doc_toRemove: null,
    docType: null,

    docAll: [
        {'value': "Bill of Lading", 'code': "docBL"},
        {'value': "Cargo Manifest", 'code': "docCM"},
        {'value': "Loading List", 'code': "docLL"},
        {'value': "Freight Manifest", 'code': "docFP"}
    ],

    docAllType:[
        '',
        'Bill of Lading',
        'Cargo Manifest',
        'Loading List',
        'Freight Manifest'
    ],

    docBLCMType:[
        '',
        'Bill of Lading',
        'Cargo Manifest'

    ],

    docLLFPType:[
        '',
        'Loading List',
        'Freight Manifest'
    ],

    searchVoy: Ember.A(),
    searchOrigin: Ember.A(),
    searchDestination: Ember.A(),
    searchBookRef: null,

    docCode: null,
    docShipper: null,
    docConsignee: null,
    docNotify: null


//    docsList: Ember.A(),
//    searchResults: function() { return this.docsList; }.property('docsList'),
//
//    init: function(){
//        this._super.apply(this, arguments);
//    }
});
