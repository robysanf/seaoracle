import Ember from 'ember';

export default Ember.ObjectController.extend({
    isChecked: false,
    registerOnParent: function(){
        this.send('managerCheckLists', this, "freight-plan", true);
    }.on('init'),
    willDestroy: function(){
        this.send('managerCheckLists', this, "freight-plan", false);
    }
});
