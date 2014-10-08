import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var self = this, app_controller = self.controllerFor('application');

        if( !app_controller.autocompleteStamp.get('length') ){
            self.store.findQuery("stamp").then(function(val){
                app_controller.set("autocompleteStamp", val);
            });
        }
    },

    actions: {
        create_record: function() {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('stamp.new-stamp'),

            attr = this.get('controller').getProperties(
                'newName',
                'newType',
                'newValue',
                'newDescription'
            );

            //verifico che i campi obbligatori siano stati compilati
            (attr.newName !== null && attr.newName.length > 1 ? $('span#1.input-group-addon').removeClass('alert-danger') : $('span#1.input-group-addon').addClass('alert-danger'));

            if (attr.newName !== null && attr.newName.length > 1) {

                var newStamp = this.get('store').createRecord('stamp', {
                    name: attr.newName,
                    type: attr.newType,
                    value: attr.newValue,
                    description: attr.newDescription,
                    visibility: 'private'
                });

                if(controller.isDocCM === true){
                    newStamp.set('docTypes', ['docBL', 'docCM']);
                } else {
                    newStamp.set('docTypes', ['docBL']);
                }


                newStamp.save().then(function(promise){

                    app_controller.autocompleteStamp.pushObject(promise);

                        //SUCCESS
                        new PNotify({
                            title: 'Saved',
                            text: 'You successfully saved stamp.',
                            type: 'success',
                            delay: 1000
                        });
                        controller.set('newName', null);
                        controller.set('newType', null);
                        controller.set('newValue', null);
                        controller.set('newDescription', null);
                        controller.set('isDocCM', true);

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
                    text: 'Please check if required fields have been entered.',
                    type: 'error',
                    delay: 2000
                });
            }

        }
    }
});
