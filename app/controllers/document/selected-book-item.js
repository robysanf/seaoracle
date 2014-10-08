import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['document/new-record'],

    isChecked: false,
    registerOnParent: function(){
        this.send('managerCheckLists', null, this, null, "bookIt", true);
    }.on('init'),
    willDestroy: function(){
        this.send('managerCheckLists', null, this, null, "bookIt", false);
    }
});
