import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, app_controller= self.controllerFor('application'), controller = self.controllerFor('booking.search-record');

        //filter on search port of origin and port of destination in the template
//        if( !app_controller.autocompleteCompany.get('length') ) {
//            self.store.findQuery("company").then(function(val){
//                app_controller.set("autocompleteCompany", val);
//            });
//        }

        if( !app_controller.autocompletePoiPort.get('length') ) {
            self.store.findQuery("poi", {tags: "Port"}).then(function(port){
                app_controller.set("autocompletePoiPort", port);
            });
        }

        if( !app_controller.autocompleteVoyage.get('length') ) {
            self.store.findQuery("voyage").then(function(port){
                app_controller.set("autocompleteVoyage", port);
            });
        }

        //reset search variables
//        controller.searchPortOrigin = null;
//        controller.searchPortDestination = null;
//        controller.searchBookRef = null;
//        controller.searchCompany = null;
//        controller.searchShipper = null;
//        controller.searchConsignee = null;
//        controller.searchVoy = null;
//        controller.searchContainerNumber = null;
//        controller.searchChassis = null;
    },

    actions: {
        searchRecords: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('booking.search-record'),
                array_voyage = [], queryExpression = {}, searchPath = "sortBy";

            queryExpression[searchPath] = 'code';
            searchPath = "sortOrder"; queryExpression[searchPath] = 'descendent';

            /*     ***infinite scroll***     */
            app_controller.set('searchResultList', []);
            app_controller.set('isAll', false);
            app_controller.set('perPage', 25);
            app_controller.set('firstIndex', 0);
            app_controller.set('items', []);

            //find input values
            if(controller.searchBookRef !== "" && controller.searchBookRef !== null){
                searchPath = "code"; queryExpression[searchPath] = controller.searchBookRef;
            }

            if(controller.searchCompany !== "" && controller.searchCompany !== null){
                searchPath = "client"; queryExpression[searchPath] = controller.searchCompany;//.get("id");
            }

            if(controller.searchShipper !== "" && controller.searchShipper !== null){
                searchPath = "shipper"; queryExpression[searchPath] = controller.searchShipper.get("id");
            }

            if(controller.searchConsignee !== "" && controller.searchConsignee !== null){
                searchPath = "consignee"; queryExpression[searchPath] = controller.searchConsignee.get("id");
            }

            if(controller.searchPortOrigin !== "" && controller.searchPortOrigin !== null){
                searchPath = "origin"; queryExpression[searchPath] = controller.searchPortOrigin.get("id");
            }

            if(controller.searchPortDestination !== "" && controller.searchPortDestination !== null){
                searchPath = "destination"; queryExpression[searchPath] = controller.searchPortDestination.get("id");
            }

            if(controller.searchVoy !== "" && controller.searchVoy !== null){
                array_voyage.push(controller.searchVoy.get("id"));
                searchPath = "freightPlans"; queryExpression[searchPath] = '{"freightPlan/voyages":' + array_voyage +'}';
            }

            if(controller.searchChassis !== "" && controller.searchChassis !== null){
                searchPath = "items"; queryExpression[searchPath] = '{"bookingItem/chassisNum":"' + controller.searchChassis +'"}';
            }

            if(controller.searchContainerNumber !== "" && controller.searchContainerNumber !== null){
                searchPath = "items"; queryExpression[searchPath] = '{"bookingItem/freightEquipments":' + '{"freightEquipment/equipmentCode":"' + controller.searchContainerNumber +'"}' +'}';
            }

            if(controller.acknowledge_selectedValue !== ''){
                searchPath = "acknowledge"; queryExpression[searchPath] = controller.acknowledge_selectedValue;
            }

            this.store.findQuery('booking', queryExpression).then(function(queryExpressResults){

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

                    self.render('booking.result-search-record', {
                        into: 'application',
                        outlet: 'search-result'
                    });
                }
            });
        },
        //********************************************
        //MODAL
        open_modal: function( path, item ) {
            var self = this, controller = self.controllerFor('booking.search-record');

            controller.set("booking_record", item);
            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        remove_item: function(){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('booking.search-record');

            controller.booking_record.deleteRecord();
            controller.booking_record.save().then(function(){

                controller.searchPortOrigin = null;

                controller.set('searchPortOrigin', []);
                controller.set('searchPortDestination', []);
                controller.set('searchBookRef', null);
                controller.set('searchCompany', []);
                controller.set('searchShipper', []);
                controller.set('searchConsignee', []);
                controller.set('searchVoy', []);
                controller.set('searchContainerNumber', null);
                controller.set('searchChassis', null);
                controller.set('acknowledge_selectedValue', null);
                controller.set('searchResultList', []);

                app_controller.autocompleteBooking.forEach(function(item, index){

                    if( item ) {
                        if( item.get('id') === controller.booking_record.get('id') ) {
                            app_controller.autocompleteBooking.removeAt(index);
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

        link_to: function( path, value ){
            var self = this, controller = self.controllerFor('booking.search-record');

            controller.set('booking_record', value);

            controller.set('tabList_details', false);
            controller.set('tabList_freightPlan', false);
            controller.set('tabList_revenues', false);
            controller.set('tabList_container', false);
            controller.set('tabList_roro', false);
            controller.set('tabList_bb', false);
            controller.set('tabList_itemStatus', false);
            controller.set('tabList_files', false);

            controller.set('subTabList_goods', false);
            controller.set('subTabList_details', false);
            controller.set('subTabList_haulage', false);
            controller.set('subTabList_customs', false);
            controller.set('subTabList_status', false);
            controller.set('subTabList_revenues', false);
            controller.set('subTabList_files', false);

            this.transitionTo( path, value.id );
        }
    }
});
