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
        return ( this.get('app_controller_companyType') === 'agency' );
    }.property('app_controller_companyType'),
    is_shipowner : function(){
        return ( this.get('app_controller_companyType') === 'shipowner' );
    }.property('app_controller_companyType'),

    docType: null,
    is_docType_docBL: function(){
         return (this.get('docType') === 'Bill of Lading' );
    }.property('docType'),
    is_docType_docCM: function(){
        return (this.get('docType') === 'Cargo Manifest' );
    }.property('docType'),
    is_docType_docLL: function(){
        return (this.get('docType') === 'Loading List' );
    }.property('docType'),
    is_docType_docFP: function(){
        return (this.get('docType') === 'Freight Manifest' );
    }.property('docType'),

    actualOrigin: Ember.A(),
    actualDestination: Ember.A(),
    actualVoyage: Ember.A(),

    docAll: [
        {'value': "Bill of Lading", 'code': "docBL"},
        {'value': "Cargo Manifest", 'code': "docCM"},
        {'value': "Loading List", 'code': "docLL"},
        {'value': "Freight Manifest", 'code': "docFP"}
    ],

    docAllType:[
        'Bill of Lading',
        'Cargo Manifest',
        'Loading List',
        'Freight Manifest'
    ],

    docBLCMType:[
        'Bill of Lading',
        'Cargo Manifest'

    ],

    docLLFPType:[
        'Loading List',
        'Freight Manifest'
    ],

    searchOrigin: Ember.A(),
    searchDestination: Ember.A(),
    searchVoyage: Ember.A(),

    name: null,
    nOriginal: '01/ONE',
    nOriginal_bl: '03/THREE',

    originList_LL: function(){ return Ember.A([]) }.property(),
    destinationList_LL: function(){ return Ember.A([]) }.property(),
    selectedBookItList: function(){ return Ember.A([]) }.property(),

    actions: {
        managerCheckLists: function(bookId, value, key, type, bool) {
            var self = this;

            if(bool) {
                switch(type) {
                    case 'origin_LL':
                        this.get('originList_LL').addObject(value);
                        break;
                    case 'destination_LL':
                        this.get('destinationList_LL').addObject(value);
                        break;
                    case 'bookIt':
                        this.get('selectedBookItList').addObject(value);
                        this.get('selectedBookItList').unique();
                        break;
                    case 'allChecked':
                        if(key == 'allChecked' && value == true) {
                            this.get("selectedBookItList").filter(function(val, index){
                                var id = val.content.id, parentController = val.get('parentController').get('content').get('id');

                                if(parentController == bookId) {
                                    self.get('selectedBookItList').objectAt(index).set('isChecked', true);
                                }
                            });

                        } else if (key == 'allChecked' && value == false) {
                            this.get("selectedBookItList").filter(function(val, index){
                                var id = val.content.id, parentController = val.get('parentController').get('content').get('id');   //parentController è l'id del booking a cui fà riferimento il bookingItem ( val )

                                if(parentController == bookId) {
                                    self.get('selectedBookItList').objectAt(index).set('isChecked', false);
                                }
                            });
                            return value;
                        }
                        break;
                }
            } else {
                switch(type) {
                    case 'origin_LL':
                        this.get('originList_LL').removeObject(value);
                        break;
                    case 'destination_LL':
                        this.get('destinationList_LL').removeObject(value);
                        break;
                    case 'bookIt':
                        this.get('selectedBookItList').removeObject(value);
                        break;
                    case 'allChecked':
//                        var selectedBook = this.get('selectedBookItList');
//                        return selectedBook && selectedBook.everyProperty('isChecked');
                        break;
                }
            }
        }
    }
});

