import Ember from 'ember';

export default Ember.View.extend({
    value:[],

    valueObserver: function() {
        if(this.value){
            this.get('controller').send('filterIdentifier', this.value);
        }
    }.observes('value')
});

