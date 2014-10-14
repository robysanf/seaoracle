import Ember from 'ember';

export default Ember.View.extend({
    model_val:[],
    val:[],

    focusOut: function() {
        var self = this, data = self.getProperties();

        if(this.model_val === 'company') {
            data.name = this.val;
            $.post('api/verifyCompany', data).then(function(response){
                if ( !response.success ) {
                    self.get('controller').set('name', null);
                    new PNotify({
                        title: 'Attention',
                        text: 'A company with this name already exists, please change it.',
                        type: 'info'
                    });
                }
            }, function(){
                new PNotify({
                    title: 'Error',
                    text: 'A problem was occurred.',
                    type: 'error'
                });
            });
        }


        if(this.model_val === 'user') {
            data.username = this.val;
            $.post('api/verifyUser', data).then(function(response){
                if ( !response.success ) {
                    self.get('controller').set('username', null);
                    new PNotify({
                        title: 'Attention',
                        text: 'A user with this username already exists, please change it.',
                        type: 'info'
                    });
                }
            }, function(){
                new PNotify({
                    title: 'Error',
                    text: 'A problem was occurred.',
                    type: 'error'
                });
            });
        }


    }
});

