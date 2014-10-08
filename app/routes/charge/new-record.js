import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('charge.new-record');

        if( !app_controller.autocompleteSegment.get('length') ) {
            self.store.findQuery("segment").then(function(val){
                app_controller.set("autocompleteSegment", val);
            });
        }
        if( !app_controller.autocompleteCharge.get('length') ) {
            self.store.findQuery("charge").then(function(region){
                app_controller.set("autocompleteCharge", region);
            });
        }

        //reset search variables
        controller.searchSegment = Ember.A();
    },

    actions: {
        create_record: function() {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('charge.new-record');

            //verifico che i campi obbligatori siano stati compilati
            this.unique = controller.newName !== null && controller.newName.length > 1;

            (controller.newName !== null && controller.newName.length > 1 ? $('span#1.input-group-addon').removeClass('alert-danger') : $('span#1.input-group-addon').addClass('alert-danger'));

            if ( this.unique ) {

                var newCharge = this.get('store').createRecord('charge', {
                    name: controller.newName,
                    currency: controller.newCurrency,
                    available: controller.newAvailable,
                    visibility: 'private'
                });

                if( controller.searchSegment.get('length') ){
                    newCharge.set('segment', controller.searchSegment );
                }

                this.store.find('company', app_controller.company).then(function(company){
                    newCharge.set('company', company).save().then(function(val){

                        app_controller.autocompleteCharge.pushObject(val);

                        self.transitionTo( 'charge/main', val.id );
                        //SUCCESS
                        new PNotify({
                            title: 'Saved',
                            text: 'You successfully saved stamp.',
                            type: 'success',
                            delay: 1000
                        });

                        controller.set('newName', null);
                        controller.set('newCurrency', null);
                        controller.set('newAvailable', true);
                        controller.set('searchSegment', []);

                    }, function(){
                        //NOT SAVED
                        new PNotify({
                            title: 'Not saved',
                            text: 'A problem has occurred.',
                            type: 'error',
                            delay: 2000
                        });
                    });
                });
            } else {
                //WARNING
                new PNotify({
                    title: 'Attention',
                    text: 'Please check if required fields have been entered.',
                    type: 'error',
                    delay: 2000
                });
            }
        }
    }
});
