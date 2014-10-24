import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this,  controller = self.controllerFor('equipment.search-record'), app_controller = self.controllerFor('application');

        if( !app_controller.autocompleteCompany.get('length') ) {
            self.store.findQuery("company").then(function(val){
                app_controller.set("autocompleteCompany", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        if( !app_controller.autocompletePoiPort.get('length') ) {
            self.store.findQuery("poi", {tags: "Port"}).then(function(val){
                app_controller.set("autocompletePoiPort", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        if( !app_controller.autocompleteEquipment.get('length') ) {
            self.store.findQuery("equipment").then(function(val){
                app_controller.set("autocompleteEquipment", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        if( !app_controller.autocompleteEqClassification.get('length') ) {
            var queryExpression = {}, searchPath = "equipmentType";
            queryExpression[searchPath] = 'container';
            searchPath = "available";
            queryExpression[searchPath] = true;
            self.store.findQuery("equipmentClassification", queryExpression).then(function(val){
                app_controller.set("autocompleteEqClassification", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        //reset search variables
        app_controller.set('searchResultList', []);
        controller.searchPosition = Ember.A();
        controller.searchCode = Ember.A();
        controller.searchClassification = Ember.A();
        controller.searchSupplier = Ember.A();
        controller.searchVoyage = Ember.A();

        controller.set('is_loading', false);
        controller.set('before_search', true);

    },

    actions: {
        searchRecords: function () {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('equipment.search-record'),
                queryExpression = {}, searchPath = "sortBy";
            queryExpression[searchPath] = 'name';

            /*     ***infinite scroll***     */
            app_controller.set('searchResultList', []);
            app_controller.set('isAll', false);
            app_controller.set('perPage', 25);
            app_controller.set('firstIndex', 0);
            app_controller.set('items', []);

            controller.set('is_loading', true);
            self.render('equipment.result-search-record', {
                into: 'application',
                outlet: 'search-result'
            });

            //find input values
            if(controller.statusVal !== ""){
                searchPath = "currentStatus";
                queryExpression[searchPath] = controller.statusVal;
            }

            if(controller.searchPosition !== "" && controller.searchPosition !== null){
                searchPath = "position";
                queryExpression[searchPath] = controller.searchPosition.get('id');
            }

            if(controller.searchCode !== "" && controller.searchCode !== null){
                searchPath = "code";
                queryExpression[searchPath] = controller.searchCode;
            }

            if(controller.searchSupplier !== "" && controller.searchSupplier !== null){
                searchPath = "supplier";
                queryExpression[searchPath] = controller.searchSupplier.get("id");
            }

            if(controller.searchClassification !== "" && controller.searchClassification !== null){
                searchPath = "equipmentClassification";
                queryExpression[searchPath] = controller.searchClassification.get("id");
            }

            if(controller.searchVoyage !== "" && controller.searchVoyage !== null){
                searchPath = "voyages";
                var arrayVoy = []; arrayVoy.pushObject(controller.searchVoyage.get("id"));
                queryExpression[searchPath] = arrayVoy;
            }

            this.store.findQuery('equipment', queryExpression).then(function(queryExpressResults){
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
            var self = this, controller = self.controllerFor('equipment.search-record');

            controller.set("equipment_record", item);
            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        remove_item: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('equipment.search-record');

            controller.equipment_record.deleteRecord();
            controller.equipment_record.save().then(function(){

                controller.set('searchPosition', []);
                controller.set('searchCode', []);
                controller.set('searchClassification', []);
                controller.set('searchSupplier', []);
                controller.set('searchVoyage', []);

                controller.set('searchResultList', []);
                app_controller.autocompleteEquipment.forEach(function(item, index){
                    if( item ) {
                        if( item.get('id') === controller.equipment_record.get('id') ) {
                            app_controller.autocompleteEquipment.removeAt(index);
                        }
                    }
                });

                app_controller.items.forEach(function(item, index){
                    if( item ) {
                        if( item.get('id') === controller.equipment_record.get('id') ) {
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

        transition_to_record: function( path, value ){
            var self = this, controller = self.controllerFor('charge.search-record');

            controller.set('tabListDetails', false);
            controller.set('tabListStates', false);

            //controller.set('equipmentRecord', value);

            this.transitionTo(path, value.id);
        }
    }
});
