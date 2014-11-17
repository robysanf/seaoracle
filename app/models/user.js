import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    username: DS.attr('string'),
    password: DS.attr('string'),
    type: DS.attr('string'),    //powerUser/user
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    full_name: function(){
        return ( this.get('firstName') + ' ' + this.get('lastName'));
    }.property('firstName', 'lastName'),
    birthDate: DS.attr('custom-date'),
    email: DS.attr('string'),
    phone: DS.attr('string'),
    company: DS.belongsTo('company',{
        inverse: 'users'
    }),
    grants : DS.hasMany('grant',{
        async : true
    }),
    authorizedCompanies: DS.hasMany('company',{ async: true}),
    cardNumber: DS.attr('number'),
    visibility: DS.attr('string'), //public, private, root

    hiddenCardNumber: function() {
        if( this.get('cardNumber') ) {
            return '*************' + this.get('cardNumber');
        }
    }.property('cardNumber')
});
