import Ember from 'ember';

export default Ember.View.extend({
    mouseDown:  function() {
        this.get('controller').send('closeSearch');
    },
    //start output
    mouseUp:function() {
        this.get('controller').send('searchRecords');
    }
});