import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    newName: null,
    newUnLocode: null,
    newCountry: null
});
