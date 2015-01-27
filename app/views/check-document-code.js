import Ember from 'ember';

export default Ember.View.extend({
    type:[],
    val:[],
    val1:[],
    token: [],
    voyage: [],
    id: [],

    focusOut: function() {
        var self = this, data = self.getProperties(), controller = this.get('controller');

        if(this.val !== '' && this.val !== null){

            data.val = this.val;
            data.type = this.type;
            data.voyage = this.voyage;

            $.ajax({
                url: 'api/custom/checkDocumentCode/'+self.id+'?token=' + this.token,
                type: 'PUT',
                data: data,
                success: function(response) {},
                error: function() {
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

//            $.put('api/custom/checkDocumentCode?token=' + this.token, data).then(function(response){
//                if (response.success) {
//
//                } else {
//                    controller.set('name', null);
//
//                    if( self.val === '' || self.val === null ){
//                        new PNotify({
//                            title: 'Attention',
//                            text: 'You must compile the code field.',
//                            type: 'info'
//                        });
//                    }
//                    else {
//                        new PNotify({
//                            title: 'Attention',
//                            text: 'A document with this code already exists, please change it.',
//                            type: 'warning'
//                        });
//                    }
//                }
//            }, function(){
//                new PNotify({
//                    title: 'Attention',
//                    text: 'A problem occurred.',
//                    type: 'info'
//                });
//            });

        } else {
            new PNotify({
                title: 'Attention',
                text: 'Code field must be entered.',
                type: 'info'
            });
        }
    }
});

