import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    bookingItem: DS.belongsTo('bookingItem'),
    status : DS.attr('string'),
    statusCode : DS.attr('number'),
    from : DS.attr('custom-date'),
    to : DS.attr('custom-date'),
    freightEquipment: DS.attr('string'),    //non è stato possibile mettere riferimento belognsTo perchè generava errore
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),
    visibility: DS.attr('string'), //public, private, root

    fromId: function(){
        return 'from-'+this.get('id');
    }.property('id'),
    toId: function(){
        return 'to-'+this.get('id');
    }.property('id')
});
