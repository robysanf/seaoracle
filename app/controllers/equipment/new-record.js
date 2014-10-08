import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    equipment_record: null,

    /*********************
     * TAB MANAGER
     **/
    tabList: Ember.A(
        {'details': false},
        {'import_template': false}
    ),

    statuses: [
        '',
        "Available in Terminal",
        "Stuffing",
        "Ready to Embark",
        "On Board",
        "Discharged",
        "Laden in Terminal",
        "Delivered to Receiver",
        "Dismissed"
    ],
    newCurrentStatus: null,
    newCurrency: null,
    newVisibility: null,
    newCode: null,
    newDailyCost: null,
    newRinaFromDate: null,
    newRinaToDate: null,
    newAvailable: true,

    searchClassification: Ember.A(),
    searchPosition: Ember.A(),
    searchSupplier: Ember.A(),
    searchHolder: Ember.A(),
    searchPlanner1: Ember.A(),
    searchPlanner2: Ember.A(),
    searchPlanner3: Ember.A(),
    searchPlanner4: Ember.A(),
    plannersList: []
});
