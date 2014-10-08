export default {
    name: 'inject-store-into-autocomplete',
    after: "store",

    initialize: function(container, application) {
        container.typeInjection('component', 'store', 'store:main');
        application.inject('component:auto-complete', 'store', 'store:main');
        application.inject('component:auto-suggest', 'store', 'store:main');
    }
};


String.prototype.humanize = function() {
    var str;
    str = this.replace(/_id$/, "").replace(/_/g, ' ').replace(/([a-z\d]*)/gi, function(match) {
        return match;//.toLowerCase();
    });
    return str.split('.').pop().charAt(0).toLowerCase() + str.split('.').pop().slice(1);
};
