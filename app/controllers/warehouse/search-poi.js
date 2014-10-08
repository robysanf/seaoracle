import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    searchName : Ember.A(),
    searchCompany : Ember.A(),
    searchCountry: null,
    searchCity: null,

    poiRecord: null

});
