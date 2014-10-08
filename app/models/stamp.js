import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    key: DS.attr('string'),
    name: DS.attr('string'),
    company: DS.belongsTo('company', {inverse: 'stamp'}),
    type: DS.attr('string'),
    value: DS.attr('string'),
    description: DS.attr('string'),
    docTypes: DS.attr('raw'),
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),
    visibility: DS.attr('string'), //public, private, root

    isAlreadyDocCM: function(){
        var list = false;
        list = this.get('docTypes').filter(function(val){
            if(val === 'docCM'){
                return true;
            }
        });
        return list;
    }.property('docTypes'),

    isDocCM: function(){
        var list = false;
        list = this.get('docTypes').filter(function(val){
            if(val === 'docCM'){
                return true;
            }
        });
        if(list === 'docCM'){
            return true;
        }
    }.property('docTypes')
});
