import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    searchNickname: Ember.A(),
    searchPayload: null,

    vessel_record: null
});
