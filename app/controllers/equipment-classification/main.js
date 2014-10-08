import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    isView: true,
    eqClassification_record: null,

    isoCodeClassification: [
        '',
        'dry_freight_box',
        'flat_rack',
        'open_top'
    ]
});
