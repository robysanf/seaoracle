import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    key: DS.attr('string'),
    name: DS.attr('string'),
    company: DS.belongsTo('company'),
    type: DS.attr('string'),  //agent

    linkedCompanies: DS.hasMany('company',{
        async: true
    }),
    visibility: DS.attr('string'), //public, private, root

    is_agent: function(){
      return ( this.get('type') === 'agent' );
    }.property('type')
});