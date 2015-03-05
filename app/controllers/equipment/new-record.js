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
    newName: null,
    newDailyCost: null,
    newRinaFromDate: null,
    newRinaToDate: null,
    newAvailable: true,
    newCurrentStatusDateFrom: null,

    searchClassification: null,
    searchPosition: null,
    searchSupplier: null,
    searchHolder: null,
    searchPlanner1: null,
    searchPlanner2: null,
    searchPlanner3: null,
    searchPlanner4: null,
    plannersList: []
});
