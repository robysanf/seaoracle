import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    company: DS.belongsTo('company'),
    value: DS.attr('string'),
    type: DS.attr('string'),
    linkedEntityType: DS.attr('string'),
    linkedEntityName: DS.attr('string'),
    linkedEntity: DS.attr('string'),
    visibility: DS.attr('string') //public, private, root
});
