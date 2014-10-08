import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    name: DS.attr('string'),
    key: DS.attr('string'),
    company : DS.belongsTo('company'),
    equipmentType: DS.attr('string'),
    teu: DS.attr('number'),
    declaredTare: DS.attr('number'),
    declaredVolume: DS.attr('number'),
    sizeCode : DS.attr('string'),
    typeCode : DS.attr('string'),
    isoCode : DS.attr('string'),
    lengthMin : DS.attr('number'),
    lengthMax : DS.attr('number'),
    widthMin : DS.attr('number'),
    widthMax : DS.attr('number'),
    heightMin : DS.attr('number'),
    heightMax : DS.attr('number'),
    doorWidthMin : DS.attr('number'),
    doorWidthMax : DS.attr('number'),
    doorHeightMin : DS.attr('number'),
    doorHeightMax : DS.attr('number'),
    capacityMin : DS.attr('number'),
    capacityMax : DS.attr('number'),
    maxPayLoadMin : DS.attr('number'),
    maxPayLoadMax : DS.attr('number'),
    tareWeightMin : DS.attr('number'),
    tareWeightMax : DS.attr('number'),
    maxGrossWeightMin : DS.attr('number'),
    maxGrossWeightMax : DS.attr('number'),
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),
    visibility: DS.attr('string') //public, private, root
});
