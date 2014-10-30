import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    name: DS.attr('string'),
    key: DS.attr('string'),
    number: DS.attr('string'),
    company : DS.belongsTo('company'),
    vesselName : DS.attr('string'),
    vessel : DS.belongsTo('vessel',{ async: true}),
    schedules : DS.hasMany('leg',{
        async: true
    }),
    status : DS.attr('string'),
    authorizedCompanies: DS.hasMany('company',{ async: true}),
    visibility: DS.attr('string'), //public, private, root
    transhipmentFrom: DS.belongsTo('leg'),
    transhipmentTo: DS.belongsTo('leg'),
    parentVoyage: DS.belongsTo('voyage', {
        inverse : 'childVoyages'
    }),
    childVoyages: DS.hasMany('voyage', {
        inverse : 'parentVoyage'
    }),
    embark: function(){
        var embark = '';
        this.get('schedules').forEach(function(val){
            if (val.get('embarking') === true ){
                embark = val;
            }
        });

        return embark;
    }.property('schedules.@each.embarking'),
    disembark: function(){
        var allLeg = this.get('schedules');
        var disembark = '';
        allLeg.forEach(function(val){
            if (val.get('disembarkation') === true ){
                disembark = val;
            }
        });

        return disembark;
    }.property('schedules.@each.disembarkation'),

    embarkingLeg: function(){
        var allLeg = this.get('schedules');
        var embark = '';
        allLeg.forEach(function(val){
            if (val.get('embarking') === true ){
                embark = val.get('poi').get('name');
            }
        });

        return embark;
    }.property('schedules.@each.embarking'),
    disembarkationLeg: function(){
        var allLeg = this.get('schedules');
        var embark = '';
        allLeg.forEach(function(val){
            if (val.get('disembarkation') === true ){
                embark = val.get('poi').get('name');
            }
        });

        return embark;
    }.property('schedules.@each.disembarkation'),

    firstLeg: Ember.computed.alias('schedules.firstObject'),
    lastLeg: Ember.computed.alias('schedules.lastObject')
});
