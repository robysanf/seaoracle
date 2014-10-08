import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    bookingItem: DS.belongsTo('booking-item'),
    city: DS.attr('string'),
    province: DS.attr('string'),
    country: DS.attr('string'),
    street: DS.attr('string'),
    note: DS.attr('string'),
    date: DS.attr('custom-date'),
    time: DS.attr('string'),
    taxedTime: DS.attr('boolean'),
    carrier: DS.belongsTo('company'),
    pickUpCompany: DS.belongsTo('company'),
    pickUpCompanyDetail: DS.attr('string'),
    carrierDetail: DS.attr('string'),
    files: DS.hasMany('file', {
        async:true
    }),
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),
    visibility: DS.attr('string') //public, private, root
});
