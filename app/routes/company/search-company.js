import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('company.search-company');

        //reset del campo di ricerca in caso di reload della pagina
//        this.store.findQuery("user").then(function(val){
//            app_controller.set("autocompleteUser", val);
//        });

        this.store.findQuery("company").then(function(val){
            app_controller.set("autocompleteCompany", val);
        });

        controller.set('is_loading', false);
        controller.set('before_search', true);
        controller.searchUser = Ember.A();
        controller.searchCompany = Ember.A();
        app_controller.set('searchResultList', []);
    },

    actions: {
        searchRecords: function() {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('company.search-company');
            var queryExpression = {}, searchPath = "sortBy";
            queryExpression[searchPath] = 'name';

            controller.set('is_loading', true);

            self.render('company.search-result', {
                into: 'application',
                outlet: 'search-result'
            });

            /*     ***infinite scroll***     */
            app_controller.set('searchResultList', []);
            app_controller.set('isAll', false);
            app_controller.set('perPage', 25);
            app_controller.set('firstIndex', 0);
            app_controller.set('items', []);

            if (controller.vat !== "" && controller.vat !== null) {
                searchPath = "vat";
                queryExpression[searchPath] = controller.vat;
            }

            if (controller.searchCompany !== "" && controller.searchCompany !== null) {
                searchPath = "name";
                queryExpression[searchPath] = controller.searchCompany;//.get('name');
            }

            this.store.findQuery('company', queryExpression).then(function (queryExpressResults) {

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
            var self = this, controller = self.controllerFor('company.search-company');

            controller.set("companyId", item);
            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        remove_item: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('company.search-company');

            controller.companyId.deleteRecord();
            controller.companyId.save().then(function(){

                controller.set('searchCompany', []);
                controller.set('searchResultList', []);
                app_controller.autocompleteCompany.forEach(function(item, index){

                    if( item ) {
                        if( item.get('id') === controller.companyId.get('id') ) {
                            app_controller.autocompleteCompany.removeAt(index);
                        }
                    }
                });
            });
        },

        close_item: function(){
            var self = this, app_controller = self.controllerFor('application');

            app_controller.send('close_modal', 'overview', 'application');
            this.send('closeSearch');
        },

        getId: function( path, value ){
            var self = this, controller = self.controllerFor('company.search-company');

            controller.set('companyRecord', value);
            controller.set('company_id', value.get('id'));
            controller.set('tabListDetails', false);
            controller.set('tabListUsers', false);
            controller.set('tabListFiles', false);

            this.transitionTo(path, value.id);
        }
    }
});
