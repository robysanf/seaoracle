import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    template_record: null,

    searchName: Ember.A(),
    searchCompany: Ember.A(),

    before_search: false,
    is_loading: false
});
