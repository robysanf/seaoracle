import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application', 'charge/main'],
    app_controller: Ember.computed.alias('controllers.application'),

    tabListDetails: Ember.computed.alias('controllers.charge/main.tabList.details'),
    tabListChargeItems_book: Ember.computed.alias('controllers.charge/main.tabList.chargeItems_book'),
    tabListChargeItems_cont: Ember.computed.alias('controllers.charge/main.tabList.chargeItems_cont'),
    tabListChargeItems_roro: Ember.computed.alias('controllers.charge/main.tabList.chargeItems_roro'),
    tabListChargeItems_bb: Ember.computed.alias('controllers.charge/main.tabList.chargeItems_bb'),
    chargeRecord: Ember.computed.alias('controllers.charge/main.charge_record'),

    charge_record: null,
    searchCompany: Ember.A(),
    searchCharge: Ember.A(),

    before_search: false,
    is_loading: false
});
