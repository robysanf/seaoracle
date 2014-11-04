import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    app_controller_token: Ember.computed.alias('controllers.application.token'),
    app_controller_companyType: Ember.computed.alias('controllers.application.companyType'),

    is_admin: function(){
        return ( this.get('app_controller_companyType') === 'admin' );
    }.property('app_controller_companyType'),
    is_client : function(){
        return ( this.get('app_controller_companyType') === 'client' );
    }.property('app_controller_companyType'),
    is_agency : function(){
        return ( this.get('app_controller_companyType') === 'agency' );
    }.property('app_controller_companyType'),
    is_shipowner : function(){
        return ( this.get('app_controller_companyType') === 'shipowner' );
    }.property('app_controller_companyType'),


    before_search: false,
    is_loading: false,

    isView: false,
    item_ToRemove: null,
    bookId: null,
    docType: null,
    bookRecord: null,
    itemId: null,
    itemTu: null,
    item: null,
    codeBooking: null,
    bookingCodeId: null,
    bookingId: null,

    booking_record: null,
    item_record: null,
    file_record: null,
    remove_use_case: null,

    /*********************
     * TAB MANAGER
     **/
    tabList: Ember.A(
        {'details': false},
        {'freightPlan': false},
        {'revenues': false},
        {'container': false},
        {'roro': false},
        {'bb': false},
        {'itemStatus': false},
        {'files': false}
    ),

    /*********************
     * DETAILS tab
     **/

    subTabLists: Ember.A(
        {'goods': false},
        {'details': false},
        {'haulage': false},
        {'customs': false},
        {'status': false},
        {'revenues': false},
        {'files': false}
    ),

    revenuesTabList: Ember.A(
        {'general': true},
        {'bookingCharges': false},
        {'containerCharges': false},
        {'roroCharges': false},
        {'bbCharges': false},
        {'itemCharges': false}
    ),

    revenuesTable: Ember.A(
        {'revenues': true},
        {'costs': false}
    ),


//  ******************
//  *** DETAILS tab

    //instantiated on the Template
    searchPortOrigin: Ember.A(),
    searchPortDestination: Ember.A(),
    searchCompany: Ember.A(),
    searchCompanyToShare: null,

//  ******************
//   *** GOODS

//   *** EDITING - CONTAINER tab
    itemListActive: false,                              /* false: mostro a layout l'ITEM LIST       true: mostro a layout il NEW ITEM  */

    //instantiated on the Template
    newContainerItemActive: false,
    searchTypeEquipment: Ember.A(),
    searchEquipmentCode: Ember.A(),

    goodsClassification: [
        "Raw Materials, Chemicals, Paper, Fuel",
        "Industrial Equipment & Tools",
        "Components & Supplies",
        "Construction, Transportation & Facility Equipment & Supplies",
        "Medical, Laboratory & Test Equipment & Supplies & Pharmaceuticals",
        "Food, Cleaning & Service Industry Equipment & Supplies",
        "Business, Communication & Technology Equipment & Supplies",
        "Defense, Security & Safety Equipment & Supplies",
        "Personal, Domestic & Consumer Equipment & Supplies",
        "Services"
    ],
    //classification: "Raw Materials, Chemicals, Paper, Fuel",

//  *** LOCKED - CONTAINER tab
    searchBookingCode: Ember.A(),

//  *** HAULAGE tab
    addCarrier: false,
    haulageId: null,
    haulage_record: null,

    city: null,
    province: null,
    country: null,
    note: null,
    isCheck: null,
    formattedTime: null,
    formattedDate: null,

//  *** CUSTOMS

    searchCustomLocation: Ember.A(),
    searchCustomBroker: Ember.A(),
    searchCustomAgent: Ember.A(),


