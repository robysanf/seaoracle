import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    isView: true,
    poiRecord: null,
    depotRecord: null,

    /*********************
     * TAB MANAGER
     **/
    tabList: Ember.A(
        {'details': false},
        {'depots': false}
    ),

    /*********************
     * TAB DEPOTS
     **/
    itemListActive: false,
    itemEditActive: false,

    newName: null,
    newStreet: null,
    newProvince: null,
    newZipCode: null,
    newCity: null,
    newCountry: null,
    newPhone: null,
    newNotifyParty: null
});
