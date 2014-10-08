import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    poi: DS.belongsTo('poi'),
    dta : DS.attr("custom-date"),
    dtd : DS.attr('custom-date'),
    eta : DS.attr('custom-date'),
    etd : DS.attr('custom-date'),
    ata : DS.attr('custom-date'),
    atd : DS.attr('custom-date'),
    bookingStatus : DS.attr('string'),
    customsClosingDate : DS.attr('custom-date'),
    customsClosingTime : DS.attr('string'),
    voyage : DS.attr('string'),
    info: DS.attr('raw'),
    originFreightPlans: DS.attr('raw'),
    destinationFreightPlans: DS.attr('raw'),
    visibility: DS.attr('string'), //public, private, root
    authorizedCompanies: DS.hasMany('company',{ async: true}),
    isBookingOpen: function(){
        return (this.get('bookingStatus') === "open");
    }.property('bookingStatus'),
    ataId: function(){
        return 'ata-'+this.get('id');
    }.property('id'),
    atdId: function(){
        return 'atd-'+this.get('id');
    }.property('id'),
    etaId: function(){
        return 'eta-'+this.get('id');
    }.property('id'),
    etdId: function(){
        return 'etd-'+this.get('id');
    }.property('id'),
    dtaId: function(){
        return 'dta-'+this.get('id');
    }.property('id'),
    customsClosingDateId: function(){
        return 'customsClosingDate-'+this.get('id');
    }.property('id'),
    customsClosingTimeId: function(){
        return 'customsClosingTime-'+this.get('id');
    }.property('id'),
    embarking: DS.attr('boolean'),
    disembarkation: DS.attr('boolean'),

    isTranshipment: function(){
       return ( this.get('embarking') || this.get('disembarkation') );
    }.property('embarking', 'disembarkation')
});