//  *** STATUSES
    statuses_roro_bb: [
        "Available in Terminal",
        "Ready to Embark",
        "On Board",
        "Discharged",
        "Delivered to Receiver"
    ],

    statusesCode_roro_bb: [
        100,
        300,
        400,
        500,
        700
    ],

    statuses: [
        "Available in Terminal",
        "Stuffing",
        "Ready to Embark",
        "On Board",
        "Discharged",
        "Laden in Terminal",
        "Delivered to Receiver"
    ],
    statusesCode: [
        100,
        200,
        300,
        400,
        500,
        600,
        700
    ],

    //  *** RO-RO
    itemListRoRoActive: false,
    totMtl: null,
    totWeight: null,
    roroClassification: [
        "Road tractor",
        "Truck",
        "Semi trailer",
        "TIR",
        "Car",
        "Excavator",
        "Daily",
        "Mixer truck",
        "Tank truck",
        "Empty box truck",
        "Full box truck",
        "Backhoe loader",
        "Wheeled loader",
        "Tracked loader",
        "Excavator",
        "Crawler",
        "Mobile batching plant",
        "Motorbike",
        "Bus",
        "Mafi",
        "Silobus",
        "Dumper",
        "Van",
        "Ambulance",
        "Other"
    ],

    searchRoRoCode: Ember.A(),

//  *** BB
    replicaNumber: 1,
    packClassification: [
        "Box",
        "Carton box",
        "Pallet",
        "Case",
        "Crate",
        "Drum",
        "Loose",
        "Project cargo"
    ],

