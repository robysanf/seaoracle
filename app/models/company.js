import DS from 'ember-data';
import app_controller from 'seaoracle/controllers/application';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    vatExempt: DS.attr('boolean'),

    agentCommission: DS.attr('number'),
    brokerage: DS.attr('number'),
    credit: DS.attr('number'),
    handlingFee: DS.attr('number'),
    zipCode : DS.attr('number'),

    key: DS.attr('string'),
    name: DS.attr('string'),
    vat : DS.attr('string'),
    street : DS.attr('string'),
    city : DS.attr('string'),
    province : DS.attr('string'),
    country : DS.attr('string'),
    countryIso3 : DS.attr('string'),
    type: DS.attr('string'),  // agency/client/shipowner/none
    fax : DS.attr('string'),
    phone : DS.attr('string'),
    visibility: DS.attr('string'), //public, private, root

    emails : DS.attr('raw'),

    parentCompany: DS.belongsTo('company', {
        inverse: 'inverseCompany' }),
    inverseCompany: DS.belongsTo('company', {       //creato solo per dare un inverso a parent company
        inverse: 'parentCompany'}),
    stamp: DS.belongsTo('stamp', {
        inverse: 'company'}),
    referringPort: DS.belongsTo('poi', {
        inverse: 'company'}),

    links: DS.hasMany('company', {
        async:true,
        inverse: 'inverseLink'}),
    inverseLink: DS.hasMany('company', {
        inverse: 'links'}),
    files: DS.hasMany('file', {
        async:true,
        inverse: 'company'}),
    groups: DS.hasMany('group',{
        async:true,
        inverse: 'company'}),
    users : DS.hasMany('user',{
        async: true,
        inverse: 'company'}),
    grants : DS.hasMany('grant',{
        async:true}),
    notifications: DS.hasMany('notification', {
        async: true,
        inverse: 'company'}),
    refills: DS.hasMany('refill',{
        async:true}),
    features: DS.hasMany('feature',{
        async:true,
        inverse: 'company'}),

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
    isTypeShipowner: function(){
        return this.get('type') === 'shipowner';
    }.property('type'),

    isMyCompany: function(){
        return this.get('id') === app_controller.company;
    }.property('id')
});
