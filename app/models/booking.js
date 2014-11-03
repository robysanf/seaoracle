import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    allInclusive: DS.attr('boolean'),
    noFreightPlan: DS.attr('boolean'), //di default false, se true è possibile fare il lock del booking senza un freight plan

    acknowledgeDate: DS.attr('custom-date'),
    dta: DS.attr('custom-date'),
    dtd: DS.attr('custom-date'),

    allInclusiveValue: DS.attr('number'),

    code: DS.attr('string'),
    state: DS.attr('string'),
    finalDestination: DS.attr('string'),
    agencyDetail: DS.attr('string'),
    clientDetail: DS.attr('string'),
    shipperDetail: DS.attr('string'),
    consigneeDetail: DS.attr('string'),
    notifyDetail: DS.attr('string'),
    bookNote: DS.attr('string'),
    currency: DS.attr('string'),
    chargeMode: DS.attr('string'),    //PP-COLL
    serviceContract: DS.attr('string'),
    refNo: DS.attr('string'),
    acknowledge: DS.attr('string'),  //NaN/requested/accepted/rejected
    visibility: DS.attr('string'), //public, private, root

    origin: DS.belongsTo('poi'),
    destination: DS.belongsTo('poi'),
    company : DS.belongsTo('company'),
    customManifestHandler: DS.belongsTo('company'),
    notify: DS.belongsTo('company'),
    client: DS.belongsTo('company'),
    agency: DS.belongsTo('company'),
    shipper: DS.belongsTo('company'),
    consignee: DS.belongsTo('company'),

    chargeItems: DS.hasMany('charge-item', {
        async: true}),
    freightPlans: DS.hasMany('freight-plan', {
        async: true}),
    items: DS.hasMany('booking-item', {
        async: true,
        inverse: 'booking'}),
    files: DS.hasMany('file', {
        async:true}),
    sharedWith: DS.hasMany('company', {
        async:true}),
    documents: DS.hasMany('document', {
        async:true}),
    authorizedCompanies: DS.hasMany('company',{
        async: true}),

    clientAgencyAreEqual: function(){
        return(this.get('agencyDetail') == this.get('clientDetail'));
    }.property('agencyDetail', 'clientDetail'),
    isPP: function() {
        return  ((this.get('chargeMode') == 'PP'))
    }.property('chargeMode'),
    isDocBL: function(){
        var isTrue = false, docBL = this.get("documents");
        return docBL.filterBy('isBL', true).get('length');
    }.property('documents.@each.isBL'),
    isRequest: function(){
        return  ((this.get('state') == 'request'))
    }.property('state'),
    isPending: function(){
        return  ((this.get('state') == 'pending'))
    }.property('state'),
    isEditing: function(){
        return  ((this.get('state') == 'edit'))
    }.property('state'),
    isLocked: function(){
        return  ((this.get('state') == 'lock'))
    }.property('state'),
    isRegister: function(){
        return  ((this.get('state') == 'register'))
    }.property('state'),
    isEditOrLock: function(){
        return ((this.get('state') == 'lock') || (this.get('state') == 'edit'))
    }.property('state'),
    isReqOrEdit: function(){
        return ((this.get('state') == 'request') || (this.get('state') == 'edit'))
    }.property('state'),
    isReqOrPen: function(){
        return ((this.get('state') == 'request') || (this.get('state') == 'pending'))
    }.property('state'),
    isRegistOrPend: function(){
        return  ((this.get('state') == 'register') || (this.get('state') == 'pending'))
    }.property('state'),
    isPendLockRegister: function(){
        return ((this.get('state') == 'pending') || (this.get('state') == 'lock') || (this.get('state') == 'register'))
    }.property('state'),
    isLockedOrRegistered: function(){
        return ((this.get('state') == 'register') || (this.get('state') == 'lock'))
    }.property('state'),
    isLockOrRegistOrPend: function(){
        return ((this.get('state') == 'register') || (this.get('state') == 'lock') || (this.get('state') == 'pending'))
    }.property('state'),
    isEditOrLockOrRegistOrPend: function(){
        return ( (this.get('state') == 'pending') || (this.get('state') == 'edit') || (this.get('state') == 'lock') || (this.get('state') == 'register') )
    }.property('state'),
    thereIsMemo: function(){
        return this.get('items').filterBy('bookingItemType', 'memo').get('length');
    }.property('items.@each.bookingItemType'),

    isNaN: function(){
        return (this.get('acknowledge') === 'NaN');
    }.property('acknowledge'),
    isAccept: function(){
        return (this.get('acknowledge') === 'accepted');
    }.property('acknowledge'),
    isReject: function(){
        return (this.get('acknowledge') === 'rejected');
    }.property('acknowledge'),

    isNaN_orReject: function(){
        return (this.get('acknowledge') === 'rejected' || this.get('acknowledge') === 'NaN' );
    }.property('acknowledge'),
    is_OR_nan_requested_reject: function(){
        return (this.get('acknowledge') === 'rejected' || this.get('acknowledge') === 'NaN' || this.get('acknowledge') === 'requested');
    }.property('acknowledge')
});
