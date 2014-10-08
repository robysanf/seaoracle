import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    name: DS.attr('string'),
    nickname : DS.attr('string'),
    company : DS.belongsTo('company'),
    currentVoyageNumber: DS.attr('number'),
    payload : DS.attr('number'),
    length : DS.attr('number'),
    width : DS.attr('number'),
    files: DS.hasMany('file', {
        async:true
    }),
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),
    visibility: DS.attr('string') //public, private, root
});
