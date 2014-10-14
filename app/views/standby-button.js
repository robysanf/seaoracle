import Ember from 'ember';

export default Ember.View.extend({
    classNames: ['standby-button'],
    tagName: 'button',
    attributeBindings : ['data-style'],

    action_name: [],
    arg1: [],
    arg2: [],

    didInsertElement: function() {
        var view = this;
        var controller = this.get('controller');

        Ladda.bind( 'input[type=button]' );

        $(document).ready(function() {
            $('#form-submit').bind('click', loading);
        });

        function loading( e ) {
            e.preventDefault();
            var _btn = Ladda.create(this);
            _btn.start();
            controller.send(view.action_name, _btn, view.arg1, view.arg2);
        }
    }
});
