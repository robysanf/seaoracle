import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    template_record: null,
    element_record: null,

    newName: null,

    temporaryPath: null,
    legs: function() { return this.temporaryPath; }.property('temporaryPath'),
    listOfPorts: [],     //list of port ids, qui vengono salvati i sorts eseguiti dall'utente per arrivare alla configurazione desiderata per il template
    temporary_index_list: []
});
