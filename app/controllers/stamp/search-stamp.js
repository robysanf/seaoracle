import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    record_stamp: null,
    searchValue: Ember.A(),
    searchName: Ember.A(),
    searchType: Ember.A()
});
