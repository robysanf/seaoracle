import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    tu: DS.attr('string'),                       // Transport Unit: c, r, b
    tu_container: function(){
        return ( this.get('tu') === 'container' );
    }.property('tu'),
    tu_roro: function(){
        return ( this.get('tu') === 'roro' );
    }.property('tu'),
    tu_bb: function(){
        return ( this.get('tu') === 'bb' );
    }.property('tu'),
    code: DS.attr('string'),
    emptyWithdrawalTerminal: DS.belongsTo('poi'), //di tipo depot
    ladenReturnTerminal: DS.belongsTo('poi'), //di tipo depot
    chassisNum: DS.attr('string'),
    booking: DS.belongsTo('booking'),
    shipper: DS.belongsTo('company'),
    shipperDetail: DS.attr('string'),
    consignee: DS.belongsTo('company'),
    consigneeDetail: DS.attr('string'),
    notify: DS.belongsTo('company'),
    notifyDetail: DS.attr('string'),
    customManifestHandler: DS.belongsTo('company'),
    classification: DS.attr('string'),          // Classificazione della merce
    packNum: DS.attr('number'),             // Numero di colli
    packType: DS.attr('string'),
    eWeight: DS.attr('number'),
    eTemperature: DS.attr('number'),
    eVolume: DS.attr('number'),
    eHeight: DS.attr('number'),
    eWidth: DS.attr('number'),
    eLength: DS.attr('number'),
    eMc: DS.attr('string'),
    eEquivLength: DS.attr('number'),
    weight: DS.attr('number'),
    temperature: DS.attr('number'),
    volume: DS.attr('number'),
    height: DS.attr('number'),
    width: DS.attr('number'),
    length: DS.attr('number'),
    equivLength: DS.attr('number'),
    mc: DS.attr('string'),
    imoClassification: DS.attr('number'),
    imoRefPage: DS.attr('string'),
    features: DS.attr('raw'),
    description: DS.attr('string'),
    custom: DS.attr('boolean'),
    freightEquipments: DS.hasMany('freight-equipment', {
        async: true
        //inverse: 'bookingItems'
    }),
    haulageType: DS.attr('string'),
    haulages: DS.hasMany('haulage', {
        async: true
    }),
    bookingFrom: DS.belongsTo('booking'),
    customBroker: DS.belongsTo('company'),
    freightForwardingAgent: DS.belongsTo('company'),
    customPoi: DS.belongsTo('poi'),
    customContactPerson: DS.attr('string'),
    customContactPhone: DS.attr('string'),
    bookingItemType: DS.attr('string'),             // item/memo
    is_typeItem: function(){
        return this.get('bookingItemType') === 'item';
    }.property('bookingItemType'),

    loadedOn: DS.attr('boolean'),            // default false
    referringItemLoadedOn: DS.belongsTo('booking-item',{
        inverse: 'inverseItemLoadedOn'
    }),         //riferimento al RoRo che conterrà questo booking Item            --> referringItemNotCount
    inverseItemLoadedOn: DS.belongsTo('booking-item', {
        inverse: 'referringItemLoadedOn'
    }),
    referringMemo: DS.belongsTo('booking-item', {
        inverse: 'childMemoItems'
    }),     // riferimento al memo da cui è stato creato il booking item
    childMemoItems: DS.hasMany('booking-item', {          //riferimento agli Items che sono stati creati dal corrente Memo
        async: true,
        inverse: 'referringMemo'
    }),
    chargeItems: DS.hasMany('charge-item', {          //riferimento agli Items che sono stati creati dal corrente Memo
        async: true,
        inverse: 'bookingItem'
    }),
    note: DS.attr('string'),
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),
    files: DS.hasMany('file', {
        async:true
    }),
    visibility: DS.attr('string'), //public, private, root

    is_eVolume: function() {
        return (this.get("eLength") * this.get("eWidth") * this.get("eHeight")).toFixed(3);
    }.property('eLength', 'eWidth', 'eHeight'),
    isHaulageC: function(){
        return  ((this.get('haulageType') == 'Carrier'))
    }.property('haulageType'),
    is_volume: function() {
        return (this.get("length") * this.get("width") * this.get("height")).toFixed(3);
    }.property('length', 'width', 'height'),
    //variabili instanziate per il memo: viene scalato un valore ogni volta che viene creato un item dal memo
    countWeight: function() {
        var childItems = this.get("childMemoItems");
        var ret = 0;
        childItems.forEach(function(child){
            ret += child.get("eWeight");

        });
        return this.get("eWeight") - ret;
    }.property('childMemoItems.@each.eWeight'),
    countMtl: function() {
        var childItems = this.get("childMemoItems");
        var ret = 0;
        childItems.forEach(function(child){
            ret += child.get("eLength");
        });
        return this.get("eLength") - ret;
    }.property('childMemoItems.@each.eLength'),
    customCode: function(){
        if(this.get('code')){
            var myVal = this.get('code').split('/');
            return myVal[2];
        }
    }.property('code')
});
