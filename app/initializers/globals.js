import Ember from 'ember';

export default {
    name: "Globals",

    initialize: function(container, application) {
        container.typeInjection('component', 'store', 'store:main');
        application.register('global:variables', globals, {singleton: true});
        application.inject('controller', 'globals', 'global:variables'); //mi serve per inserire il valore del token al login
        application.inject('adapter', 'globals', 'global:variables');   //mi serve per inserire il token nell'url delle chiamate al server
    }
};

var globals = Ember.Object.extend({
    token: localStorage['token']
});