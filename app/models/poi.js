import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    name: DS.attr('string'),
    key: DS.attr('string'),
    company : DS.belongsTo('company', {inverse: 'referringPort'}),
    street : DS.attr('string'),
    city : DS.attr('string'),
    zipCode : DS.attr('number'),
    province : DS.attr('string'),
    country : DS.attr('string'),
    countryIso3 : DS.attr('string'),
//    regions: DS.hasMany('region', {
//        async: true
//    }),
    email : DS.attr('string'),
    phone : DS.attr('string'),
    notifyParty : DS.attr('string'),
    unLocode: DS.attr('string'),
    referringPoi: DS.belongsTo('poi', {
        inverse: 'childPois'
    }),
    childPois: DS.hasMany('poi',{
        async: true,
        inverse: 'referringPoi'
    }),
    tags : DS.attr('raw'),  //port/warehouse/depot
    // You defined the 'referringPort' relationship on seaforward-cli@model:company:, but multiple possible inverse
    // relationships of type seaforward-cli@model:company: were found on seaforward-cli@model:poi:.
    // Look at http...<omitted>...es
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),
    visibility: DS.attr('string') //public/private/root
});
