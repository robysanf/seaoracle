import Ember from 'ember';

export default Ember.View.extend({
    classNames: ['button-disabled-onClick'],
    tagName: 'button',
    attributeBindings : ['disabled'],

    action: [],
    arg1: [],
    arg2: [],
    arg3: [],


    click: function () {
        var controller = this.get('controller'), $btn = $(this)[0];
        $btn.set('disabled', true);

        controller.send(this.action, this.arg1, this.arg2, this.arg3, $btn);
    }

});
