import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['booking/main'],

    isChecked: false,

    registerOnParent: function(){
        this.send('managerCheckLists', this, "mtl", true);
    }.on('init'),
    willDestroy: function(){
        this.send('managerCheckLists', this, "mtl", false);
    }
});
