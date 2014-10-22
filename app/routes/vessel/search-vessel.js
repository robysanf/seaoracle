import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('vessel.search-vessel');

        //reset del campo di ricerca in caso di reload della pagina
        if( !app_controller.autocompleteVessel.get('length') ) {
            self.store.findQuery("vessel").then(function(vessel){
                app_controller.set("autocompleteVessel", vessel);
            });
        }

        controller.set('is_loading', false);
        controller.set('before_search', true);

        //reset search variables
        app_controller.set('searchResultList', Ember.A());
        controller.searchNickname = Ember.A();
        controller.searchPayload = null;
    },

    actions: {
        searchRecords: function() {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('vessel.search-vessel'),
                queryExpression = {}, searchPath = "sortBy";
            queryExpression[searchPath] = 'name';

            /*     ***infinite scroll***     */
            app_controller.set('searchResultList', []);
            app_controller.set('isAll', false);
            app_controller.set('perPage', 25);
            app_controller.set('firstIndex', 0);
            app_controller.set('items', []);

            controller.set('is_loading', true);
            self.render('vessel.search-result', {
                into: 'application',
                outlet: 'search-result'
            });
            if( controller.searchNickname !== "" && controller.searchNickname !== null ){
                searchPath = "nickname";
                queryExpression[searchPath] = controller.searchNickname;//.get('nickname');
            }

            if( controller.searchPayload !== "" && controller.searchPayload !== null ){
                searchPath = "payload";
                queryExpression[searchPath] = controller.searchPayload ;
            }

            this.store.findQuery('vessel', queryExpression).then(function (queryExpressResults) {

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
            });
        },

        //********************************************
        //MODAL
        open_modal: function( path, item ) {
            var self = this, controller = self.controllerFor('vessel.search-vessel');

            controller.set("vessel_record", item);
            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        remove_item: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('vessel.search-vessel');

            controller.vessel_record.deleteRecord();
            controller.vessel_record.save().then(function(){

                controller.set('searchNickname', []);
                controller.set('searchPayload', []);
                controller.set('searchResultList', []);

                app_controller.autocompleteVessel.forEach(function(item, index){

                    if( item ) {
                        if( item.get('id') === controller.vessel_record.get('id') ) {
                            app_controller.autocompleteVessel.removeAt(index);
                        }
                    }
                });

                app_controller.items.forEach(function(item, index){
                    if( item ) {
                        if( item.get('id') === controller.vessel_record.get('id') ) {
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
