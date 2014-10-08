import Ember from 'ember';

export default Ember.Route.extend({
    model: function( poi ) {
        return this.store.find('poi', poi.poi_id);
    },
    actions: {
        change_state: function( bool, record ) {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('warehouse.main'),
                removeClss = $('span#1.input-group-addon').removeClass('alert-danger'),
                addClass = $('span#1.input-group-addon').addClass('alert-danger');
            controller.set("poiRecord", record);

            if( bool === true ) {
                self.unique = record.get('name') !== "";

                if (self.unique) {
                    self.store.find('company', app_controller.company).then(function(company){
                        record.set('company', company).save().then(function(record) {

                            //SUCCESS
                            new PNotify({
                                title: 'Saved',
                                text: 'You successfully saved record.',
                                type: 'success',
                                delay: 1000
                            });

                            app_controller.autocompletePoiWarehouse.forEach(function(item, index){
                                if( item.get('id') === record.get('id') ) {
                                    app_controller.autocompletePoiWarehouse.removeAt(index);
                                    app_controller.autocompletePoiWarehouse.pushObject(record);
                                }
                            });

                            app_controller.autocompletePoi.forEach(function(item, index){
                                if( item.get('id') === record.get('id') ) {
                                    app_controller.autocompletePoi.removeAt(index);
                                    app_controller.autocompletePoi.pushObject(record);
                                }
                            });
                        }, function() {
                            //NOT SAVED
                            new PNotify({
                                title: 'Not saved',
                                text: 'A problem has occurred.',
                                type: 'error',
                                delay: 2000
                            });
                        });
                    });
                }else {
                    //WARNING
                    (self.unique ?  removeClss : addClass);

                    new PNotify({
                        title: 'Attention',
                        text: 'please check if required fields have been entered.',
                        type: 'error',
                        delay: 2000
                    });
                }
            }
            this.controller.set('isView', bool);
        }
    }
});
