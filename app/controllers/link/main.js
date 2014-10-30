import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    companyRecord: Ember.computed.alias('controllers.company/main.companyRecord'),
    company_id: Ember.computed.alias('controllers.company/main.company_id'),
    tabListDetails: Ember.computed.alias('controllers.company/main.tabList.details'),
    tabListUsers: Ember.computed.alias('controllers.company/main.tabList.users'),
    tabListFiles: Ember.computed.alias('controllers.company/main.tabList.files'),

    searchCompany: null,
    company_record: null
});
