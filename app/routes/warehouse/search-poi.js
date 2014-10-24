import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('warehouse.search-poi');

        //reset del campo di ricerca in caso di reload della pagina
        if( app_controller.autocompletePoiWarehouse.length === 0 ) {
            this.store.findQuery("poi", {tags: "Warehouse"}).then(function(val){
                app_controller.set("autocompletePoiWarehouse", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        if( app_controller.autocompleteCompany.length === 0 ) {
            this.store.findQuery("company").then(function(val){
                app_controller.set("autocompleteCompany", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        controller.set('is_loading', false);
        controller.set('before_search', true);

        controller.searchName = Ember.A();
        controller.searchCompany = Ember.A();
        app_controller.set('searchResultList', []);       //FIXME warehouseList
    },


    actions: {
        searchRecords: function() {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('warehouse.search-poi');
            var queryExpression = {}, searchPath = "sortBy";
            queryExpression[searchPath] = 'name';
            searchPath = "tags";
            queryExpression[searchPath] = "Warehouse";

            /*     ***infinite scroll***     */
            app_controller.set('searchResultList', []);
            app_controller.set('isAll', false);
            app_controller.set('perPage', 25);
            app_controller.set('firstIndex', 0);
            app_controller.set('items', []);

            controller.set('is_loading', true);
            self.render('warehouse.search-result', {
                into: 'application',
                outlet: 'search-result'
            });

            //find input values
            if( controller.searchName !== "" && controller.searchName != null ){
                searchPath = "name";
                queryExpression[searchPath] = controller.searchName;//.get('name');
            }

            if( controller.searchCompany !== "" && controller.searchCompany != null ){
                searchPath = "company";
                queryExpression[searchPath] = controller.searchCompany.get("id");
            }

            if(controller.searchCountry !== "" && controller.searchCountry != null ){
                searchPath = "country";
                queryExpression[searchPath] = controller.searchCountry;
            }

            if(controller.searchCity !== "" && controller.searchCity != null ){
                searchPath = "city";
                queryExpression[searchPath] = controller.searchCity;
            }


            this.store.findQuery('poi', queryExpression).then(function(queryExpressResults){
                /*     ***infinite scroll***     */
                app_controller.set("queryExpressResults_length", queryExpressResults.get('length'));
                app_controller.set("queryExpressResults", queryExpressResults);

                controller.set('is_loading', false);
                controller.set('before_search', false);

                queryExpressResults.forEach(function(equ, index){
                    if(index+1 <= app_controller.perPage) {
                        app_controller.items.pushObject(equ);

                        if(index+1 === queryExpressResults.get('length')){
                            renderResults();
                            return false;
                        }
                    } else {
                        renderResults();
                        return false;
                    }
                });

                function renderResults() {
                    app_controller.set('firstIndex', app_controller.perPage);
                    app_controller.set("searchResultList", app_controller.items);
                }

//                app_controller.set("searchResultList", queryExpressResults);
//
//                self.render('warehouse.search-result', {
//                    into: 'application',
//                    outlet: 'search-result'
//                });
            }, function( reason ){
                app_controller.send( 'error', reason );
            });

        },

        //********************************************
        //MODAL
        open_modal: function( path, item ) {
            var self = this, controller = self.controllerFor('warehouse.search-poi');

            controller.set("poiRecord", item);
            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        remove_item: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('warehouse.search-poi');

            controller.poiRecord.deleteRecord();
            controller.poiRecord.save().then(function(){

                controller.set('searchName', []);
                controller.set('searchCompany', []);
                controller.set('searchResultList', []);

                app_controller.autocompletePoiWarehouse.forEach(function(item, index){
                    if( item ) {
                        if( item.get('id') === controller.poiRecord.get('id') ) {
                            app_controller.autocompletePoiWarehouse.removeAt(index);
                        }
                    }
                });
                app_controller.items.forEach(function(item, index){
                    if( item ) {
                        if( item.get('id') === controller.poiRecord.get('id') ) {
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
