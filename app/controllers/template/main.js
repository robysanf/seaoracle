import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    template_record: null,
    element_record: null,
    isView: true,

    temporary_records_list: [],   //  qui vengono salvati i sorts eseguiti dall'utente per arrivare alla configurazione desiderata per il template
    temporary_index_list: [],
    searchPort: Ember.A()
});
