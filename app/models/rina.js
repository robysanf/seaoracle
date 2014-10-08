import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    from : DS.attr('custom-date'),
    to : DS.attr('custom-date'),
    visibility: DS.attr('string'),
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),

    fromId: function(){
        return 'from-'+this.get('id');
    }.property('id'),
    toId: function(){
        return 'to-'+this.get('id');
    }.property('id')
});
