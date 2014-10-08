import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    paymentPlan: DS.belongsTo('payment-plan'),
    files: DS.hasMany('file', {
        async: true
    }),
    date : DS.attr('custom-date'),
    amount : DS.attr('number'),
    credit : DS.attr('number'),
    company: DS.belongsTo('company'),
    user: DS.belongsTo('user'),
    visibility: DS.attr('string') //public, private, root
});
