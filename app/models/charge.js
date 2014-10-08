import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    name: DS.attr("string"),
    poi: DS.belongsTo("poi"),
    company : DS.belongsTo('company'),
    chargeItems: DS.hasMany("chargeItem", {
        async: true
    }),
    segment: DS.belongsTo('segment'),
    currency: DS.attr("string"),
    available: DS.attr("boolean"),
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),
    visibility: DS.attr('string') //public, private, root
});
