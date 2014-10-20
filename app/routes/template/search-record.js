import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('template.search-record');

        if( !app_controller.autocompleteCompany.get('length') ) {
            this.store.findQuery("company").then(function(val){
                app_controller.set("autocompleteCompany", val);
            });
        }
        if( !app_controller.autocompleteTemplate.get('length') ) {
            this.store.findQuery("template").then(function(val){
                app_controller.set("autocompleteTemplate", val);
            });
        }

        controller.set('is_loading', false);
        controller.set('before_search', true);

        //reset search variables
        app_controller.set('searchResultList', Ember.A());
        controller.searchName = Ember.A();
        controller.searchCompany = Ember.A();
    },

    actions: {
        searchRecords: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('template.search-record'),
                queryExpression = {}, searchPath = "sortBy";
            queryExpression[searchPath] = 'name';


            /*     ***infinite scroll***     */
            app_controller.set('searchResultList', []);
            app_controller.set('isAll', false);
            app_controller.set('perPage', 25);
            app_controller.set('firstIndex', 0);
            app_controller.set('items', []);

            controller.set('is_loading', true);
            self.render('template.result-search-record', {
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

            this.store.findQuery('template', queryExpression).then(function(queryExpressResults){

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
            var self = this, controller = self.controllerFor('template.search-record');

            controller.set("template_record", item);
            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        remove_item: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('template.search-record');

            controller.template_record.deleteRecord();
            controller.template_record.save().then(function(){

                controller.set('searchName', []);
                controller.set('searchCompany', []);
                controller.set('searchResultList', []);

                app_controller.autocompleteTemplate.forEach(function(item, index){

                    if( item ) {
                        if( item.get('id') === controller.template_record.get('id') ) {
                            app_controller.autocompleteTemplate.removeAt(index);
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
