import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('segment.segment-search');

        //reset del campo di ricerca in caso di reload della pagina
        if( !app_controller.autocompleteSegment.get('length') ) {
            this.store.findQuery("segment").then(function(val){
                app_controller.set("autocompleteSegment", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        if( !app_controller.autocompletePoiPort.get('length') ) {
            this.store.findQuery("poi", {tags: 'Port', sortBy:"name"}).then(function(val){
                app_controller.set("autocompletePoiPort", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        controller.set('is_loading', false);
        controller.set('before_search', true);

        controller.searchName = null;
        controller.searchOrigin = null;
        controller.searchDestination = null;
        controller.set('searchResultList', []);
    },

    actions: {
        searchRecords: function () {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('segment.segment-search');
            var queryExpression = {}, searchPath = "sortBy";
            queryExpression[searchPath] = 'name';

            /*     ***infinite scroll***     */
            app_controller.set('searchResultList', []);
            app_controller.set('isAll', false);
            app_controller.set('perPage', 25);
            app_controller.set('firstIndex', 0);
            app_controller.set('items', []);

            controller.set('is_loading', true);
            self.render('segment.segment-result', {
                into: 'application',
                outlet: 'search-result'
            });

            //find input values
            if( controller.searchOrigin !== "" && controller.searchOrigin != null ){
                searchPath = "origin";
                queryExpression[searchPath] = controller.searchOrigin.get('id');
            }

            if( controller.searchDestination !== "" && controller.searchDestination != null ){
                searchPath = "destination";
                queryExpression[searchPath] = controller.searchDestination.get('id');
            }

            if( controller.searchName !== "" && controller.searchName != null ){
                searchPath = "name";
                queryExpression[searchPath] = controller.searchName;//.get("name");
            }

            /** inizializzo variabili che mi serviranno qunado farò lo scroll-down nell'infinte-scroll*/
            app_controller.set('queryExpression_withoutPagination', queryExpression);
            app_controller.set('pagination_k', 'name');
            app_controller.set('queryRecord', 'segment');
            app_controller.set('queryOrder', 'ascendent');

            searchPath='pagination'; queryExpression[searchPath] =app_controller.pagination_k+","+app_controller.firstIndex+","+app_controller.perPage+','+app_controller.queryOrder;

            this.store.findQuery(app_controller.queryRecord, queryExpression).then(function(queryExpressResults){

                app_controller.set('items', queryExpressResults);

                controller.set('is_loading', false);
                controller.set('before_search', false);

                app_controller.set('firstIndex', app_controller.perPage);
                app_controller.set("searchResultList", app_controller.items);
            });
//            this.store.findQuery('segment', queryExpression).then(function(queryExpressResults){
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
            var self = this, controller = self.controllerFor('segment.segment-search');

            controller.set("segmentRecord", item);
            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        remove_item: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('segment.segment-search');

            controller.segmentRecord.deleteRecord();
            controller.segmentRecord.save().then(function(){

                controller.set('searchName', []);
                controller.set('searchOrigin', []);
                controller.set('searchDestination', []);
                controller.set('searchResultList', []);
                app_controller.autocompleteSegment.forEach(function(item, index){
                    if( item ) {
                        if( item.get('id') === controller.segmentRecord.get('id') ) {
                            app_controller.autocompleteSegment.removeAt(index);
                        }
                    }
                });

                app_controller.items.forEach(function(item, index){
                    if( item ) {
                        if( item.get('id') === controller.segmentRecord.get('id') ) {
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
        }
    }

});
