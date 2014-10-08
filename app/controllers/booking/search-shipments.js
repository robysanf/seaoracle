import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    itemTypeList: [
        '',
        'Container',
        'RoRo',
        'Break Bulks'
    ],

    itemType: null,
    keyWords: null,

    searchBook: null,
    searchEquipmentCode: null,
    searchChassisNum: null,

    shipmentList: null,
    searchResults: function() { return this.shipmentList; }.property('shipmentList'),

    research_is_active: false,
    isActive: true,
    isContainer: function() {
        return (this.itemType === 'Container');
    }.property('itemType'),

    isRoRo: function() {
        return (this.itemType === 'RoRo');
    }.property('itemType')
});
