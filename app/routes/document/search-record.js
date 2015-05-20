import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('document.search-record');

        if( !app_controller.autocompleteVoyage.get('length') ) {
            this.store.findQuery('voyage', {sortBy:"name"}).then(function(val){
                app_controller.set('autocompleteVoyage', val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        if( !app_controller.autocompletePoiPort.get('length') ) {
            this.store.findQuery('poi', {tags: 'Port', sortBy:"name"}).then(function(val){
                app_controller.set('autocompletePoiPort', val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        controller.set('searchVoy', null);
        controller.set('searchOrigin', null);
        controller.set('searchDestination', null);

        controller.set('is_loading', false);
        controller.set('before_search', true);
    },

    actions: {
        searchRecords: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('document.search-record'),
                queryExpression = {}, searchPath = "sortBy";

            queryExpression[searchPath] = 'code';
            searchPath = "sortOrder"; queryExpression[searchPath] = 'descendent';

            /*     ***infinite scroll***     */
            app_controller.set('searchResultList', []);
            app_controller.set('isAll', false);
            app_controller.set('perPage', 25);
            app_controller.set('firstIndex', 0);
            app_controller.set('items', []);

            controller.set('is_loading', true);
            self.render('document.result-search-record', {
                into: 'application',
                outlet: 'search-result'
            });

            var myDocType = self.get("controller").get('docAll').filterBy('value', controller.docType);

            if(myDocType){
                myDocType.every(function(doc) {
                    searchPath = "type";
                    queryExpression[searchPath] = doc.code;
                });
            }
            if(controller.docCode !== null && controller.docCode !== ''){
                searchPath = "code";
                queryExpression[searchPath] = controller.docCode;
            }
            if(controller.docShipper !== null && controller.docShipper !== ''){
                searchPath = "shipper";
                queryExpression[searchPath] = controller.docShipper;
            }
            if(controller.docConsignee !== null && controller.docConsignee !== ''){
                searchPath = "consignee";
                queryExpression[searchPath] = controller.docConsignee;
            }
            if(controller.docNotify !== null && controller.docNotify !== ''){
                searchPath = "notify";
                queryExpression[searchPath] = controller.docNotify;
            }
            if(controller.searchVoy !== "" && controller.searchVoy !== null){
                searchPath = "voyage";
                queryExpression[searchPath] = controller.searchVoy.get('id');
            }
            if(controller.searchOrigin !== "" && controller.searchOrigin !== null){
                searchPath = "origin";
                queryExpression[searchPath] = controller.searchOrigin.get("id");
            }
            if(controller.searchDestination !== "" && controller.searchDestination !== null){
                searchPath = "destination";
                queryExpression[searchPath] = controller.searchDestination.get("id");
            }
            if(controller.searchBookRef !== "" && controller.searchBookRef !== null){
                searchPath = "bookings"; queryExpression[searchPath] = '{"booking/code":"' + controller.searchBookRef +'"}';
            }

            /** inizializzo variabili che mi serviranno qunado farò lo scroll-down nell'infinte-scroll*/
            app_controller.set('queryExpression_withoutPagination', queryExpression);
            app_controller.set('pagination_k', 'code');
            app_controller.set('queryRecord', 'document');
            app_controller.set('queryOrder', 'descendent');

            searchPath='pagination'; queryExpression[searchPath] =app_controller.pagination_k+","+app_controller.firstIndex+","+app_controller.perPage+','+app_controller.queryOrder;

            this.store.findQuery(app_controller.queryRecord, queryExpression).then(function(queryExpressResults){

                app_controller.set('items', queryExpressResults);

                controller.set('is_loading', false);
                controller.set('before_search', false);

                app_controller.set('firstIndex', app_controller.perPage);
                app_controller.set("searchResultList", app_controller.items);
            });


//            this.store.findQuery('document', queryExpression).then(function(queryExpressResults){
//
//                /*     ***infinite scroll***     */
//                app_controller.set("queryExpressResults_length", queryExpressResults.get('length'));
//                app_controller.set("queryExpressResults", queryExpressResults);
//
//                controller.set('is_loading', false);
//                controller.set('before_search', false);
//
//                queryExpressResults.forEach(function(equ, index){
//                    if(index+1 <= app_controller.perPage) {
//                        app_controller.items.pushObject(equ);
//
//                        if(index+1 === queryExpressResults.get('length')){
//                            renderResults();
//                            return false;
//                        }
//                    } else {
//                        renderResults();
//                        return false;
//                    }
//                });
//
//                function renderResults() {
//                    app_controller.set('firstIndex', app_controller.perPage);
//                    app_controller.set("searchResultList", app_controller.items);
//                }
//            }, function( reason ){
//                app_controller.send( 'error', reason );
//            });
        },

        //********************************************
        //MODAL
        open_modal: function( path, item ) {
            var self = this, controller = self.controllerFor('document.search-record');

            controller.set("doc_toRemove", item);
            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        remove_item: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('document.search-record');

            controller.doc_toRemove.deleteRecord();
            controller.doc_toRemove.save().then(function(){

                controller.set('searchVoy', []);
                controller.set('searchOrigin', []);
                controller.set('searchDestination', []);
                controller.set('searchResultList', []);

                app_controller.autocompleteDocument.forEach(function(item, index){
                    if( item ) {
                        if( item.get('id') === controller.doc_toRemove.get('id') ) {
                            app_controller.autocompleteDocument.removeAt(index);
                        }
                    }
                });

                app_controller.items.forEach(function(item, index){
                    if( item ) {
                        if( item.get('id') === controller.doc_toRemove.get('id') ) {
                            app_controller.items.removeAt(index);
                        }
                    }
                });
            });
        },

        close_item: function(){
            var self = this, app_controller = self.controllerFor('application');

            app_controller.send('close_modal', 'overview', 'application');
            //this.send('closeSearch');
        },

        link_to: function( path, value ){
            var self = this, controller = self.controllerFor('document.search-record');

            controller.set('document_record', value);

            controller.set('tabList_doc', false);
            controller.set('tabList_items', false);
            controller.set('tabList_details', false);
            controller.set('tabList_files', false);

            this.transitionTo( path, value );
        }
    }
});
