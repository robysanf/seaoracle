import Ember from 'ember';

export default Ember.ObjectController.extend({
    isLocked: false,
    isChecked: false,
    registerOnParent: function(){
        //alert("d");
        this.send('managerCheckLists', this, "delay", true);
    }.on('init'),
    willDestroy: function(){
        this.send('managerCheckLists', this, "delay", false);
    }
});
