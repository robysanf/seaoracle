import Ember from 'ember';

export default Ember.View.extend({
    action_name: [],
    record: [],

    didInsertElement: function() {
        var view = this;
        var controller = this.get('controller');

        $(document).ready(function(event) {
            $('#button_save').bind('click', loading);
        });

        function loading(event) {
            var $btn = $(this);
            $btn.button('loading');

            controller.send(view.action_name, view.record, $btn);

            // Then whatever you actually want to do i.e. submit form
            // After that has finished, reset the button state using
//            setTimeout(function () {
//                $btn.button('reset');
//            }, 1000);
        }
    }
});
