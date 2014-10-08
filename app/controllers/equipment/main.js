import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    equipment_record: null,
    equipment_rina: null,
    equipment_equipmentState: null,

    isView: true,
    isViewState: true,
    itemListActive: false,
    itemEditActive: false,
    itemNewActive: false,

    /*********************
     * TAB MANAGER
     **/
    tabList: Ember.A(
        {'details': false},
        {'states': false}
    ),

    states: ["Available", "To be checked", "Damaged", "Authorized"],
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

    /***********************
     * TAB details
     */
    searchPosition: Ember.A(),
    searchClassification: Ember.A(),
    searchSupplier: Ember.A(),
    searchHolder: Ember.A(),
    searchPlanner: null,

    type_to_remove: null




});
