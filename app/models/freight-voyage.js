import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    voyage: DS.belongsTo('voyage'),
    freightPlan: DS.belongsTo('freight-plan'),
    transhipmentFrom: DS.belongsTo('leg'),
    transhipmentTo: DS.belongsTo('leg'),
    schedules : DS.hasMany('leg',{ async: true})
});
