import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(val) {
        var self = this, app_controller =self.controllerFor('application'), controller = self.controllerFor('booking.search-shipments');

        if( !app_controller.autocompleteChassisNum.get('length') ){
            self.store.findQuery('bookingItem').then(function(val){
                controller.set('autocompleteChassisNum', val);
            });
        }

        controller.set('searchBook', []);
        controller.set('searchEquipmentCode', []);
        controller.set('searchChassisNum', []);
    },
    actions: {
        bookState: function(val) {
            var self = this, controller = self.controllerFor('booking.search-shipments');

                controller.set('isActive', val);
        },
        searchRecords: function() {
            var self = this, controller = self.controllerFor('booking.search-shipments'), app_controller =self.controllerFor('application'),
                queryExpression = {}, searchPath = "sortBy";

            queryExpression[searchPath] = 'code';
            controller.set('research_is_active', true);
            controller.set("shipmentList", null);
//            /*     ***infinite scroll***     */
//            app_controller.set('searchResultList', []);
//            app_controller.set('isAll', false);
//            app_controller.set('perPage', 25);
//            app_controller.set('firstIndex', 0);
//            app_controller.set('items', []);


            //recupero l'id del booking scelto
            if(controller.searchBook != "" && controller.searchBook != " " && controller.searchBook != null ){
                searchPath = "booking"; queryExpression[searchPath] = '{"booking/code":"'+controller.searchBook+'"}}';
            }

            //recupero identifier del container
            if(controller.searchEquipmentCode != "" && controller.searchEquipmentCode != " " && controller.searchEquipmentCode != null ){
                searchPath = "freightEquipments"; queryExpression[searchPath] = '{"freightEquipment/equipmentCode":' +'{"eq":"'+controller.searchEquipmentCode.get('equipmentCode') +'"}}';
            }

            //recupero chassis number del roro
            if( controller.searchChassisNum != "" && controller.searchChassisNum != " " && controller.searchChassisNum != null ){
                searchPath = "chassisNum"; queryExpression[searchPath] = controller.searchChassisNum.get('chassisNum');
            }

            //recupero description
            if(controller.keyWords != "" && controller.keyWords != " " && controller.keyWords != null ){
                searchPath = "description"; queryExpression[searchPath] = controller.keyWords;
            }
            if( controller.isActive ){
                searchPath = 'booking{"booking/state":{"or":'; queryExpression[searchPath] = '["edit", "lock", "request", "pending"]}}';
            } else {
                searchPath = 'booking{"booking/state":'; queryExpression[searchPath] = '"register"}';
            }


            //recupero il tipo
            if(controller.itemType) {
                switch(controller.itemType) {
                    case 'RoRo':
                        searchPath = "tu";
                        queryExpression[searchPath] = 'roro';
                        break;
                    case 'Container':
                        searchPath = "tu";
                        queryExpression[searchPath] = 'container';
                        break;
                    case 'Break Bulks':
                        searchPath = "tu";
                        queryExpression[searchPath] = 'bb';
                        break;
                }
            }


            this.store.findQuery('bookingItem', queryExpression).then(function(val){
                controller.set("shipmentList", val);
                //controller.set('research_is_active', false);
            });

//            this.store.findQuery('bookingItem', queryExpression).then(function(queryExpressResults){
//
//                /*     ***infinite scroll***     */
//                app_controller.set("queryExpressResults_length", queryExpressResults.get('length'));
//                app_controller.set("queryExpressResults", queryExpressResults);
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
//
////                    self.render('booking.result-search-record', {
////                        into: 'application',
////                        outlet: 'search-result'
////                    });
//                }
//            });
        }

    }
});
