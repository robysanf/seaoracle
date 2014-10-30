import DS from 'ember-data';
import app_controller from 'seaoracle/controllers/application';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    key: DS.attr('string'),
    name: DS.attr('string'),
    vat : DS.attr('string'),
    street : DS.attr('string'),
    city : DS.attr('string'),
    zipCode : DS.attr('number'),
    province : DS.attr('string'),
    country : DS.attr('string'),
    countryIso3 : DS.attr('string'),
    type: DS.attr('string'),  // agency/client/shipowner/none
    emails : DS.attr('raw'),
    fax : DS.attr('string'),
    phone : DS.attr('string'),
    notifications: DS.hasMany('notification', {
        async: true,
        inverse: 'company'
    }),

    showNotifications: function() {
        var notify = this.get("notifications"), fired = null;

        notify.forEach(function(val){
            if( val.get('status') === 'show' ) {
                fired += 1;
            }
        });
        return fired;
    }.property('notifications.@each.status'),

    hiddenNotifications: function() {
        var notify = this.get("notifications"), fired = null;

        notify.forEach(function(val){
            if( val.get('status') === 'hide' ) {
                fired += 1;
            }
        });
        return fired;
    }.property('notifications.@each.status'),

    firedNotifications: function() {
        var notify = this.get("notifications"), fired = null;

        notify.forEach(function(val){
            if( val.get('highlighted') === true ) {
                fired += 1;
            }
        });
        return fired;
    }.property('notifications.@each.highlighted'),

    users : DS.hasMany('user',{
        async: true,
        inverse: 'company'
    }),
    grants : DS.hasMany('grant',{
        async:true
    }),
    parentCompany: DS.belongsTo('company', {
        inverse: 'inverseCompany'
    }),
    inverseCompany: DS.belongsTo('company', {       //creato solo per dare un inverso a parent company
        inverse: 'parentCompany'
    }),
    links: DS.hasMany('company', {
        async:true,
        inverse: 'inverseLink'
    }),
    inverseLink: DS.hasMany('company', {
        inverse: 'links'
    }),
    files: DS.hasMany('file', {
        async:true,
        inverse: 'company'
    }),
    stamp: DS.belongsTo('stamp', {
        inverse: 'company'
    }),
    referringPort: DS.belongsTo('poi', {
        inverse: 'company'
    }),
    agentCommission: DS.attr('number'),
    brokerage: DS.attr('number'),
    handlingFee: DS.attr('number'),
    refills: DS.hasMany('refill',{
        async:true
    }),
    vatExempt: DS.attr('boolean'),
    credit: DS.attr('number'),
//    authorizedCompanies: DS.hasMany('company',{
//        async: true
//    }),
    visibility: DS.attr('string'), //public, private, root

    isTypeShipowner: function(){
        return this.get('type') === 'shipowner';
    }.property('type'),

    isMyCompany: function(){
        return this.get('id') === app_controller.company;
    }.property('id')
});
