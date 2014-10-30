import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    company: DS.belongsTo('company'),  //company a cui arriva la notifica
    date: DS.attr('custom-date'),         //date di creazione della notifica
    fromCompany: DS.belongsTo('company'),    //company che invia la notifica
    fromCompanyDetail: DS.attr('string'),
    fromUser: DS.belongsTo('user'),
    fromUserDetail: DS.attr('string'),
    description: DS.attr('string'),
    valueNum: DS.attr('number'),        //nel caso di name === credit
    entityType: DS.attr('string'),    //booking, charge etc.
    entity: DS.attr('string'),        // id dell'entity
    path: function(){
        return (this.get('entityType') +'/main');
    }.property('entityType'),
    status: DS.attr('string'),        //hide, show (se l'utente vuole nasconderla)
    hide_notification: function() {
        return ( this.get('status') === 'hide' );
    }.property('status'),

    //referringNotification: DS.belongsTo('notification'),
    type: DS.attr('string'),             //share/credit/general/link
    highlighted: DS.attr('boolean'),     // true === non ancora vista
    dueDate: DS.attr('custom-date'),     //  nel caso di name === share ?
    actionToken: DS.attr('string'),
    files: DS.hasMany('file', {
        async:true
    })
});
