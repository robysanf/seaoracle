import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('segment.segment-search');

        //reset del campo di ricerca in caso di reload della pagina
        if( !app_controller.autocompleteSegment.get('length') ) {
            this.store.findQuery("segment").then(function(val){
                app_controller.set("autocompleteSegment", val);
            });
        }

        if( !app_controller.autocompletePoiPort.get('length') ) {
            this.store.findQuery("poi", {tags: 'Port'}).then(function(val){
                app_controller.set("autocompletePoiPort", val);
            });
        }

        controller.searchName = Ember.A();
        controller.searchOrigin = Ember.A();
        controller.searchDestination = Ember.A();
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


            this.store.findQuery('segment', queryExpression).then(function(queryExpressResults){

                /*     ***infinite scroll***     */
                app_controller.set("queryExpressResults_length", queryExpressResults.get('length'));
                app_controller.set("queryExpressResults", queryExpressResults);

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

                    self.render('segment.segment-result', {
                        into: 'application',
                        outlet: 'search-result'
                    });
                }
            });
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
            });
        },

        close_item: function(){
            var self = this, app_controller = self.controllerFor('application');

            app_controller.send('close_modal', 'overview', 'application');
            this.send('closeSearch');
        }
    }

});
