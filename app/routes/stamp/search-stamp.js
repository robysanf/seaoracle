import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('stamp.search-stamp');

//      **************
//      INIT.
        //filter on search port of origin and port of destination in the template
        if( !app_controller.autocompleteStamp.get('length') ){
            this.store.findQuery("stamp").then(function(val){
                app_controller.set("autocompleteStamp", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        //reset search variables
        app_controller.set('searchResultList', []);
        controller.searchName = Ember.A();
        controller.searchType = Ember.A();

        controller.set('is_loading', false);
        controller.set('before_search', true);
    },


    actions: {
        searchRecords: function() {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('stamp.search-stamp'),
                queryExpression = {}, searchPath = "sortBy";
            queryExpression[searchPath] = 'name';


            /*     ***infinite scroll***     */
            app_controller.set('searchResultList', []);
            app_controller.set('isAll', false);
            app_controller.set('perPage', 25);
            app_controller.set('firstIndex', 0);
            app_controller.set('items', []);

            controller.set('is_loading', true);
            self.render('stamp.search-result', {
                into: 'application',
                outlet: 'search-result'
            });
            //find input values
            if( controller.searchName !== "" && controller.searchName !== null ){
                searchPath = "name";
                queryExpression[searchPath] = controller.searchName;//.get('name');
            }

            if( controller.searchType !== "" && controller.searchType !== null ){
                searchPath = "type";
                queryExpression[searchPath] = controller.searchType.get('type');
            }

//            if( controller.searchValue !== "" && controller.searchValue !== null ){
//                searchPath = "value";
//                queryExpression[searchPath] = controller.searchValue.get('value');
//            }


            this.store.findQuery('stamp', queryExpression).then(function(queryExpressResults){

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
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        },

        //********************************************
        //MODAL
        open_modal: function( path, item ) {
            var self = this, controller = self.controllerFor('stamp.search-stamp');

            controller.set("record_stamp", item);
            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        remove_item: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('stamp.search-stamp'),
                record_id = controller.record_stamp.get('id');

            controller.record_stamp.deleteRecord();
            controller.record_stamp.save().then(function(){

                controller.set('searchName', []);
                controller.set('searchType', []);
                controller.set('searchResultList', []);

                app_controller.autocompleteStamp.forEach(function( item, index ){
                    if( item ) {
                        if( item.get('id') === record_id ) {
                            app_controller.autocompleteStamp.removeAt(index);
                        }
                    }
                });

                app_controller.items.forEach(function( item, index ){
                    if( item ) {
                        if( item.get('id') === record_id ) {
                            app_controller.items.removeAt( index );
                        }
                    }
                });
            });
        },

        close_item: function(){
            var self = this, app_controller = self.controllerFor('application');

            app_controller.send('close_modal', 'overview', 'application');
            //(this.send('closeSearch');
        }
    }
});