//  *** REVENUES
    chargeItemId: null,
    searchCharge: Ember.A(),
    searchApplyCharge: Ember.A(),
    newCharge: null,
    searchChargeBillTo: Ember.A(),

    haulage_to_send: null,
    user_email: null,
    send_email_type: null,
    currencyClassification: [
        '',
        'EUR',
        'USD'
    ],

    per_list: [
        'NUM',
        'QTY',
        'LNG',
        'VOL',
        'WGH'
    ],

    ChargesAll: [
        {'value': "All Inclusive", 'code': "All Inclusive"},
        {'value': "Base Freight", 'code': "B.F."},
        {'value': "Bunker Adjustment Factor", 'code': "B.A.F."},       //code from Calogero
        {'value': "War Risk Surcharge", 'code': "W.R.S."},             //code from Calogero
        {'value': "Port Contribution Charge", 'code': "P.C.C."},       //code from Calogero
        {'value': "C.I.C.", 'code': "C.I.C."},                         //code from Calogero
        {'value': "C.O.D.", 'code': "C.O.D."},
        {'value': "B/L fees", 'code': "B/L fees"},
        {'value': "Congestion Surcharge", 'code': "C.S."},
        {'value': "I.S.P.S.", 'code': "I.S.P.S."},
        {'value': "Terminal Handling Charges", 'code': "T.H.C."},   //code from Calogero
        {'value': "Loading Confirmation", 'code': "L.C."},
        {'value': "Insurance", 'code': "I"},
        {'value': "Customs", 'code': "C"},
        {'value': "Customs Extras", 'code': "C.E."},
        {'value': "Correction to Manifest", 'code': "C/M"},
        {'value': "Other", 'code': "O"},
        {'value': "On-wheel Charges", 'code': "O.W.C."},       //code from Calogero
        {'value': "Inland Haulage", 'code': "I.H."},
        {'value': "Sea Freight", 'code': "S.F."},
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

    charge_item_record: null,

    bookingCharges_list: [
        "All Inclusive",
        "C.O.D.",
        "B/L fees",
        "Insurance"
    ],

    bookingCharges_list_shipowner: [
        "C.O.D.",
        "B/L fees",
        "Insurance"
    ],

    codeBL: null,

    changeRate: 1,


//  *** FREIGHT PLAN tab
    listOfOrigin: [],
    listOfDestination: [],
    newFreightPlan: null,
    listOfLeg_toView: [{
        origin: true,
        destination: true
    }],
    listOfVoys: [],

    originList: function(){ return Ember.A([]) }.property(),
    destinationList: function(){ return Ember.A([]) }.property(),

    freightPlan_mode: Ember.A(
        {'search': true},
        {'manual': false},
        {'no_freight_plan': false}
    ),

    weeksOut: 3,
    listWeeksOut: [
        1,
        2,
        3,
        4,
        5,
        6
    ],
    listTranshipmentNumber: [
        0,
        1,
        2,
        'All'
    ],
//    temp_listOfElements: [],
//    listOfElements: [],  //poi, poiId, leg, indexOfPoi
//
    temporary_index_list: [],
    sorted_list: [],

    selectedVoy: null,
    //dtdRange: '15',
    //dtaRange: '15',
    transhipmentNum: 0,

    searchOtherPort: Ember.A(),
    searchVoy: [],

    research_is_active: false,
    //temp_freightPlanList: [],
    freightPlanList: Ember.A(),

    searchResults: function() { return this.freightPlanList; }.property('freightPlanList'),

    //ITEM-CONTROLLER
    freightPlanItemsList: function(){
        return Ember.A([])
    }.property(),

    delayItemsList: function(){
        return Ember.A([])
    }.property(),

    loadedOnItemsList: function(){
        return Ember.A([])
    }.property(),

    firstVoyage_record: null,
    //toggles: function(){ return Ember.A([]) }.property(),
    myToggles: function(){ return Ember.A([]) }.property(),

    checkedItems: Ember.computed.filterBy('@this', 'isChecked', true),

    actions: {
        registerToggle: function(toggle){
            this.get('toggles').addObject(toggle);
        },
        deregisterToggle: function(toggle){
            this.get('toggles').removeObject(toggle);
        },
        registerMyToggle: function(toggle){
            this.get('myToggles').addObject(toggle);
        },
        deregisterMyToggle: function(toggle){
            this.get('myToggles').removeObject(toggle);
        },

        managerCheckLists: function(val, type, bool) {
            if(bool) {
                switch(type) {
                    case 'delay':
                        this.get('delayItemsList').addObject(val);
                        break;
                    case 'mtl':
                        this.get('loadedOnItemsList').addObject(val);
                        break;
                    case 'freight-plan':
                        this.get('freightPlanItemsList').addObject(val);
                        break;
//                    case 'legOrigin':
//                        this.get('originList').addObject(val);
//                        break;
//                    case 'legDestination':
//                        this.get('destinationList').addObject(val);
//                        break;
                }
            } else {
                switch(type) {
                    case 'delay':
                        this.get('delayItemsList').removeObject(val);
                        break;
                    case 'mtl':
                        this.get('loadedOnItemsList').removeObject(val);
                        break;
                    case 'freight-plan':
                        this.get('freightPlanList').removeObject(val);
                        break;
//                    case 'legOrigin':
//                        this.get('originList').removeObject(val);
//                        break;
//                    case 'legDestination':
//                        this.get('destinationList').removeObject(val);
//                        break;
                }
            }

        }
    }


});

//
//App.LegOriginListController = Ember.ObjectController.extend({
//    isChecked: false,
//    registerOnParent: function(){
//        this.send('managerCheckLists', this, "legOrigin", true);
//    }.on('init'),
//    willDestroy: function(){
//        this.send('managerCheckLists', this, "legOrigin", false);
//    }
//});
//App.LegDestinationListController = Ember.ObjectController.extend({
//    isChecked: false,
//    registerOnParent: function(){
//        this.send('managerCheckLists', this, "legDestination", true);
//    }.on('init'),
//    willDestroy: function(){
//        this.send('managerCheckLists', this, "legDestination", false);
//    }
//});
//App.FreightPlanTranshipmentController = Ember.ObjectController.extend({
//    isFromChecked: false,
//    isToChecked: false,
//    registerOnParent: function(){
//        this.send('registerMyToggle', this);
//    }.on('init'),
//    willDestroy: function(){
//        this.send('deregisterMyToggle', this);
//    }
//});
