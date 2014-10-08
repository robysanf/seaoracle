import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    name: DS.attr('string'),
    paths : DS.hasMany('poi', {
        async: true
    }),
    company : DS.belongsTo('company'),
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),
    visibility: DS.attr('string') //public, private, root
});
