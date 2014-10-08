import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),
    app_controller_token: Ember.computed.alias('controllers.application.token'),

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
