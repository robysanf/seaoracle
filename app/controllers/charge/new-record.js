import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    newName: null,
    searchSegment: Ember.A(),
    newCurrency: null,
    newAvailable: true,

    currencyList: [
        "EUR",
        "USD"
    ]
});
