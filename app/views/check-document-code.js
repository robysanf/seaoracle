import Ember from 'ember';

export default Ember.View.extend({
    type:[],
    val:[],
    val1:[],
    token: [],
    focusOut: function() {
        var self = this, data = self.getProperties(), controller = this.get('controller');

        if(this.val !== '' && this.val !== null){

            data.val = this.val;
            data.type = this.type;
            $.post('api/custom/checkDocumentCode?token=' + this.token, data).then(function(response){
                if (response.success) {

                } else {
                    controller.set('name', null);

                    if( self.val === '' || self.val === null ){
                        new PNotify({
                            title: 'Attention',
                            text: 'You must compile the code field.',
                            type: 'info'
                        });
                    }
                    else {
                        new PNotify({
                            title: 'Attention',
                            text: 'A document with this code already exists, please change it.',
                            type: 'warning'
                        });
                    }
                }
            }, function(){
                new PNotify({
                    title: 'Attention',
                    text: 'A problem occurred.',
                    type: 'info'
                });
            });

        } else {
            new PNotify({
                title: 'Attention',
                text: 'Code field must be entered.',
                type: 'info'
            });
        }
    }
});

