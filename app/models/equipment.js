import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    code: DS.attr('string'),
    company : DS.belongsTo('company'),
    originalCode : DS.attr('string'),
    equipmentClassification: DS.belongsTo('equipment-classification'),
    dailyCost : DS.attr('number'),
    currency: DS.attr('string'),
    position : DS.belongsTo('poi'),
    supplier : DS.belongsTo('company'),
    holder : DS.belongsTo('company'),
    planners : DS.hasMany('company', {
        async: true
    }),
    commissionStates : DS.hasMany('commission-state',{
        async: true
    }),    //commissioned/decommissioned
    equipmentStates : DS.hasMany('equipment-state',{
        async: true
    }),     //damaged/to be checked/authorized/available
    rinas : DS.hasMany('rina',{
        async: true
    }),
    available : DS.attr('boolean'),
    currentStatus: DS.attr('string'),
    currentStatusCode: DS.attr('number'),
    currentStatusDateFrom: DS.attr('custom-date'),
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),
    visibility: DS.attr('string') //public, private, root
});
