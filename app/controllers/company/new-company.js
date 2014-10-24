import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    searchStamp: null,
    searchReferringPort: null,

    unique: null,
    newCompany: null,

    newName: null,
    newVatNumber: null,
    newStreet: null,
    newCity: null,
    newPostCode: null,
    newProvince: null,
    newCountry: null,
    newEmail1: null,
    newEmail2: null,
    newEmail3: null,
    newEmail4: null,
    newPhone: null,
    newFax: null
});
