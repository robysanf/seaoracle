import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var self = this, app_controller = self.controllerFor('application');

        if( !app_controller.autocompletePoiPort.get('length') ) {
            this.store.findQuery("poi", {tags: 'Port', sortBy:"name"}).then(function(val){
                app_controller.set("autocompletePoiPort", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }
    },

    model: function( segment ) {
        return this.store.find('segment', segment.segment_id);
    },

    actions: {
        change_state: function( bool, record ) {
            var self = this, controller = self.controllerFor('segment.main'), app_controller = self.controllerFor('application');

            if( bool === true ) {

                (record.get('name') !== null && record.get('name') !== '' ? $('span#1.input-group-addon').removeClass('alert-danger') : $('span#1.input-group-addon').addClass('alert-danger'));

                 if( record.get('name') !== null && record.get('name') !== '' ){
                     record.save().then(function(val){
                         //SAVED
                         new PNotify({
                             title: 'Saved',
                             text: 'You successfully saved the record.',
                             type: 'success',
                             delay: 1000
                         });

                         app_controller.autocompleteSegment.forEach(function(item, index){
                             if( item.get('id') === record.get('id') ) {
                                 app_controller.autocompleteSegment.removeAt(index);
                                 app_controller.autocompleteSegment.pushObject(val);
                             }
                         });

                         controller.set('isView', bool);
                     }, function(){
                         //NOT SAVED
                         new PNotify({
                             title: 'Not saved',
                             text: 'A problem has occurred.',
                             type: 'error',
                             delay: 2000
                         });
                     });
                 } else {
                     //WARNING
                     new PNotify({
                         title: 'Attention',
                         text: 'Please check if required fields have been entered..',
                         delay: 2000
                     });
                 }

            } else {
                controller.set('isView', bool);
            }
        }
    }
});
