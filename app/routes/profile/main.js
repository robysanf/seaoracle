import Ember from 'ember';

export default Ember.Route.extend({
    model: function(user){
        return this.store.find('user', user.user_id);
    },

    actions: {
        manager_user: function(action){
            var self = this, app_controller = this.controllerFor('application');

            switch (action) {
                case 'put':
                    this.store.find('user', app_controller.userId).then(function(val){
                        val.save().then(success, error);
                    });
                    break;

                case 'changeMode_edit':
                    self.controller.set('is_viewMode', false);
                    break;
            }


            var success = function(){
                //SUCCESS
                self.controller.set('is_viewMode', true);

                new PNotify({
                    title: 'Saved',
                    text: 'You successfully saved user profile.',
                    type: 'success',
                    delay: 1000
                });
            };
            var error = function(){
                //NOT SAVED
                new PNotify({
                    title: 'Not saved',
                    text: 'A problem has occurred.',
                    type: 'error',
                    delay: 2000
                });
            };

        }
    }
});
