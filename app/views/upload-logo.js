import Ember from 'ember';

export default Ember.View.extend({
    mod: null,
    view: this,
    value1:[],

    didInsertElement: function() {
        var view = this, controller = this.get('controller'),
            formData = new FormData(),formData_size = null;

        //recupero il nome del file da mettere nell'input per l'utente
        $(document).on('change', '.btn-logo :file', function() {
            var input = $(this),
                numFiles = input.get(0).files ? input.get(0).files.length : 1,
                label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
            input.trigger('fileselect', [numFiles, label]);

            //recupero i dati sul file da mandare al server
            if ( input.get(0).files ) {
                formData_size = input.get(0).files[0].size;
                formData.append("file", input.get(0).files[0]);
            }
        });

        $(document).ready( function() {
            //inserisco il nome del file nell'input per l'utente
            $('.btn-logo :file').on('fileselect', function(event, numFiles, label) {
                var input = $(this).parents('.input-group').find(':text'),
                    log = numFiles > 1 ? numFiles + ' files selected' : label;

                if( input.length ) {
                    input.val(log);
                } else {
                    if( log ) { alert(log); }
                }
            });

            //mando i dati al server
            $('#button_upload_logo').bind('click', actionPost);
        });

        function actionPost() {
            if($("#selected_logo").val() !== ''){
                if(formData_size > '10000000') {     //verifico che il file sia meno grande di 10 Mega-Byte
                    new PNotify({
                        title: 'Warning',
                        text: 'The file must be smaller than 10 MB.',
                        type: 'info',
                        delay: 4000
                    });
                } else {
                    var self = this, $btn = $(this);
                    $btn.button('loading');

                    //https://test.zenointelligence.com/seaforward/
                    $.ajax({
                        url: 'api/files?token='+ view.get('controller.controllers.application').token +'&entity='+this.value+'&type=logo',
                        type: "POST",
                        data: formData,
                        processData: false,
                        contentType: false
                    }).then(function(){
                        formData = new FormData();
                        $("#selected_logo").val(" ");
                        controller.send('update_filesList', self.value, view.value1, $btn, true);
                    }, function(){
                        $btn.button('reset');
                        new PNotify({
                            title: 'Error',
                            text: 'A problem was occurred.',
                            type: 'error',
                            delay: 4000
                        });
                    });
                }
            }
        }
    }
});

