import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    searchName : null,
    searchOrigin : null,
    searchDestination: null,

    segmentRecord: null,

    before_search: false,
    is_loading: false
});
