import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    isoCodeClassification: [
        '',
        'dry_freight_box',
        'flat_rack',
        'open_top'
    ],

    newVisibility: null,
    newSizeCode: null,
    newTypeCode: null,
    newIsoCode: null,
    newLengthMin: null,
    newLengthMax: null,
    newWidthMin: null,
    newWidthMax: null,
    newHeightMin: null,
    newHeightMax: null,
    newDoorWidthMin: null,
    newDoorWidthMax: null,
    newDoorHeightMin: null,
    newDoorHeightMax: null,
    newCapacityMin: null,
    newCapacityMax: null,
    newMaxPayLoadMin: null,
    newMaxPayLoadMax: null,
    newTareWeightMin: null,
    newTareWeightMax: null,
    newMaxGrossWeightMin: null,
    newMaxGrossWeightMax: null,
    newDeclaredTare: null,
    newDeclaredVolume: null,
    newTeu: null
});
