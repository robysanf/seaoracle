import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('booking.new-record');

        //filter on search port of origin and port of destination in the template
        if( !app_controller.autocompletePoiPort.get('length') ) {
            this.store.findQuery("poi", {tags: "Port", sortOrder:"name"}).then(function(port){
                app_controller.set("autocompletePoiPort", port);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        if( !app_controller.autocompleteCompany.get('length') ) {
            this.store.findQuery("company").then(function(comp){
                app_controller.set("autocompleteCompany", comp);
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        }

        var today = new Date();
        controller.set('dtd', moment(today).format("YYYY-MM-DD"));

        //reset search variables
        controller.set('searchAgency', null);
        controller.set('searchPortOrigin', null);
        controller.set('searchPortDestination', null);
        controller.set('searchCompany', null);
        controller.set('searchConsignee', null);
        controller.set('searchShipper', null);
        controller.set('searchNotify', null);
        controller.set('searchCustomManifestHandler', null);
    },

    actions: {
        cancel: function(){
            this.transitionTo('dashboard/main');
        },

        /*      NEW BOOKING
         * *******************************************************************************************************/
        save: function( _btn, state ){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('booking.new-record'),
                clientDetList=null, agencyDetList=null, shipperDetList= null, consigneeDetList= null, notifyDetList=null, finalDest = null,
                dtd = new Date(), dta = new Date();

            var data = this.get('controller').getProperties('finalDestination', 'dtd', 'dta', 'currency');

            if(data.finalDestination) {
                finalDest = data.finalDestination;
            }

//          *** GET client, shipper, consignee, notify details
            if( controller.searchCompany !== "" && controller.searchCompany !== null ){
                if(controller.searchCompany.get("name")){
                    clientDetList = controller.searchCompany.get("name");
                }
                if(controller.searchCompany.get("street")){
                    clientDetList = clientDetList + ", " + controller.searchCompany.get("street");
                }
                if(controller.searchCompany.get("city")){
                    clientDetList = clientDetList + ", " + controller.searchCompany.get("city");
                }
                if(controller.searchCompany.get("country")){
                    clientDetList = clientDetList + ", " + controller.searchCompany.get("country");
                }
                if(controller.searchCompany.get("vat")){
                    clientDetList = clientDetList + ", " + controller.searchCompany.get("vat");
                }
            }

            if( controller.searchAgency !== "" && controller.searchAgency !== null ){
                if(controller.searchAgency.get("name")){
                    agencyDetList = controller.searchAgency.get("name");
                }
                if(controller.searchAgency.get("street")){
                    agencyDetList = agencyDetList + ", " + controller.searchAgency.get("street");
                }
                if(controller.searchAgency.get("city")){
                    agencyDetList = agencyDetList + ", " + controller.searchAgency.get("city");
                }
                if(controller.searchAgency.get("country")){
                    agencyDetList = agencyDetList + ", " + controller.searchAgency.get("country");
                }
                if(controller.searchAgency.get("vat")){
                    agencyDetList = agencyDetList + ", " + controller.searchAgency.get("vat");
                }
            }

            if( controller.searchShipper !== "" && controller.searchShipper !== null ){
                if(controller.searchShipper.get("name")){
                    shipperDetList = controller.searchShipper.get("name");
                }
                if(controller.searchShipper.get("street")){
                    shipperDetList = shipperDetList + ", " + controller.searchShipper.get("street");
                }
                if(controller.searchShipper.get("city")){
                    shipperDetList = shipperDetList + ", " + controller.searchShipper.get("city");
                }
                if(controller.searchShipper.get("country")){
                    shipperDetList = shipperDetList + ", " + controller.searchShipper.get("country");
                }
                if(controller.searchShipper.get("vat")){
                    shipperDetList = shipperDetList + ", " + controller.searchShipper.get("vat");
                }
            }

            if( controller.searchConsignee !== "" && controller.searchConsignee !== null ){
                if(controller.searchConsignee.get("name")){
                    consigneeDetList = controller.searchConsignee.get("name");
                }
                if(controller.searchConsignee.get("street")){
                    consigneeDetList = consigneeDetList + ", " + controller.searchConsignee.get("street");
                }
                if(controller.searchConsignee.get("city")){
                    consigneeDetList = consigneeDetList + ", " + controller.searchConsignee.get("city");
                }
                if(controller.searchConsignee.get("country")){
                    consigneeDetList = consigneeDetList + ", " + controller.searchConsignee.get("country");
                }
                if(controller.searchConsignee.get("vat")){
                    consigneeDetList = consigneeDetList + ", " + controller.searchConsignee.get("vat");
                }
            }

            if( controller.searchNotify !== "" && controller.searchNotify !== null ){
                if(controller.searchNotify.get("name")){
                    notifyDetList = controller.searchNotify.get("name");
                }
                if(controller.searchNotify.get("street")){
                    notifyDetList = notifyDetList + ", " + controller.searchNotify.get("street");
                }
                if(controller.searchNotify.get("city")){
                    notifyDetList = notifyDetList + ", " + controller.searchNotify.get("city");
                }
                if(controller.searchNotify.get("country")){
                    notifyDetList = notifyDetList + ", " + controller.searchNotify.get("country");
                }
                if(controller.searchNotify.get("vat")){
                    notifyDetList = notifyDetList + ", " + controller.searchNotify.get("vat");
                }
            }


//          *** CHECK all values are not null : Date of Departure, Port of Origin, Port of Destination, Currency, Client
            if(data.dtd &&
                data.currency !== '' &&
                (controller.searchPortOrigin !== '' && controller.searchPortOrigin !== null) &&
                (controller.searchPortDestination !== '' && controller.searchPortDestination !== null) //&&
            //(controller.searchCompany !== '' && controller.searchCompany !== null)
                ){
                $('div#1.alert.alert-danger').css('display', 'none');

//              *** CHECK dtd <= dta FIXME: not good. there isn't the check if the date are less than today
//                if(data.dtd <= data.dta){
                $('div#2.alert.alert-danger').css('display', 'none');

//                  *** SET dta and dtd
//                var arrayDtd = data.dtd.split("-");    //year - month - day
//                dtd.setProperties({year: arrayDtd[0], month: arrayDtd[1]-1, day: arrayDtd[2]});


//                  *** CREATE new booking
                var booking = this.get('store').createRecord('booking',  {
                    clientDetail: clientDetList,
                    shipper: controller.searchShipper,
                    shipperDetail: shipperDetList,
                    consignee: controller.searchConsignee,
                    consigneeDetail: consigneeDetList,
                    notify: controller.searchNotify,
                    notifyDetail: notifyDetList,
                    customManifestHandler: controller.searchCustomManifestHandler,
                    origin: controller.searchPortOrigin,
                    destination: controller.searchPortDestination,
                    dtd: data.dtd,
                    state: state,
                    chargeMode: 'PP',
                    finalDestination: finalDest,
                    currency: data.currency,
                    term: controller.term,
                    acknowledge: 'NaN',
                    visibility: 'private'
                });

                if(data.dta !== undefined && data.dta !== ''){
//                    var arrayDta = data.dta.split("-");
//                    dta.setProperties({year: arrayDta[0], month: arrayDta[1]-1, day: arrayDta[2]});
                    booking.set('dta', data.dta);
                }

                self.store.find('company', app_controller.company).then(function(company){
                    if( app_controller.companyType === 'admin' ){
                        if( controller.searchAgency !== "" && controller.searchAgency !== null ) {
                            booking.set('agency', controller.searchAgency);
                            booking.set('agencyDetail', agencyDetList);
                        }
                        if( controller.searchCompany !== "" && controller.searchCompany !== null ) {
                            booking.set('client', controller.searchCompany);

                            if(controller.searchCompany.get("name")){
                                clientDetList = controller.searchCompany.get("name");
                            }
                            if(controller.searchCompany.get("street")){
                                clientDetList = clientDetList + ", " + controller.searchCompany.get("street");
                            }
                            if(controller.searchCompany.get("city")){
                                clientDetList = clientDetList + ", " + controller.searchCompany.get("city");
                            }
                            if(controller.searchCompany.get("country")){
                                clientDetList = clientDetList + ", " + controller.searchCompany.get("country");
                            }
                            if(controller.searchCompany.get("vat")){
                                clientDetList = clientDetList + ", " + controller.searchCompany.get("vat");
                            }

                            booking.set('clientDetail', clientDetList);
                        }
                    }else{
                        if(state === 'request'){
                            if( controller.searchAgency !== "" && controller.searchAgency !== null ) {
                                booking.set('agency', controller.searchAgency);
                                booking.set('agencyDetail', agencyDetList);
                            }
                            booking.set('client', company);

                            if(company.get("name")){
                                clientDetList = company.get("name");
                            }
                            if(company.get("street")){
                                clientDetList = clientDetList + ", " + company.get("street");
                            }
                            if(company.get("city")){
                                clientDetList = clientDetList + ", " + company.get("city");
                            }
                            if(company.get("country")){
                                clientDetList = clientDetList + ", " + company.get("country");
                            }
                            if(company.get("vat")){
                                clientDetList = clientDetList + ", " + company.get("vat");
                            }

                            //clientDetList =  company.get("name") + ", " + company.get("street") + ", " + company.get("city") + ", " + company.get("country")  + ", " + company.get("vat");
                            booking.set('clientDetail', clientDetList);

                        } else {
                            booking.set('agency', company);

                            if(company.get("name")){
                                agencyDetList = company.get("name");
                            }
                            if(company.get("street")){
                                agencyDetList = agencyDetList + ", " + company.get("street");
                            }
                            if(company.get("city")){
                                agencyDetList = agencyDetList + ", " + company.get("city");
                            }
                            if(company.get("country")){
                                agencyDetList = agencyDetList + ", " + company.get("country");
                            }
                            if(company.get("vat")){
                                agencyDetList = agencyDetList + ", " + company.get("vat");
                            }

                            //agencyDetList =  company.get("name") + ", " + company.get("street") + ", " + company.get("city") + ", " + company.get("country")  + ", " + company.get("vat");
                            booking.set('agencyDetail', agencyDetList);
                            booking.set('client', controller.searchCompany);
                            booking.set('clientDetail', clientDetList);
                        }
                    }

                    booking.set('company', company).save().then(function(promise){
                        promise.reload().then(function(val){

                            _btn.stop();
                            //SUCCESS
                            new PNotify({
                                title: 'Saved',
                                text: 'You successfully saved new booking.',
                                type: 'success',
                                delay: 1000
                            });

                            controller.set('tabList_details', false);
                            controller.set('tabList_freightPlan', false);
                            controller.set('tabList_revenues', false);
                            controller.set('tabList_container', false);
                            controller.set('tabList_roro', false);
                            controller.set('tabList_bb', false);
                            controller.set('tabList_itemStatus', false);
                            controller.set('tabList_files', false);
                            controller.set('bookingMain_record', val);
                            controller.set('term', '');

                            self.transitionTo('booking/main', promise);
                            self.get('controller').set('finalDestination', null);
                            self.get('controller').set('dtd', null);
                            self.get('controller').set('dta', null);
                        });
                    }, function(){
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

            } else {
                $('div#1.alert.alert-danger').css('display', 'inline-block');
            }
        }
    }
});
