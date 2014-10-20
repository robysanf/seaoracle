import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application', 'company/main'],
    app_controller: Ember.computed.alias('controllers.application'),
    companyRecord: Ember.computed.alias('controllers.company/main.companyRecord'),
    company_id: Ember.computed.alias('controllers.company/main.company_id'),
    tabListDetails: Ember.computed.alias('controllers.company/main.tabList.details'),
    tabListUsers: Ember.computed.alias('controllers.company/main.tabList.users'),
    tabListFiles: Ember.computed.alias('controllers.company/main.tabList.files'),


    name: null,
    vat: null,
    id: null,
    companyVat: null,
    usersOwned: Ember.A(),
    searchCompany: Ember.A(),
    searchUser: Ember.A(),
    companyId: null,

    before_search: false,
    is_loading: false
});
