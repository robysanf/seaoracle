import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    key: DS.attr('string'),
    name: DS.attr('string'),
    company: DS.belongsTo('company'),
    origin: DS.belongsTo('poi'),
    destination: DS.belongsTo('poi'),
    charges : DS.hasMany('charge', {
        async:true
    }),
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),
    visibility: DS.attr('string') //public, private, root
});
