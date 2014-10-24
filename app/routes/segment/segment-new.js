import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var self = this, controller = self.controllerFor('segment.segment-new'), app_controller = self.controllerFor('application');

//      **************
//      INIT.
        //filter on search port of origin and port of destination in the template
        if( !app_controller.autocompletePoiPort.get('length') ) {
            this.store.findQuery("poi", {tags: 'Port'}).then(function(val){
                app_controller.set("autocompletePoiPort", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        if( !app_controller.autocompleteSegment.get('length') ) {
            this.store.findQuery("segment").then(function(val){
                app_controller.set("autocompleteSegment", val);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        //reset search variables
        controller.newOrigin = Ember.A();
        controller.newDestination = Ember.A();
    },

    actions: {
        create_record: function( _btn ) {
            var self = this, controller = self.controllerFor('segment.segment-new'), app_controller = self.controllerFor('application');

            //verifico che i campi obbligatori siano stati compilati
            (controller.newName != null && controller.newName.length > 1 ? $('span#1.input-group-addon').removeClass('alert-danger') : $('span#1.input-group-addon').addClass('alert-danger'));

            if (controller.newName != null && controller.newName.length > 1) {

                var newSegment = this.get('store').createRecord('segment', {
                    name: controller.newName,
                    origin: controller.newOrigin,
                    destination: controller.newDestination,
                    visibility: 'private'
                });

                    newSegment.save().then(function(promise){
                        app_controller.autocompleteSegment.pushObject(promise);

                        _btn.stop();
                        //SUCCESS
                        new PNotify({
                            title: 'Saved',
                            text: 'You successfully saved the record.',
                            type: 'success',
                            delay: 1000
                        });

                        controller.set('newName', null);
                        controller.set('newOrigin', []);
                        controller.set('newDestination', []);

                }, function(){
                        _btn.stop();
                        //NOT SAVED
                        new PNotify({
                            title: 'Not saved',
                            text: 'A problem has occurred.',
                            type: 'error',
                            delay: 2000
                        });
                });
            } else {
                _btn.stop();
                //WARNING
                new PNotify({
                    title: 'Attention',
                    text: 'please check if required fields have been entered.',
                    type: 'error',
                    delay: 2000
                });
            }
        }
    }
});
