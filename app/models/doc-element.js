import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    code: DS.attr('string'),
    code_identifier: function(){
        return ( this.get('code') === 'identifier' );
    }.property('code'),
    code_seal: function(){
        return ( this.get('code') === 'seal' );
    }.property('code'),
    code_description: function(){
        return ( this.get('code') === 'description' );
    }.property('code'),
    code_weight: function(){
        return ( this.get('code') === 'weight' );
    }.property('code'),
    code_measurement: function(){
        return ( this.get('code') === 'measurement' );
    }.property('code'),
    code_tare: function(){
        return ( this.get('code') === 'tare' );
    }.property('code'),
    code_qty: function(){
        return ( this.get('code') === 'qty' );
    }.property('code'),
    code_20_40: function(){
        return ( this.get('code') === '20/40' );
    }.property('code'),
    code_gr_wt: function(){
        return ( this.get('code') === 'gr_wt' );
    }.property('code'),
    code_gr_wt_ttl: function(){
        return ( this.get('code') === 'gr_wt_ttl' );
    }.property('code'),
    code_gr_wt_ea: function(){
        return ( this.get('code') === 'gr_wt_ea' );
    }.property('code'),
    code_mtl: function(){
        return ( this.get('code') === 'mtl' );
    }.property('code'),
    code_height: function(){
        return ( this.get('code') === 'height' );
    }.property('code'),
    code_width: function(){
        return ( this.get('code') === 'width' );
    }.property('code'),
    code_lenght: function(){
        return ( this.get('code') === 'lenght' );
    }.property('code'),


    value: DS.attr('string'),
    name: DS.attr('string'),
    numericValue: DS.attr('number'),
    docItem: DS.belongsTo('doc-item'),
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),
    visibility: DS.attr('string') //public, private, root
});
