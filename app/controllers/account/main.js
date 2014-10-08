import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),
    app_controller_companyType: Ember.computed.alias('controllers.application.companyType'),
    //app_controller_autocompletePaymentPlan: Ember.computed.alias('controllers.application.autocompletePaymentPlan'),

    is_admin: function(){
        return ( this.get('app_controller_companyType') === 'admin' );
    }.property('app_controller_companyType'),

//    //  *** define tab order
    cardNumber1: null,
    cardNumber2: null,
    cardNumber3: null,
    cardNumber4: null,

    planCredit: null,
    planCurrency: null,
    listCurrency: [
        '',
        'eur',
        'usd'
    ],
    planAmount: null,
    planDescription: null,
    planName: null,

    cvc: null,
    mm: null,
    yyyy: null,

    tabList: Ember.A(
        {'account': false},
        {'buyCredits': false},
        {'orderHistory': false}
    )
});
