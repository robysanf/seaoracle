import Ember from 'ember';

export default Ember.View.extend({
    classNames: ['button-disabled-onClick'],
    tagName: 'button',
    attributeBindings : ['disabled'],

    plan: [],
    company: [],
    user: [],


    click: function () {
        var controller = this.get('controller'), $btn = $(this)[0];
        $btn.set('disabled', true);

        controller.send('new_refill', this.plan, this.company, this.user, $btn);
    }

});
