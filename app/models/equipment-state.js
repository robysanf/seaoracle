import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    state : DS.attr('string'),
    from : DS.attr('custom-date'),
    to : DS.attr('custom-date'),
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),
    visibility: DS.attr('string'), //public, private, root

    fromId: function(){
        return 'from-'+ this.get('id');
    }.property('id'),
    toId: function(){
        return 'to-'+ this.get('id');
    }.property('id')
});
