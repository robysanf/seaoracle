import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    isView: true,
    vessel_record: null,
    fileRecord: null,
    /*********************
     * TAB MANAGER
     **/
    tabList: Ember.A(
        {'details': false},
        {'files': false}
    )

});
