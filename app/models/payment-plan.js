import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    name: DS.attr('string'),
    description: DS.attr('string'),
    amount : DS.attr('number'),
    currency : DS.attr('string'),
    credit : DS.attr('number'),
    visibility: DS.attr('string') //public, private, root
});
