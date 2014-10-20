import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application', 'equipment/main'],
    app_controller: Ember.computed.alias('controllers.application'),

    tabListDetails: Ember.computed.alias('controllers.equipment/main.tabList.details'),
    tabListStates: Ember.computed.alias('controllers.equipment/main.tabList.states'),

    equipment_record: null,

    searchCode: Ember.A(),
    searchClassification: Ember.A(),
    searchSupplier: Ember.A(),
    searchPosition: Ember.A(),
    searchVoyage: Ember.A(),
    statusVal: '',

    statuses: [
        "",
        "Available in Terminal",
        "Stuffing",
        "Ready to Embark",
        "On Board",
        "Discharged",
        "Laden in Terminal",
        "Delivered to Receiver"
    ],

    before_search: false,
    is_loading: false
});
