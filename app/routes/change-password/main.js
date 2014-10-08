import Ember from 'ember';

export default Ember.Route.extend({
    model: function(user){
        return this.store.find('user', user.user_id);
    },

    actions: {
        check_pwd: function(){
            var self = this, app_controller = self.controllerFor('application');
            var data = this.getProperties();

            data.user = app_controller.username;
            data.token = app_controller.token;
            data.curr_pwd = self.controller.curr_pwd;
            data.new_pwd = self.controller.new_pwd;
            data.confirm_pwd = self.controller.confirm_pwd;


            if(data.new_pwd == data.confirm_pwd){
                //spedisco un post
                //https://test.zenointelligence.com/seaforward/
                $.post('api/custom/changePassword?token=' + app_controller.token, data).then(function(response){
                    if (response.success) {
                        new PNotify({
                            title: 'Well done',
                            text: 'You successfully changed password.',
                            type: 'success',
                            delay: 2000
                        });

                        self.controller.set('curr_pwd', null);
                        self.controller.set('new_pwd', null);
                        self.controller.set('confirm_pwd', null);
                        //self.set('successMessage', 'Well done: You successfully changed password.');
                    }
                }, function(){
                    new PNotify({
                        title: 'Warning',
                        text: 'Password incorrect, please check it.',
                        type: 'error',
                        delay: 2000
                    });
                    self.controller.set('curr_pwd', null);
                    self.controller.set('new_pwd', null);
                    self.controller.set('confirm_pwd', null);
                    //self.set('errorMessage', 'Warning: username or password incorrect, please check them.');
                });
            }else{
                new PNotify({
                    title: 'Warning',
                    text: 'The new passwords do not match, please check them.',
                    type: 'error',
                    delay: 2000
                });
                self.controller.set('curr_pwd', null);
                self.controller.set('new_pwd', null);
                self.controller.set('confirm_pwd', null);
                //genero eccezione
                //self.set('errorMessage', 'Warning: username or password incorrect, please check them.');
            }

        }
    }
});
