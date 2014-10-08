import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    authorizedCompanies: DS.hasMany('company',{ async: true}),
    booking: DS.belongsTo("booking"),
    bookingItem: DS.belongsTo("booking-item"),
    billTo: DS.belongsTo("company"),
    charge: DS.belongsTo("charge"),
    code: DS.attr("string"),
    cost: DS.attr("number"),
    costCurrency: DS.attr("string"),
    entityType: DS.attr("string"),      //booking/item
    multiplier: DS.attr("string"),      //QTY/LNG/VOL/NUM/WGH
    name: DS.attr("string"),
    num: DS.attr("number"),
    originalRevenue: DS.attr("number"),
    originalRevenueCurrency: DS.attr("string"),
    originalCost: DS.attr("number"),
    originalCostCurrency: DS.attr("string"),
    revenue: DS.attr("number"),
    revenueCurrency: DS.attr("string"),
    tags: DS.attr('raw'),
    type: DS.attr("string"),            //none/container/roro/bb
    chargeType: DS.attr("string"), //cost/revenue
    visibility: DS.attr('string'), //public, private, root


    is_chargeType_cost: function(){
        return ( this.get('chargeType') === 'cost' );
    }.property('chargeType'),
    is_entityType_item: function(){
        return this.get('entityType') === 'item';
    }.property('entityType'),
    isMultiplierNum: function(){
        return (this.get('multiplier') === 'NUM');
    }.property('multiplier'),
//    is_bookingItem: function(){
//          return ( this.get('bookingItem' === BookMain_controller.get('item_record') ));
//    }.property('bookingItem'),

    isTypeNone: function(){
        return (this.get('type') === 'none');
    }.property('type'),
    isTypeContainer: function(){
        return (this.get('type') === 'container');
    }.property('type'),
    isTypeRoRo: function(){
        return (this.get('type') === 'roro');
    }.property('type'),
    isTypeBB: function(){
        return (this.get('type') === 'bb');
    }.property('type')
});
