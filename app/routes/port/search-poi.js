import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('port.search-poi');

//        if( app_controller.autocompletePoiPort.get('length') === 0 ){
            self.store.findQuery("poi", {tags: "Port"}).then(function(ware){
                app_controller.set("autocompletePoiPort", ware);
            });
//        }

        //reset search variables
        app_controller.set('searchResultList',[]);

        controller.searchName = Ember.A();
        controller.searchUnLocode = Ember.A();
        controller.searchCountry = null;

        controller.set('is_loading', false);
        controller.set('before_search', true);
    },

    actions: {
        searchRecords: function() {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('port.search-poi');
            var queryExpression = {}, searchPath = "sortBy";
            queryExpression[searchPath] = 'name';
            searchPath = "tags";
            queryExpression[searchPath] = "Port";

            /*     ***infinite scroll***     */
            app_controller.set('searchResultList', []);
            app_controller.set('isAll', false);
            app_controller.set('perPage', 25);
            app_controller.set('firstIndex', 0);
            app_controller.set('items', []);

            controller.set('is_loading', true);

            self.render('port.search-result', {
                into: 'application',
                outlet: 'search-result'
            });
            //find input values
            if( controller.searchName !== "" && controller.searchName !== null ){
                searchPath = "name";
                queryExpression[searchPath] = controller.searchName;//.get('name');
            }

            if( controller.searchUnLocode !== "" && controller.searchUnLocode !== null ){
                searchPath = "unLocode";
                queryExpression[searchPath] = controller.searchUnLocode.get('unLocode');
            }

            if(controller.searchCountry !== null && controller.searchCountry !== ""){
                searchPath = "country";
                queryExpression[searchPath] = controller.searchCountry.country;
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
                    app_controller.firstIndex = app_controller.perPage;
                    app_controller.set("searchResultList", app_controller.items);

                }
            });
        },

        //********************************************
        //MODAL
        open_modal: function( path, item ) {
            var self = this, controller = self.controllerFor('port.search-poi');

            controller.set("poiRecord", item);
            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        remove_item: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('port.search-poi');

            controller.poiRecord.deleteRecord();
            controller.poiRecord.save().then(function(){

                controller.set('searchName', []);
                controller.set('searchUnLocode', []);
                controller.set('searchResultList', []);

                app_controller.autocompletePoiPort.forEach(function(item, index){
                    if( item ) {
                        if( item.get('id') === controller.poiRecord.get('id') ) {
                            app_controller.autocompletePoiPort.removeAt(index);
                        }
                    }
                });
            });
        },

        close_item: function(){
            var self = this, app_controller = self.controllerFor('application');

            app_controller.send('close_modal', 'overview', 'application');
            this.send('closeSearch');
        }

    }
});
