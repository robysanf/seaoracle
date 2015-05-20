import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('equipment.main');

        if( !app_controller.autocompleteCompany.get('length') ) {
            self.store.findQuery("company", {sortBy:"name"}).then(function(val){
                app_controller.set("autocompleteCompany", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        if( !app_controller.autocompletePoi.get('length') ) {
            self.store.findQuery("poi", {sortBy:"name"}).then(function(val){
                app_controller.set("autocompletePoi", val);
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
        controller.searchPosition = Ember.A();
        controller.searchClassification = Ember.A();
        controller.searchSupplier = Ember.A();
        controller.searchHolder = Ember.A();

        //imposto la tab details come default per 'company'
        if( controller.tabList.details !== true && controller.tabList.states !== true ) {
            controller.set('tabList.details', true);
            controller.set('isView', true);
            controller.set('itemNewActive', false);
            controller.set('itemEditActive', false);
        }
    },

    model: function( equipment ) {
        return this.store.find('equipment', equipment.equipment_id);
    },

    actions: {
        /**
         Gestione della tab navigation in 'your-profile'; rende attiva la tab selezionata dall'utente

         @action setTabs
         @for your-profile/main-page
         @param {string} tab selezionata dall'utente - (company/driver/truck/trailer/clerk)
         */
        setTabs: function (tabToActive) {
            this.controller.set('tabList.details', false);
            this.controller.set('tabList.states', false);

            this.controller.set('isView', true);
            this.controller.set('itemNewActive', false);
            this.controller.set('itemEditActive', false);

            this.controller.set('tabList.' + tabToActive, true);

        },

        /**
         Gestione del cambio di stato da edit a view. nel caso 'edit --> view' viene fatta una POST del record

         @action change_state
         @for equipment/main.hbs ( partials/-details.hbs )
         @param {boolean} true si passa a 'stato === view'; false si passa a 'stato === edit'
         @param {record} entità di riferimento
         */
        change_state: function( bool, record, type ) {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('equipment.main'),
                count = 1;

            if( bool === true ) {
                controller.set("equipment_record", record);

                if( type === 'state' ){
                    controller.set("isViewState", bool);

                    //forzo una get degli rinas/commissionStates/planners per evitare che vadano persi i riferimenti nell'update
                    record.get('rinas').then(function() {
                        record.get('commissionStates').then(function() {
                            record.get('planners').then(function() {
                                    record.get('equipmentStates').then(function(states) {

                                        states.filter(function(myState){

                                            myState.set('state', myState.get("state"));
                                            myState.save().then(function(){

                                                if(states.get("length") === count){
                                                    record.save().then(function(){
                                                        controller.set('isViewState', bool);
                                                    }, function( reason ){
                                                        app_controller.send( 'error', reason );
                                                    });
                                                }
                                                count = count +1;
                                            });
                                        });
                                    });
                            });
                        });
                    });

                } else {
                    if( record.get('code') ){
                        //controller.set("isView", bool);
                        //forzo una get degli equipmentStates per evitare che vadano persi i riferimenti nell'update
                        record.get('equipmentStates').then(function() {
                            //aggiorno i valori RINA e al termine salvo l'equipment
                            if(record.get('rinas').get('length')){

                                record.get('rinas').then(function(rinas) {
                                    rinas.filter(function(rina){
                                        rina.save().then(function(){
                                            if( rinas.get("length") === count ){
                                                record.save().then(function(val){
                                                    app_controller.autocompleteEquipment.forEach(function(item, index){
                                                        if( item.get('id') === val.get('id') ) {
                                                            app_controller.autocompleteEquipment.removeAt(index);
                                                            app_controller.autocompleteEquipment.pushObject(val);
                                                        }
                                                    });
                                                    controller.set('isView', bool);
                                                }, function( reason ){
                                                    app_controller.send( 'error', reason );
                                                });
                                            }
                                            count = count +1;
                                        });
                                    });
                                });
                            } else {
                                record.save().then(function(){
                                    controller.set('isView', bool);
                                }, function( reason ){
                                    app_controller.send( 'error', reason );
                                });
                            }
                        });
                    } else {
                        new PNotify({
                            title: 'Attention',
                            text: 'Please check to have compiled the code field.',
                            delay: 3000
                        });
                    }

                }
            } else {

                if( type === 'state' ){
                    controller.set('isViewState', bool);
                } else {
                    controller.set('isView', bool);
                }

            }

        },

        add_planner: function( record ){
            var self = this, controller = self.controllerFor('equipment.main');

            if( controller.searchPlanner !== null && controller.searchPlanner !== '' ) {
                record.get('commissionStates').then(function() {
                    record.get('rinas').then(function() {
                        record.get("equipmentStates").then(function(){
                            record.get('planners').then(function(planners){
                                planners.pushObject(controller.searchPlanner);
                                controller.set('searchPlanner', null);
                            });
                        });
                    });
                });
            }
        },

        remove_planner: function( record, planner ){
            record.get('commissionStates').then(function() {
                record.get('rinas').then(function() {
                    record.get("equipmentStates").then(function(){
                        record.get('planners').then(function(planners){
                            planners.removeObject(planner);
                            record.save();
                        });
                    });
                });
            });
        },

        add_rina: function( record ){
            var self = this;

            self.store.createRecord('rina').save().then(function(rina){
                record.get('commissionStates').then(function() {
                    record.get('planners').then(function() {
                        record.get("equipmentStates").then(function(){
                            record.get("rinas").then(function(rinas){
                                rinas.insertAt(0, rina);
                                record.save();
                            });
                        });
                    });
                });
            });
        },

        add_equipmentState: function( record ){
            var self = this;


            self.store.createRecord('equipmentState').save().then(function(state){
                record.get('rinas').then(function() {
//                    controller.equipment_record.get('holder').then(function() {
                    record.get('commissionStates').then(function() {
                        record.get('planners').then(function() {
                            record.get("equipmentStates").then(function(states){
                                states.insertAt(0, state);
                                record.save();
                            });
                        });
                    });
                });
            });

        },

        //********************************************
        //MODAL
        open_modal: function( path, type, record, subRecord ) {
            var self = this, controller = self.controllerFor('equipment.main');

            controller.set('type_to_remove', type);
            controller.set("equipment_record", record);

            if( type === 'rina' ){
                controller.set("equipment_rina", subRecord);
            } else if ( type === 'equipmentState' ){
                controller.set("equipment_equipmentState", subRecord);
            }

            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        remove_item: function(){
            var self = this, controller = self.controllerFor('equipment.main');


            if( controller.type_to_remove === 'rina' ){
                controller.equipment_record.get('commissionStates').then(function() {
                    controller.equipment_record.get('planners').then(function() {
                        controller.equipment_record.get("equipmentStates").then(function(){
                            controller.equipment_record.get('rinas').then(function(rinaList){

                                var indexToRemove = rinaList.indexOf(controller.equipment_rina);
                                rinaList.removeAt(indexToRemove, 1);

                                controller.equipment_record.save().then(function(success){
                                    success.reload();
                                    controller.equipment_rina.deleteRecord();
                                    controller.equipment_rina.save();
                                });
                            });
                        });
                    });
                });
            } else if ( controller.type_to_remove === 'equipmentState' ){

                controller.equipment_record.get('rinas').then(function() {
                        controller.equipment_record.get('commissionStates').then(function() {
                            controller.equipment_record.get('planners').then(function() {
                                controller.equipment_record.get('equipmentStates').then(function(stateList){

                                    var indexToRemove = stateList.indexOf(controller.equipment_equipmentState);
                                    stateList.removeAt(indexToRemove, 1);

                                    controller.equipment_record.save().then(function(success){
                                        success.reload();
                                        controller.equipment_equipmentState.deleteRecord();
                                        controller.equipment_equipmentState.save();
                                    });
                                });
                            });
                    });
                });
            }else {
                controller.equipment_record.deleteRecord();
                controller.equipment_record.save();
            }

        },

        close_item: function(){
            var self = this, app_controller = self.controllerFor('application');

            app_controller.send('close_modal', 'overview', 'application');
            this.send('closeSearch');
        }

    }
});
