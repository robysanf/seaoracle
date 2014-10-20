import Ember from 'ember';

export default Ember.Controller.extend({
    needs: [ 'application', 'voyage/main' ],
    app_controller: Ember.computed.alias('controllers.application'),

    tabListPath: Ember.computed.alias('controllers.voyage/main.tabList.path'),
    tabListDetails: Ember.computed.alias('controllers.voyage/main.tabList.details'),

    voyage_record: null,

    searchName: Ember.A(),
    searchCompany: Ember.A(),

    before_search: false,
    is_loading: false
});
