import Ember from 'ember';

export default Ember.View.extend({
    classNameBindings: ['indexClassName'],
    indexClassName: function() {
        return 'item-' + this.get('contentIndex');
    }.property('contentIndex')
});

