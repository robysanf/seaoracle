import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(val) {
        var self = this, app_controller =self.controllerFor('application'), controller = self.controllerFor('booking.search-shipments');

        if( !app_controller.autocompleteChassisNum.get('length') ){
            self.store.findQuery('bookingItem').then(function(val){
                controller.set('autocompleteChassisNum', val);
            });
        }

        controller.set('is_loading', false);
        controller.set('before_search', true);
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
                queryExpression = {};//, searchPath = "sortBy";

            //queryExpression[searchPath] = 'code';
            queryExpression = 'sortBy="code"';
            controller.set('is_loading', true);
            controller.set("shipmentList", null);

            //recupero l'id del booking scelto
            if(controller.searchBook != "" && controller.searchBook != " " && controller.searchBook != null ){
               // searchPath = "booking"; queryExpression[searchPath] = '{"booking/code":"'+controller.searchBook+'"}';
                queryExpression = queryExpression+'&booking={"booking/code":"'+controller.searchBook+'"}';
            }

            //recupero identifier del container
            if(controller.searchEquipmentCode != "" && controller.searchEquipmentCode != " " && controller.searchEquipmentCode != null ){
                //searchPath = "freightEquipments"; queryExpression[searchPath] = '{"freightEquipment/equipmentCode":' +'{"eq":"'+controller.searchEquipmentCode.get('equipmentCode') +'"}}';
                queryExpression = queryExpression+'&freightEquipments={"freightEquipment/equipmentCode":' +'{"eq":"'+controller.searchEquipmentCode.get('equipmentCode') +'"}}';
            }

            //recupero chassis number del roro
            if( controller.searchChassisNum != "" && controller.searchChassisNum != " " && controller.searchChassisNum != null ){
                //searchPath = "chassisNum"; queryExpression[searchPath] = controller.searchChassisNum.get('chassisNum');
                queryExpression = queryExpression+'&chassisNum=' + controller.searchChassisNum.get('chassisNum');
            }

            //recupero description
            if(controller.keyWords != "" && controller.keyWords != " " && controller.keyWords != null ){
                //searchPath = "description"; queryExpression[searchPath] = controller.keyWords;
                queryExpression = queryExpression+'&description=' + controller.keyWords;
            }
            if( controller.isActive ){
                //searchPath = 'booking='; queryExpression[searchPath] = '{"booking/state":{"or":["edit","lock","request","pending"]}}';
                queryExpression = queryExpression+'&booking={"booking/state":{"or":["edit","lock","request","pending"]}}';
            } else {
                //searchPath = 'booking='; queryExpression[searchPath]='{"booking/state":"register"}';
                queryExpression = queryExpression+'&booking={"booking/state":"register"}';
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


            this.store.findQuery( 'bookingItem', queryExpression ).then(function(val){
                controller.set("shipmentList", val);
                controller.set('is_loading', false);
                controller.set('before_search', false);
            });
        }

    }
});
