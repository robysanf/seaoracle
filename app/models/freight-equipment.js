import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    code: DS.attr('string'),
    sealCode: DS.attr('string'),
    booking: DS.belongsTo('booking'),
    bookingItems: DS.hasMany('booking-item',{
        async: true
    }),
    equipment: DS.belongsTo('equipment'),
    equipmentCode: DS.attr('string'),
    equipmentClassification: DS.belongsTo('equipment-classification'),    // Name ex: container/dry_freight_box/40
    equipmentClassificationName: DS.attr('string'),
    equipmentClassificationSizeCode: DS.attr('string'),
    equipmentClassificationTypeCode: DS.attr('string'),
    equipmentClassificationIsoCode: DS.attr('string'),
    equipmentClientCode: DS.attr('string'),
    orderedEquipmentStatuses: DS.hasMany('equipment-status',{
        async: true
    }),
    authorizedCompanies: DS.hasMany('company', {
        async: true
    }),
    currentStatus: DS.attr('string'),
    currentStatusCode: DS.attr('number'),
    currentStatusDateFrom: DS.attr('custom-date'),
    visibility: DS.attr('string'), //public, private, root

//    /** returns a promise */
//    pushStatus: function(status){
//        this.get('orderedEquipmentStatuses').then(function(eqStatuses){
//            eqStatuses.pushObject(status);
//        });
//    },
//    setLastObjectTo: function(today) {
//        var self = this, lastId = null;
//
//        this.get('orderedEquipmentStatuses').then(function(eqStatuses){
//            lastId = eqStatuses.get("lastObject").get("id");
//            self.store.find("equipmentStatus", lastId).then(function(lastObj){
//                if(lastObj.get('to') == null){
//                    lastObj.set("to", today);
//                }
//            })
//        });
//    },
    isAvailableInTerminal: function() {
        return (this.get('currentStatus') == "Available in Terminal");
    }.property('currentStatus'),
    isStuffing: function() {
        return (this.get('currentStatus') == "Stuffing");
    }.property('currentStatus'),
    isReadyToEmbark: function() {
        return (this.get('currentStatus') == "Ready to Embark");
    }.property('currentStatus'),
    isOnBoard: function() {
        return (this.get('currentStatus') == "On Board");
    }.property('currentStatus'),
    isDischarged: function() {
        return (this.get('currentStatus') == "Discharged");
    }.property('currentStatus'),
    isLadenInTerminal: function() {
        return (this.get('currentStatus') == "Laden in Terminal");
    }.property('currentStatus'),
    isDeliveredToReceiver: function() {
        return (this.get('currentStatus') == "Delivered to Receiver");
    }.property('currentStatus')
});
