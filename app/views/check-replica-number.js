import Ember from 'ember';

export default Ember.View.extend({
    focusOut: function() {
        if(this.get('controller').replicaNumber > 100 || this.get('controller').replicaNumber < 1){
            new PNotify({
                title: 'Attention',
                text: 'The number must be greater than 0 and less than 100.',
                delay: 2000
            });
            this.get('controller').set('replicaNumber', 1);
        }
    }
});