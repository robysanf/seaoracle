import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    poiRecord: null,
    searchCountry: null,
    searchName: Ember.A(),
    searchUnLocode: Ember.A(),

    before_search: false,
    is_loading: false
});
