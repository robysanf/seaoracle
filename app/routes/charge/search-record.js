import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('charge.search-record');

        //reset del campo di ricerca in caso di reload della pagina
        if( !app_controller.autocompleteCharge.get('length') ) {
            self.store.findQuery("charge").then(function(model){
                app_controller.set("autocompleteCharge", model);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        if( !app_controller.autocompleteCompany.get('length') ) {
            self.store.findQuery("company").then(function(model){
                app_controller.set("autocompleteCompany", model);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        //reset search variables
        app_controller.set('searchResultList', []);
        controller.searchCompany = null;
        controller.searchCharge = null;

        controller.set('is_loading', false);
        controller.set('before_search', true);
    },

    actions: {
        searchRecords: function () {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('charge.search-record'),
                queryExpression = {}, searchPath = "sortBy";
            queryExpression[searchPath] = 'name';

            /*     ***infinite scroll***     */
            app_controller.set('searchResultList', []);
            app_controller.set('isAll', false);
            app_controller.set('perPage', 25);
            app_controller.set('firstIndex', 0);
            app_controller.set('items', []);

            controller.set('is_loading', true);

            self.render('charge.result-search', {
                into: 'application',
                outlet: 'search-result'
            });
            //find input values
            if( controller.searchCharge !== "" && controller.searchCharge !== null ){
                searchPath = "name"; queryExpression[searchPath] = controller.searchCharge;//.get('name');
            }

            if( controller.searchCompany !== "" && controller.searchCompany !== null ){
                searchPath = "company"; queryExpression[searchPath] = controller.searchCompany.get("id");
            }


            this.store.findQuery('charge', queryExpression).then(function(queryExpressResults){
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
            var self = this, controller = self.controllerFor('charge.search-record');

            controller.set("charge_record", item);
            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        remove_item: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('charge.search-record');

            controller.charge_record.deleteRecord();
            controller.charge_record.save().then(function(){

                controller.set('searchCharge', []);
                controller.set('searchCompany', []);
                controller.set('searchResultList', []);
                app_controller.autocompleteCharge.forEach(function(item, index){
                    if( item ) {
                        if( item.get('id') === controller.charge_record.get('id') ) {
                            app_controller.autocompleteCharge.removeAt(index);
                        }
                    }
                });

                app_controller.items.forEach(function(item, index){
                    if( item ) {
                        if( item.get('id') === controller.charge_record.get('id') ) {
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

        /**
         Transizione dalla pagina di search al record scelto; prima di passare alla pagina di 'main' si settano tutte
         le tab a 'false' in modo che si parta da una configurazione di default.

         @action transition_to_record
         @for charge/result-search.hbs
         @param {string} path al quale deve essere fatto il link-to
         @param {record} entità di riferimento
         */
        transition_to_record: function( path, value ){
            var self = this, controller = self.controllerFor('charge.search-record');

            controller.set('tabListDetails', false);
            controller.set('tabListChargeItems_book', false);
            controller.set('tabListChargeItems_cont', false);
            controller.set('tabListChargeItems_roro', false);
            controller.set('tabListChargeItems_bb', false);
            controller.set('chargeRecord', value);

            this.transitionTo(path, value.id);
        }

    }
});
