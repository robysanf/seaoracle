import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, app_controller = self.controllerFor('application');

        if( !app_controller.autocompletePoiPort.get('length') ){
            self.store.findQuery("poi", {tags: "Port"}).then(function(ware){
                app_controller.set("autocompletePoiPort", ware);
            });
        }
    },

    actions: {
        createNewPort: function( _btn ){
            var self = this, controller = self.controllerFor('port.new-poi'), app_controller = self.controllerFor('application'),
                country = null, iso3 = null;

            if( controller.newCountry ){
                country = controller.newCountry.country;
                iso3 = controller.newCountry.iso3;
            }

            var str_unLocode = controller.newUnLocode.replace(/[^A-Z]/gi, "").toUpperCase();

            this.unique = controller.newName !== null && controller.newName.length > 1 &&
                controller.newUnLocode !== null && str_unLocode.length === 5 &&
                country !== null;

            (controller.newName !== null && controller.newName.length > 1 ? $('span#1.input-group-addon').removeClass('alert-danger') : $('span#1.input-group-addon').addClass('alert-danger'));
            (controller.newUnLocode !== null && str_unLocode.length === 5  ? $('span#2.input-group-addon').removeClass('alert-danger') : $('span#2.input-group-addon').addClass('alert-danger'));
            (country !== null ? $('span#3.input-group-addon').removeClass('alert-danger') : $('span#3.input-group-addon').addClass('alert-danger'));

            if (this.unique) {

                var tags = []; tags.push("Port");
                var poi_port = this.store.createRecord('poi', {
                    name: controller.newName,
                    unLocode: str_unLocode,
                    country: country,
                    countryIso3: iso3,
                    tags: tags,
                    visibility: 'public'//data.newVisibility
                });

                poi_port.save().then(function(poi_port) {

                    app_controller.autocompletePoiPort.pushObject(poi_port);
                    app_controller.autocompletePoi.pushObject(poi_port);
                    //self.newPortId = poi_port.id;
                    controller.set('newVisibility', 'public');
                    controller.set('newName', null);
                    controller.set('newUnLocode', null);
                    controller.set('newCountry', null);

                    _btn.stop();
                    new PNotify({
                        title: 'Saved',
                        text: 'You successfully saved port.',
                        type: 'success',
                        delay: 1000
                    });

                    //self.transitionTo('ports.port', poi_port.id);

                }, function() {
                    _btn.stop();
                    new PNotify({
                        title: 'Not saved',
                        text: 'A problem has occurred.',
                        type: 'error',
                        delay: 2000
                    });
                });
            }
            else {
                //WARNING
                _btn.stop();
                new PNotify({
                    title: 'Attention',
                    text: 'Please check if required fields have been entered..',
                    type: 'error',
                    delay: 2000
                });
            }
        }
    }
});
