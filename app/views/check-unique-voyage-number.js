import Ember from 'ember';

export default Ember.View.extend({
    model:[],
    filter_vessel:[],
    filter_number:[],
    vessel:[],
    number:[],

    focusOut: function(e) {
        this.get('controller').send('check_uniqueVoyageNumber', this.model, this.filter_vessel, this.filter_number, this.vessel.get('id'), this.number);
    }
});
