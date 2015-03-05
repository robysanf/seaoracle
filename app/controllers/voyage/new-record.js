import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    voyage_record: null,

    newVisibility: 'public',
    newName: null,
    newNumber: null,

    searchVoyage: null,
    searchVessel: null,
    searchPort: null,
    searchTemplate: null,

    indexOfPorts: [],
    temp_listOfElements: [],
    listOfElements: [],  //poi, poiId, leg, indexOfPoi

    temporary_index_list: [],    //indexOfPorts: [],//  qui vengono salvati i sorts eseguiti dall'utente per arrivare alla configurazione desiderata per il template
    temporary_records_list: [],  //listOfPorts: [],
    items_list: [],

    temporaryPath: null,  // lista completa ed ordinata dei porti scelti dall'utente
    legs: function() { return this.temporaryPath; }.observes('temporaryPath')   //usata a livello del template per generare {{each}} porti
});
