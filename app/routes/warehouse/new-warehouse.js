import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, app_controller = self.controllerFor('application');

        if( app_controller.autocompletePoiWarehouse.get('length') === 0 ) {
            self.store.findQuery("poi", {tags: "Warehouse", sortBy:"name"}).then(function(ware){
                app_controller.set("autocompletePoiWarehouse", ware);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

//        //reset del campo di ricerca in caso di reload della pagina
//        controller.companyOwned = Ember.A();
    },


    actions: {
        createWarehouse: function( _btn ) {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('warehouse.new-warehouse');
            var data = controller.getProperties(
                'newName',
                'newStreet',
                'newCity',
                'newZipCode',
                'newProvince',
                'newCountry',
                'newEmail',
                'newPhone',
                'newNotifyParty'//,
                //'newVisibility'
            );

            //verifico che i campi obbligatori siano stati compilati
            (data.newName !== null && data.newName.length > 1 ? $('span#1.input-group-addon').removeClass('alert-danger') : $('span#1.input-group-addon').addClass('alert-danger'));

            if (data.newName !== null && data.newName.length > 1) {
                var tags = [];
                tags.push("Warehouse");
                var newWarehouse = this.store.createRecord('poi', {
                    name: data.newName,
                    street: data.newStreet,
                    city: data.newCity,
                    zipCode: data.newZipCode,
                    province: data.newProvince,
                    country: data.newCountry,
                    email: data.newEmail,
                    phone: data.newPhone,
                    notifyParty: data.newNotifyParty,
                    tags: tags,
                    visibility: 'private'//data.newVisibility
                });

                this.store.find('company', app_controller.company).then(function(company){
                    newWarehouse.set('company', company).save().then(function(newWarehouse) {
                        app_controller.autocompletePoiWarehouse.pushObject(newWarehouse);
                        app_controller.autocompletePoi.pushObject(newWarehouse);

                        //self.newWarehouseId = newWarehouse.id;
                        controller.set('newName', null);
                        controller.set('newStreet', null);
                        controller.set('newCity', null);
                        controller.set('newZipCode', null);
                        controller.set('newProvince', null);
                        controller.set('newCountry', null);
                        controller.set('newEmail', null);
                        controller.set('newPhone', null);
                        controller.set('newNotifyParty', null);
                        _btn.stop();
                        //SAVED
                        new PNotify({
                            title: 'Saved',
                            text: 'You successfully saved warehouse.',
                            type: 'success',
                            delay: 1000
                        });

                    }, function() {
                        _btn.stop();
                        //NOT SAVED
                        new PNotify({
                            title: 'Not saved',
                            text: 'A problem has occurred.',
                            type: 'error',
                            delay: 2000
                        });
                    });
                });
            }
            else {
                _btn.stop();
                //WARNING
                new PNotify({
                    title: 'Attention',
                    text: 'please check if required fields have been entered.',
                    type: 'error',
                    delay: 2000
                });
            }
        }
    }
});
