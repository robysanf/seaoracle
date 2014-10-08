import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    voyage_record: null,
    isView: null,
    details_isView: null,
    /*********************
     * TAB MANAGER
     **/
    tabList: Ember.A(
        {'path': false},
        {'details': false}
    ),

    /*********************
     * TAB PATH
     **/
    schedules_record: null,

    indexOfPorts: [],
    temp_listOfElements: [],
    listOfElements: [],  //poi, poiId, leg, indexOfPoi

    temporary_index_list: [],    //indexOfPorts: [],//  qui vengono salvati i sorts eseguiti dall'utente per arrivare alla configurazione desiderata per il template
    temporary_records_list: [],  //listOfPorts: [],
    items_list: [],

    temporaryPath: [], // stampa a layout i valori selezionati nel pop-up
    legs: function() { return this.temporaryPath; }.property('temporaryPath'),   //usata a livello del template per generare {{each}} porti

    searchPort: null,
    searchTemplate: null

});
