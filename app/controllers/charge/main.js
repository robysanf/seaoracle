import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    charge_record: null,
    item_record: null,

    isView: true,
    itemListActive: false,
    itemEditActive: false,
    itemNewActive: false,

    currencyList: [
        "EUR",
        "USD"
    ],

    /*********************
     * TAB MANAGER
     **/
    tabList: Ember.A(
        {'details': false},
        {'chargeItems_book': false},
        {'chargeItems_cont': false},
        {'chargeItems_roro': false},
        {'chargeItems_bb': false}
    ),

    /*********************
     * -charge-items
     **/

    is_chargeItems_book : function(){
        return ( this.tabList.chargeItems_book === true );
    }.property('tabList.chargeItems_book'),

    is_chargeItems_cont : function(){
        return ( this.tabList.chargeItems_cont === true );
    }.property('tabList.chargeItems_cont'),

    is_chargeItems_roro : function(){
        return ( this.tabList.chargeItems_roro === true );
    }.property('tabList.chargeItems_roro'),

    is_chargeItems_bb : function(){
        return ( this.tabList.chargeItems_bb === true );
    }.property('tabList.chargeItems_bb'),


    ChargesAll: [
        {'value': "All Inclusive", 'code': "All Inclusive"},
        {'value': "Base Freight", 'code': "B.F."},
        {'value': "Bunker Adjustment Factor", 'code': "B.A.F."},       //code from Calogero
        {'value': "War Risk Surcharge", 'code': "W.R.S."},             //code from Calogero
        {'value': "Port Contribution Charge", 'code': "P.C.C."},       //code from Calogero
        {'value': "C.I.C.", 'code': "C.I.C."},
        {'value': "C.O.D.", 'code': "C.O.D."},                          //code from Calogero
        {'value': "B/L fees", 'code': "B/L fees"},
        {'value': "Congestion Surcharge", 'code': "C.S."},
        {'value': "Terminal Handling Charges", 'code': "T.H.C."},   //code from Calogero
        {'value': "I.S.P.S.", 'code': "I.S.P.S."},
        {'value': "Loading Confirmation", 'code': "L.C."},
        {'value': "Insurance", 'code': "I"},
        {'value': "Customs", 'code': "C"},
        {'value': "Customs Extras", 'code': "C.E."},
        {'value': "Correction to Manifest", 'code': "C/M"},
        {'value': "Other", 'code': "O"},
        {'value': "On-wheel Charges", 'code': "O.W.C."},       //code from Calogero
        {'value': "Inland Haulage", 'code': "I.H."},
        {'value': "Inland Haulage Extras", 'code': "I.H.E"},
        {'value': "Gate Charges", 'code': "Gate Charges"}
    ],

    allCharges_list: [
        "Base Freight",
        "Bunker Adjustment Factor",       //B.A.F
        "War Risk Surcharge",             // W.R.S.
        "Port Contribution Charge",       //P.C.C.
        "C.I.C.",
        "Congestion Surcharge",
        "Terminal Handling Charges",    //T.H.C.
        "I.S.P.S.",
        "Loading Confirmation",
        "Customs",
        "Customs Extras",
        "Correction to Manifest",
        "Sea Freight",
        "Other",
        "On-wheel Charges",
        "Inland Haulage",
        "Inland Haulage Extras",
        "Gate Charges"
    ],

    bookingCharges_list: [
        "All Inclusive",
        "C.O.D.",
        "B/L fees",
        "Insurance"
    ],
    per_list: [
        'NUM',
        'QTY',
        'LNG',
        'VOL',
        'WGH'
    ]
});
