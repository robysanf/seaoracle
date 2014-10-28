import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),           //share/credit/general/link
    company: DS.belongsTo('company'),
    date: DS.attr('custom-date'),
    fromCompany: DS.belongsTo('company'),
    fromCompanyDetail: DS.attr('string'),
    fromUser: DS.belongsTo('user'),
    fromUserDetail: DS.attr('string'),
    description: DS.attr('string'),
    valueNum: DS.attr('number'),
    entityType: DS.attr('string'),    //booking, charge etc.
    entity: DS.attr('number'),        // id dell'entity
    status: DS.attr('string'),        //hide, show
    //referringNotification: DS.belongsTo('notification'),
    type: DS.attr('string'),
    highlighted: DS.attr('boolean'),
    dueDate: DS.attr('custom-date'),
    actionToken: DS.attr('string'),
    files: DS.hasMany('file', {
        async:true
    })
});
