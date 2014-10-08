import DS from 'ember-data';

export default DS.Model.extend({
    type : DS.attr('string'),   //access, userType, permission
    name: DS.attr('string'),
    value : DS.attr('string'),
    accessNew : DS.attr('string'),    //Global/Deep/Local/Basic/None
    accessEdit : DS.attr('string'),    //Global/Deep/Local/Basic/None
    accessRemove : DS.attr('string'),   //Global/Deep/Local/Basic/None
    accessView : DS.attr('string'),     //Global/Deep/Local/Basic/None
    access : DS.attr('boolean'),       //true/false
    ckPermission: DS.attr('boolean'),
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),
    isAccess: function(){
        return (this.get('type') === "access");
    }.property('type'),

    isPermission: function(){
        return (this.get('type') === "permission");
    }.property('type'),

    isUserType: function(){
        return (this.get('type') === "userType");
    }.property('type'),

    isPowerUser: function(){
        return (this.get('ckPermission') === true);
    }.property('ckPermission'),

    allCheck: function (key, ck_new, ck_view, ck_edit, ck_remove){
        this.set('accessNew', ck_new);
        this.set('accessView', ck_view);
        this.set('accessEdit', ck_edit);
        this.set('accessRemove', ck_remove);
    }
});
