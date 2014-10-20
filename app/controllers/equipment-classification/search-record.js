import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    searchName : Ember.A(),
    searchSizeCode : Ember.A(),
    searchTypeCode : Ember.A(),
    searchIsoCode : Ember.A(),

    eqClassification_record: null,

    before_search: false,
    is_loading: false

});
