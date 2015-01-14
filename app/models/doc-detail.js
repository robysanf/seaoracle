import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    name: DS.attr('string'),
    code: DS.attr('string'),
    value: DS.attr('string'),
    company: DS.belongsTo('company'),
    docType: DS.attr('string'), //docCM - docBL - docFM - docLL
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),
    visibility: DS.attr('string'), //public, private, root


    code_description_of_goods: function(){
        return (this.get('code') === 'description_of_goods');
    }.property('code'),
    code_signed_for_the_master_by: function(){
        return (this.get('code') === 'signed_for_the_master_by');
    }.property('code')
});
