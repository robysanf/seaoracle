import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this,  controller = self.controllerFor('equipment-classification.search-record'), app_controller = self.controllerFor('application'),
         queryExpression = {}, searchPath = "equipmentType";
        queryExpression[searchPath] = 'container';

        searchPath = "available";
        queryExpression[searchPath] = true;

        if( !app_controller.autocompleteEqClassification.get('length') ) {
            self.store.findQuery("equipmentClassification", queryExpression).then(function(val){
                app_controller.set("autocompleteEqClassification", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        //reset search variables
        app_controller.set('searchResultList', []);
        controller.searchName = Ember.A();
        controller.searchSizeCode = Ember.A();
        controller.searchTypeCode = Ember.A();
        controller.searchIsoCode = Ember.A();

        controller.set('is_loading', false);
        controller.set('before_search', true);
    },

    actions: {
        searchRecords: function() {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('equipment-classification.search-record'),
                queryExpression = {}, searchPath = "sortBy";
            queryExpression[searchPath] = 'name';

            /*     ***infinite scroll***     */
            app_controller.set('searchResultList', []);
            app_controller.set('isAll', false);
            app_controller.set('perPage', 25);
            app_controller.set('firstIndex', 0);
            app_controller.set('items', []);

            controller.set('is_loading', true);

            self.render('equipment-classification.result-search-record', {
                into: 'application',
                outlet: 'search-result'
            });

            //find input values
            if( controller.searchName !== "" && controller.searchName !== null ){
                searchPath = "name"; queryExpression[searchPath] = controller.searchName;//.get('name');
            }

            if( controller.searchSizeCode !== "" && controller.searchSizeCode !== null ){
                searchPath = "sizeCode"; queryExpression[searchPath] = controller.searchSizeCode.get('sizeCode');
            }

            if( controller.searchTypeCode !== "" && controller.searchTypeCode !== null ){
                searchPath = "typeCode"; queryExpression[searchPath] = controller.searchTypeCode.get('typeCode');
            }

            if( controller.searchIsoCode !== "" && controller.searchIsoCode !== null ){
                searchPath = "isoCode"; queryExpression[searchPath] = controller.searchIsoCode.get('isoCode');
            }

            /** inizializzo variabili che mi serviranno qunado farò lo scroll-down nell'infinte-scroll*/
            app_controller.set('queryExpression_withoutPagination', queryExpression);
            app_controller.set('pagination_k', 'name');
            app_controller.set('queryRecord', 'equipment-classification');
            app_controller.set('queryOrder', 'ascendent');

            searchPath='pagination'; queryExpression[searchPath] =app_controller.pagination_k+","+app_controller.firstIndex+","+app_controller.perPage+','+app_controller.queryOrder;

            this.store.findQuery(app_controller.queryRecord, queryExpression).then(function(queryExpressResults){

                app_controller.set('items', queryExpressResults);

                controller.set('is_loading', false);
                controller.set('before_search', false);

                app_controller.set('firstIndex', app_controller.perPage);
                app_controller.set("searchResultList", app_controller.items);
            });

//            this.store.findQuery('equipment-classification', queryExpression).then(function(queryExpressResults){
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
//
//
//                }
//            }, function( reason ){
//                app_controller.send( 'error', reason );
//            });
        },

        //********************************************
        //MODAL
        open_modal: function( path, item ) {
            var self = this, controller = self.controllerFor('equipment-classification.search-record');

            controller.set("eqClassification_record", item);
            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        remove_item: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('equipment-classification.search-record');

            controller.eqClassification_record.deleteRecord();
            controller.eqClassification_record.save().then(function(){

                controller.set('searchName', []);
                controller.set('searchSizeCode', []);
                controller.set('searchTypeCode', []);
                controller.set('searchIsoCode', []);

                controller.set('searchResultList', []);
                app_controller.autocompleteEqClassification.forEach(function(item, index){
                    if( item ) {
                        if( item.get('id') === controller.eqClassification_record.get('id') ) {
                            app_controller.autocompleteEqClassification.removeAt(index);
                        }
                    }
                });

                app_controller.items.forEach(function(item, index){
                    if( item ) {
                        if( item.get('id') === controller.eqClassification_record.get('id') ) {
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
