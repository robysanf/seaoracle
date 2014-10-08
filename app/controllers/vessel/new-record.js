import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    newName: null,
    newNickname: null,
    newPayload: null,
    newLength : null,
    newWidth: null
});
