import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    key: DS.attr('string'),
    name: DS.attr('string'),
    code: DS.attr('string'),
    company: DS.belongsTo('company',{
        inverse: 'files'
    }),
    contentType: DS.attr('string'),
    path: DS.attr('string'),
    entity: DS.attr('string'),
    entityType: DS.attr('string'),
    type: DS.attr('string'),
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),
    visibility: DS.attr('string'), //public, private, root

    isConfirmation: function(){
        return (this.get('name') == 'confirmation.pdf');
    }.property('name'),
    isNote: function(){
        return (this.get('name') == 'booking_note.pdf');
    }.property('name')
});
