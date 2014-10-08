import Ember from 'ember';

export default Ember.Route.extend({
    model: function( equipmentClassification ) {
        return this.store.find('equipmentClassification', equipmentClassification.equipmentClassification_id);
    },

    actions: {
        change_state: function( bool, record ){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('equipment-classification.main');

            if ( bool === true ){
                controller.set( 'eqClassification_record', record );

                record.set('name', record.get('equipmentType')+'/'+record.get('isoCode')+'/'+record.get('sizeCode')+record.get('typeCode'));
                record.save().then(function(){

                    //SUCCESS
                    new PNotify({
                        title: 'Saved',
                        text: 'You successfully saved charge.',
                        type: 'success',
                        delay: 1000
                    });

                    app_controller.autocompleteEqClassification.forEach(function(item, index){
                        if( item.get('id') === record.get('id') ) {
                            app_controller.autocompleteEqClassification.removeAt(index);
                            app_controller.autocompleteEqClassification.pushObject(record);
                        }
                    });
                    app_controller.autocompleteEqClassificationContainer.forEach(function(item, index){
                        if( item.get('id') === record.get('id') ) {
                            app_controller.autocompleteEqClassificationContainer.removeAt(index);
                            app_controller.autocompleteEqClassificationContainer.pushObject(record);
                        }
                    });
                    controller.set( 'isView', bool );

                }, function(){
                    //NOT SAVED
                    new PNotify({
                        title: 'Not saved',
                        text: 'A problem has occurred.',
                        type: 'error',
                        delay: 2000
                    });
                });
            } else {
                controller.set( 'isView', bool );
            }
        }
    }

});
