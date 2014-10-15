import Ember from 'ember';

export default Ember.View.extend({
    value1:[],

    didInsertElement: function() {
        var formData = new FormData(),formData_size = null, view= this;

        $(document).on('change', '.btn-file :file', function() {
            var input = $(this),
                numFiles = input.get(0).files ? input.get(0).files.length : 1,
                label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
            input.trigger('fileselect', [numFiles, label]);

            if ( input.get(0).files ) {
                formData_size = input.get(0).files[0].size;
                formData.append("file", input.get(0).files[0]);
            }
        });

        $(document).ready( function() {
            $('.btn-file :file').on('fileselect', function(event, numFiles, label) {

                var input = $(this).parents('.input-group').find(':text'),
                    log = numFiles > 1 ? numFiles + ' files selected' : label;

                if( input.length ) {
                    input.val(log);
                } else {
                    if( log ) { alert(log); }
                }
            });

            $('#button_upload_exel').bind('click', actionPost);
        });

        function actionPost() {
            if($("#selected_exel").val() !== ''){

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
                        url: 'api/custom/readModelExcel?token='+view.get('controller.controllers.application').token+'&model=equipment',
                        type: "POST",
                        data: formData,
                        processData: false,
                        contentType: false
                    }).then(function(){
                        $("#selected_exel").val(" ");
                        formData = new FormData();
                        $btn.button('reset');
                        new PNotify({
                            title: 'Success',
                            text: 'The exel was successfully upload.',
                            delay: 4000
                        });
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

