import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('voyage.search-record');

        if( !app_controller.autocompleteCompany.get('length') ) {
            this.store.findQuery("company", {sortBy:"name"}).then(function(val){
                app_controller.set("autocompleteCompany", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }
        if( !app_controller.autocompleteVoyage.get('length') ) {
            this.store.findQuery("voyage", {sortBy:"name"}).then(function(val){
                app_controller.set("autocompleteVoyage", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        controller.set('is_loading', false);
        controller.set('before_search', true);

        //reset search variables
        app_controller.set('searchResultList', []);
        controller.searchName = null;
        controller.searchCompany = null;
    },

    actions: {
        searchRecords: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('voyage.search-record'),
                queryExpression = {}, searchPath = "sortBy";
            queryExpression[searchPath] = 'name';


            /*     ***infinite scroll***     */
            app_controller.set('searchResultList', []);
            app_controller.set('isAll', false);
            app_controller.set('perPage', 25);
            app_controller.set('firstIndex', 0);
            app_controller.set('items', []);

            controller.set('is_loading', true);
            self.render('voyage.result-search-record', {
                into: 'application',
                outlet: 'search-result'
            });
            //find input values
            if( controller.searchName !== '' && controller.searchName !== null ){
                searchPath = "name";
                queryExpression[searchPath] = controller.searchName;//.get('name');
            }

            if( controller.searchCompany !== '' && controller.searchCompany !== null ){
                searchPath = "company";
                queryExpression[searchPath] =  controller.searchCompany.get("id");
            }

            /** inizializzo variabili che mi serviranno qunado farò lo scroll-down nell'infinte-scroll*/
            app_controller.set('queryExpression_withoutPagination', queryExpression);
            app_controller.set('pagination_k', 'name');
            app_controller.set('queryRecord', 'voyage');
            app_controller.set('queryOrder', 'ascendent');

            searchPath='pagination'; queryExpression[searchPath] =app_controller.pagination_k+","+app_controller.firstIndex+","+app_controller.perPage+','+app_controller.queryOrder;

            this.store.findQuery(app_controller.queryRecord, queryExpression).then(function(queryExpressResults){

                app_controller.set('items', queryExpressResults);

                controller.set('is_loading', false);
                controller.set('before_search', false);

                app_controller.set('firstIndex', app_controller.perPage);
                app_controller.set("searchResultList", app_controller.items);
            });

//            this.store.findQuery('voyage', queryExpression).then(function(queryExpressResults){
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
            var self = this, controller = self.controllerFor('voyage.search-record');

            controller.set("voyage_record", item);
            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        /*
        * CANCELLAZIONE DI UN VIAGGIO
        * viene eseguito un controllo su tutte le legs contenute nello schedules del viaggio per verificare che non
        * siano collegate a nessun FreigthPlan; in caso contrario viene avvertito l'utente dell'impossibilità di eliminare
        * il viaggio.
        *
        * @action: remove_item
        * @path: voyage/result-search-record.hbs
        * */
        remove_item: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('voyage.search-record'),
                arrayOrigin = [], arrayDestination = [];

            controller.voyage_record.get('schedules').then(function(legs_list){

               if(legs_list.get('length')){
                   legs_list.every(function(val, index){
                       arrayOrigin = val.get('originFreightPlans');
                       arrayDestination = val.get('destinationFreightPlans');

                       if( arrayOrigin === null || arrayOrigin === undefined ){
                           arrayOrigin = [];
                       }
                       if( arrayDestination === null || arrayDestination === undefined ){
                           arrayDestination = [];
                       }


                       if(arrayOrigin.length !== 0 || arrayDestination.length !== 0) {
                           new PNotify({
                               title: 'Attention',
                               text: 'It is not possible to remove this item.',
                               type: 'info'
                           });
                           return false;
                       } else {
                           var length = legs_list.get('length');
                           if( length === index+1 ){
                               controller.voyage_record.deleteRecord();
                               controller.voyage_record.save().then(function(){

                                   controller.set('searchName', []);
                                   controller.set('searchCompany', []);
                                   controller.set('searchResultList', []);

                                   app_controller.autocompleteVoyage.forEach(function(item, index){

                                       if( item ) {
                                           if( item.get('id') === controller.voyage_record.get('id') ) {
                                               app_controller.autocompleteVoyage.removeAt(index);
                                           }
                                       }
                                   });
                               });
                           }
                           return true;
                       }
                   });
               } else {
                   controller.voyage_record.deleteRecord();
                   controller.voyage_record.save().then(function(){

                       controller.set('searchName', []);
                       controller.set('searchCompany', []);
                       controller.set('searchResultList', []);

                       app_controller.autocompleteVoyage.forEach(function(item, index){

                           if( item ) {
                               if( item.get('id') === controller.voyage_record.get('id') ) {
                                   app_controller.autocompleteVoyage.removeAt(index);
                               }
                           }
                       });

                       app_controller.items.forEach(function(item, index){
                           if( item ) {
                               if( item.get('id') === controller.voyage_record.get('id') ) {
                                   app_controller.items.removeAt(index);
                               }
                           }
                       });
                   });
               }

            });
        },

        close_item: function(){
            var self = this, app_controller = self.controllerFor('application');

            app_controller.send('close_modal', 'overview', 'application');
            //this.send('closeSearch');
        },

        go_to: function( path, record ){
            var self = this, controller = self.controllerFor('voyage.search-record');

            controller.set('tabListDetails', false);
            controller.set('tabListPath', false);

            this.transitionTo(path, record.id);
        }
    }
});
