import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    isDocCM: true,
    newName: null,
    newType: null,
//    newValue: null,
    newDescription: null
});
