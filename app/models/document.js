import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    key: DS.attr('string'),
    name: DS.attr('string'),
    code: DS.attr('string'),   //versione readonly a cui accede il server

    code_description_of_goods: function(){
        return (this.get('code') === 'description_of_goods');
    }.property('code'),
    code_signed_for_the_master_by: function(){
        return (this.get('code') === 'signed_for_the_master_by');
    }.property('code'),
    origin: DS.belongsTo('poi'),
    destination: DS.belongsTo('poi'),
    originLeg: DS.belongsTo('leg'),
    destinationLeg: DS.belongsTo('leg'),
    company: DS.belongsTo('company'),
    shipper: DS.attr('string'),
    consignee: DS.attr('string'),
    notify: DS.attr('string'),
    bookings: DS.hasMany('booking', {
        async: true
    }),
    bookingItems: DS.hasMany('booking-item', {
        async: true
    }),
    leg: DS.belongsTo('leg'),
    voyage: DS.belongsTo('voyage'),
    files: DS.hasMany('file', {
        async: true
    }),
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),
    date: DS.attr('custom-date'),
    type: DS.attr('string'),
    tags: DS.attr('raw'),  //    [bl_type|val_bl_type, dangerous_good|val_dangerous_good]
    stamps: DS.hasMany('stamp', {
        async: true
    }),
    nrOriginal: DS.attr('string'),
    docDetails: DS.hasMany('doc-detail', {
        async: true
    }),
    docItems: DS.hasMany('doc-item', {
        async: true
    }),
    itemsIn: DS.attr('string'), //BillOfLading/AttachedList

    itemsIn_BillOfLading: function(){
        return ( this.get('itemsIn') === 'BillOfLading' );
    }.property('itemsIn'),

    visibility: DS.attr('string'), //public, private, root

    type_extendedVersion: function(){
        if(this.get('type') == 'docBL'){
            return "Bill of Lading"
        } else if (this.get('type') == 'docCM'){
            return "Cargo Manifest"
        } else if (this.get('type') == 'docLL'){
            return "Loading List"
        } else if (this.get('type') == 'docFP'){
            return "Freight Manifest"
        }
    }.property('type'),
    type_codeVersion: function(){
        if(this.get('type') == 'docBL'){
            return "BL" + this.get('code').substring(this.get('code').length -4, this.get('code').length);
        } else if (this.get('type') == 'docCM'){
            return "CM" + this.get('code').substring(this.get('code').length -4, this.get('code').length);
        } else if (this.get('type') == 'docLL'){
            return "LL" + this.get('code').substring(this.get('code').length -4, this.get('code').length);
        } else if (this.get('type') == 'docFP'){
            return "FM" + this.get('code').substring(this.get('code').length -4, this.get('code').length);
        }
    }.property('type', 'code'),

    isBL: function(){
        if(this.get('type') == 'docBL'){
            return true
        }
    }.property('type'),
    isCM: function(){
        if(this.get('type') == 'docCM'){
            return true
        }
    }.property('type'),
    isLL: function(){
        if(this.get('type') == 'docLL'){
            return true
        }
    }.property('type'),
    isFP: function(){
        if(this.get('type') == 'docFP'){
            return true
        }
    }.property('type'),
    isBLorCM: function(){
        if(this.get('type') == 'docBL' || this.get('type') == 'docCM'){
            return true
        }
    }.property('type'),
    isNotFP: function(){
        return (this.get('type') != 'docFP')
    }.property('type'),
    isLLorCM: function(){
        if ( this.get('type') == 'docLL' || this.get('type') == 'docCM' ){
            return true
        }
    }.property('type'),

    bl_type: function(){
        if(this.get('tags') != undefined){
            var arr = this.get('tags');
            var bl_list = this.get('tags').filter(function(val){

                var myVal = val.split('|');
                if(myVal[0] == 'bl_type'){
                    return myVal[1];
                }
            });
            if(bl_list[0] != undefined) {
                var bl_split = bl_list[0].split('|');
                return bl_split[1];
            } else {
                return '';
            }
        }
    }.property('tags'),
    dangerous_good: function(){
        if(this.get('tags') != undefined){
            var arr = this.get('tags');
            var bl_list = this.get('tags').filter(function(val){

                var myVal = val.split('|');
                if(myVal[0] == 'dangerous_good'){
                    return myVal[1];
                }
            });
            if(bl_list[0] != undefined) {
                var bl_split = bl_list[0].split('|');
                return bl_split[1];
            } else {
                return '';
            }
        }
    }.property('tags'),

    dangerousGood_bool: function(){
        return (this.get('dangerous_good') == 'true');
    }.property('dangerous_good')
});
