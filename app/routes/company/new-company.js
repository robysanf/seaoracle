import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, controller = self.controllerFor('company.new-company'), app_controller = self.controllerFor('application');

        if( !app_controller.autocompleteCompany.get('length') ) {
            self.store.findQuery("company").then(function(val){
                app_controller.set("autocompleteCompany", val);
            });
        }

        if( !app_controller.autocompletePoiPort.get('length') ) {
            self.store.findQuery("poi", {tags: "Port"}).then(function(val){
                app_controller.set("autocompletePoiPort", val);
            });
        }

        if( !app_controller.autocompleteStamp.get('length') ) {
            self.store.findQuery("stamp").then(function(val){
                app_controller.set("autocompleteStamp", val);
            });
        }

        controller.set('searchStamp', []);
        controller.set('searchReferringPort', []);

    },
    actions: {
        create_record: function(){
            var self = this, controller = self.controllerFor('company.new-company'), app_controller = self.controllerFor('application');
            var allEmail = [], country = null, iso3 = null;
            //this.store.unloadAll('company');
            var data = controller.getProperties(
                'newName',
                'newVatNumber',
                'newStreet',
                'newCity',
                'newPostCode',
                'newProvince',
                'newCountry',
                'newEmail1',
                'newEmail2',
                'newEmail3',
                'newEmail4',
                'newPhone',
                'newFax'//,
//                'newAgentCommission',
//                'newBrokerage',
//                'newHandlingFee'
            );

            this.unique = data.newName != null && data.newName.length > 1;

            if ( !data.newVatNumber ) {
                data.newVatNumber = null;
            }

            if(data.newEmail1 != null && data.newEmail1.length > 1){
                allEmail.push(data.newEmail1);
            }
            if(data.newEmail2 != null && data.newEmail2.length > 1){
                allEmail.push(data.newEmail2);
            }
            if(data.newEmail3 != null && data.newEmail3.length > 1){
                allEmail.push(data.newEmail3);
            }
            if(data.newEmail4 != null && data.newEmail4.length > 1){
                allEmail.push(data.newEmail4);
            }

            // if data = null --> warning else return to default state
            ( data.newName != null && data.newName.length > 1  ? $('span#1.input-group-addon').removeClass('alert-danger') : $('span#1.input-group-addon').addClass('alert-danger'));

            if (this.unique) {
                //REMOVE THE WARNING
                //$('span.input-group-addon').removeClass('alert-danger');
                //$('div.alert.alert-danger').css('display', 'none');
                if( data.newCountry ){
                    country = data.newCountry.country;
                    iso3 = data.newCountry.iso3;
                }

                var newCompany = this.store.createRecord('company', {
                    name: data.newName,
                    vat: data.newVatNumber,
                    street: data.newStreet,
                    emails: allEmail,
                    city: data.newCity,
                    zipCode: data.newPostCode,
                    province: data.newProvince,
                    country: country,
                    countryIso3: iso3,
                    fax: data.newFax,
                    phone: data.newPhone,
                    type: 'none'
                });


                if( controller.searchStamp.get('length') !== 0 ){
                    newCompany.set('stamp', controller.searchStamp);
                }
                if( controller.searchReferringPort.get('length') !== 0 ){
                    newCompany.set('referringPort', controller.searchReferringPort );
                }

                if( app_controller.companyType === 'shipowner' ){
                    newCompany.set('visibility', 'public');
                } else {
                    newCompany.set('visibility', 'private');
                }
                this.store.find('company', app_controller.company).then(function(company){

                    newCompany.set('parentCompany', company).save().then(function(val) {
                        app_controller.autocompleteCompany.pushObject(val);

                        self.transitionTo('company/main', val.get('id'));

                        controller.newCompany = val;
                        controller.set('newName', null);
                        controller.set('newVatNumber', null);
                        controller.set('newStreet', null);
                        controller.set('newCity', null);
                        controller.set('newPostCode', null);
                        controller.set('newProvince', null);
                        controller.set('newCountry', null);
                        controller.set('newEmail1', null);
                        controller.set('newEmail2', null);
                        controller.set('newEmail3', null);
                        controller.set('newEmail4', null);
                        controller.set('newPhone', null);
                        controller.set('newFax', null);


                        controller.set('searchStamp', []);
                        controller.set('searchReferringPort', []);

                        //SUCCESS
                        new PNotify({
                            title: 'Saved',
                            text: 'You successfully saved company.',
                            type: 'success',
                            delay: 1000
                        });



                    }, function() {
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
