import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    docElements: DS.hasMany('doc-element', {
        async: true
    }),
    bookingItem: DS.belongsTo('booking-item'),
    tu: DS.attr('string'),
    tu_container: function(){
        return ( this.get('tu') === 'container' );
    }.property('tu'),
    tu_roro: function(){
        return ( this.get('tu') === 'roro' );
    }.property('tu'),
    tu_bb: function(){
        return ( this.get('tu') === 'bb' );
    }.property('tu'),
    document: DS.belongsTo('document'),
    visible: DS.attr('boolean'),
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),
    visibility: DS.attr('string') //public, private, root
});
