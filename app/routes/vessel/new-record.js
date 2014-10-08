import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var self = this, app_controller = self.controllerFor('application');

        if( !app_controller.autocompleteVessel.get('length') ) {
            self.store.findQuery("vessel").then(function(vessel){
                app_controller.set("autocompleteVessel", vessel);
            });
        }
    },

    actions: {
        create_record: function() {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('vessel.new-record');

            //verifico che i campi obbligatori siano stati compilati
            this.unique = controller.newName !== null && controller.newName.length > 1 &&
                controller.newNickname !== null && controller.newNickname.length > 1;

            (controller.newName !== null && controller.newName.length > 1 ? $('span#1.input-group-addon').removeClass('alert-danger') : $('span#1.input-group-addon').addClass('alert-danger'));
            (controller.newNickname !== null && controller.newNickname.length > 1 ? $('span#2.input-group-addon').removeClass('alert-danger') : $('span#2.input-group-addon').addClass('alert-danger'));

            if (this.unique) {

                var newVessel = this.store.createRecord('vessel', {
                    name: controller.newName,
                    nickname: controller.newNickname,
                    payload: controller.newPayload,
                    length: controller.newLength,
                    width: controller.newWidth,
                    visibility: 'private'
                });

                this.store.find('company', app_controller.company).then(function(company){
                    newVessel.set('company', company).save().then(function(vessel){

                        app_controller.autocompleteVessel.pushObject(vessel);

                        //SUCCESS
                        new PNotify({
                            title: 'Saved',
                            text: 'You successfully saved stamp.',
                            type: 'success',
                            delay: 1000
                        });

                        controller.set('newVisibility', null);
                        controller.set('newName', null);
                        controller.set('newNickname', null);
                        controller.set('newPayload', null);
                        controller.set('newLength', null);
                        controller.set('newWidth', null);

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
