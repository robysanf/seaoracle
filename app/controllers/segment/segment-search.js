import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    searchName : Ember.A(),
    searchOrigin : Ember.A(),
    searchDestination: Ember.A(),

    segmentRecord: null,

    before_search: false,
    is_loading: false
});
