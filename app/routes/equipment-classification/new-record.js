import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var self = this, app_controller = self.controllerFor('application');

        //reset del campo di ricerca in caso di reload della pagina
        var queryExpression = {}, searchPath = "equipmentType";
        queryExpression[searchPath] = 'container';
        searchPath = "available";
        queryExpression[searchPath] = true;


        if( !app_controller.autocompleteEqClassification.get('length') ) {
            self.store.findQuery("equipmentClassification", queryExpression).then(function(val){
                app_controller.set("autocompleteEqClassification", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }
    },

    actions: {
        create_record: function( _btn ) {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('equipment-classification.new-record');

            this.unique = controller.newSizeCode !== null && controller.newSizeCode.length >= 1 &&
                controller.newEquipmentType !== null && controller.newEquipmentType.length >= 1 &&
                controller.newTypeCode !== null && controller.newTypeCode.length >= 1 &&
                controller.newIsoCode !== null && controller.newIsoCode.length >= 1;


            //verifico che i campi obbligatori siano stati compilati
            (controller.newSizeCode != null && controller.newSizeCode.length >= 1 ? $('span#2.input-group-addon').removeClass('alert-danger') : $('span#2.input-group-addon').addClass('alert-danger'));
            (controller.newEquipmentType != null && controller.newEquipmentType.length >= 1 ? $('span#3.input-group-addon').removeClass('alert-danger') : $('span#3.input-group-addon').addClass('alert-danger'));
            (controller.newTypeCode != null && controller.newTypeCode.length >= 1 ? $('span#4.input-group-addon').removeClass('alert-danger') : $('span#4.input-group-addon').addClass('alert-danger'));
            (controller.newIsoCode != null && controller.newIsoCode.length >= 1 ? $('span#5.input-group-addon').removeClass('alert-danger') : $('span#5.input-group-addon').addClass('alert-danger'));

            if ( this.unique ) {
                var newEquipmentClassification = this.store.createRecord('equipmentClassification', {
                    equipmentType: controller.newEquipmentType,
                    name: controller.newEquipmentType+'/'+controller.newIsoCode+'/'+controller.newSizeCode+controller.newTypeCode,
                    sizeCode: controller.newSizeCode,
                    typeCode: controller.newTypeCode,
                    isoCode: controller.newIsoCode,
                    lengthMin: controller.newLengthMin,
                    lengthMax: controller.newLengthMax,
                    widthMin: controller.newWidthMin,
                    widthMax: controller.newWidthMax,
                    heightMin: controller.newHeightMin,
                    heightMax: controller.newHeightMax,
                    doorWidthMin: controller.newDoorWidthMin,
                    doorWidthMax: controller.newDoorWidthMax,
                    doorHeightMin: controller.newDoorHeightMin,
                    doorHeightMax: controller.newDoorHeightMax,
                    capacityMin: controller.newCapacityMin,
                    capacityMax: controller.newCapacityMax,
                    maxPayLoadMin: controller.newMaxPayLoadMin,
                    maxPayLoadMax: controller.newMaxPayLoadMax,
                    tareWeightMin: controller.newTareWeightMin,
                    tareWeightMax: controller.newTareWeightMax,
                    maxGrossWeightMin: controller.newMaxGrossWeightMin,
                    maxGrossWeightMax: controller.newMaxGrossWeightMax,
                    declaredTare: controller.newDeclaredTare,
                    declaredVolume: controller.newDeclaredVolume,
                    teu: controller.newTeu,
                    visibility: 'public'
                });

                self.store.find('company', app_controller.company).then(function(company){

                    newEquipmentClassification.set('company', company);
                    newEquipmentClassification.save().then(function(eqId){
                        app_controller.autocompleteEqClassification.pushObject(eqId);
                        app_controller.autocompleteEqClassificationContainer.pushObject(eqId);

                        controller.set('newName', null);
                        controller.set('newEquipmentType', null);
                        controller.set('newSizeCode', null);
                        controller.set('newTypeCode', null);
                        controller.set('newIsoCode', null);
                        controller.set('newLengthMin', null);
                        controller.set('newLengthMax', null);
                        controller.set('newWidthMin', null);
                        controller.set('newWidthMax', null);
                        controller.set('newHeightMin', null);
                        controller.set('newHeightMax', null);
                        controller.set('newDoorWidthMin', null);
                        controller.set('newDoorWidthMax', null);
                        controller.set('newDoorHeightMin', null);
                        controller.set('newDoorHeightMax', null);
                        controller.set('newCapacityMin', null);
                        controller.set('newCapacityMax', null);
                        controller.set('newMaxPayLoadMin', null);
                        controller.set('newMaxPayLoadMax', null);
                        controller.set('newTareWeightMin', null);
                        controller.set('newTareWeightMax', null);
                        controller.set('newMaxGrossWeightMin', null);
                        controller.set('newMaxGrossWeightMax', null);
                        controller.set('newDeclaredTare', null);
                        controller.set('newDeclaredVolume', null);
                        controller.set('newTeu', null);

                        _btn.stop();
                        //SAVED
                        new PNotify({
                            title: 'Saved',
                            text: 'You successfully saved record.',
                            type: 'success',
                            delay: 1000
                        });

                    }, function() {
                        _btn.stop();
                        //NOT SAVED
                        new PNotify({
                            title: 'Not saved',
                            text: 'A problem has occurred.',
                            type: 'error',
                            delay: 2000
                        });
                    });
                });
            }
            else {
                _btn.stop();
                //WARNING
                new PNotify({
                    title: 'Attention',
                    text: 'please check if required fields have been entered.',
                    type: 'error',
                    delay: 2000
                });
            }
        }
    }
});
