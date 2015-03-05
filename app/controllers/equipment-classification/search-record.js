import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    searchName : null,
    searchSizeCode : null,
    searchTypeCode : null,
    searchIsoCode : null,

    eqClassification_record: null,

    before_search: false,
    is_loading: false

});
