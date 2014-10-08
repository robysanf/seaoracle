import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    booking : DS.belongsTo('booking'),
    freightVoyages: DS.hasMany('freight-voyage', {
        async: true
    }),
    voyages : DS.hasMany('voyage', {
        async: true
    }),

    orderedVoyages: DS.hasMany('voyage', {
        async: true
    }),
    voyList: function(){
        var orderedVoyages = this.get("orderedVoyages");
        var list = '';
        orderedVoyages.forEach(function(voy){
            if( orderedVoyages.get('lastObject') === voy ) {
                list += voy.get('name');
            } else {
                list += voy.get('name') + ' / ';
            }
        });

        return list;
    }.property('orderedVoyages.@each.name'),
    path: DS.attr('raw'),
    origin: DS.belongsTo('poi'),
    originLeg: DS.belongsTo('leg'),
    destination: DS.belongsTo('poi'),
    destinationLeg: DS.belongsTo('leg'),
    transhipments : DS.hasMany('poi', {
        async: true
    }),
    transhipmentLegs: DS.hasMany('leg', {
        async: true
    }),
    orderedTranshipmentLegs: DS.hasMany('leg', {
        async: true
    }),
    visibility: DS.attr('string'), //public, private, root
    authorizedCompanies: DS.hasMany('company',{
        async: true
    }),

    /** returns a promise */
    pushOrderedVoy: function(orderedList){
        var self = this;
        return this.get('voyages').then(function(voyages) {
            voyages.pushObjects(orderedList);
            return self.get('orderedVoyages').then(function(orderedVoyages) {
                orderedVoyages.pushObjects(orderedList);
            });
        });
    },
    pushListOfTranshipments: function(listOfPoi, listOfLeg){
        var self = this;
        return this.get('transhipments').then(function(pois) {
            pois.pushObject(listOfPoi);
            return self.get('transhipmentLegs').then(function(legs) {
                legs.pushObjects(listOfLeg);
            })
        })
    }
});
