import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var self = this,  controller = self.controllerFor('company.main');

        //imposto la tab details come default per 'company'
        if( controller.tabList.details !== true &&  controller.tabList.users !== true &&  controller.tabList.files !== true ) {
            controller.set('tabList.details', true);
            controller.set('isView', true);
            controller.set('itemListActive', false);
            controller.set('itemEditActive', false);
        }
    },

    model: function( company ) {
        return this.store.find('company', company.company_id);
    },

    actions: {
        /**
         Gestione della tab navigation in 'your-profile'; rende attiva la tab selezionata dall'utente

         @action setTabs
         @for your-profile/main-page
         @param {string} tab selezionata dall'utente - (company/driver/truck/trailer/clerk)
         */
        setTabs: function( tabToActive ){
            this.controller.set('tabList.details',false);
            this.controller.set('tabList.users',false);
            this.controller.set('tabList.files',false);

            this.controller.set('isView', true);
            this.controller.set('itemListActive', false);
            this.controller.set('itemEditActive', false);

            this.controller.set('tabList.' + tabToActive, true);

        },

        removeEmail: function(nameEmail, id){
            var arrayList = null;
            this.store.find('company', id).then( function(company){
                var emails = company.get('emails');
                emails.forEach(function(item, index) {
                    if(item === nameEmail) {
                        arrayList = emails.removeAt(index);
                    }
                });
                company.set('emails', arrayList);
                //company.save();
            });
        },
        addEmail: function(recordCompany, email) {
            var self = this, emails = [], controller = self.controllerFor('company.main');

            //this.store.find('company', id).then( function(company){
                if(recordCompany.get('emails')){
                    emails = recordCompany.get('emails');
                }
                /*ATTENTION:
                 * use method pushObject;
                 * push doesn't tell the binding to update, but pushObject does.
                 * */
                emails.pushObject(email);
                recordCompany.set('emails', emails).save().then(function() {
                    controller.set('newEmail', null);
                }, function() {
                    //alert("error" );
                });
            //});
        },

        /**
         Gestione della cambio di stato da edit a view. nel caso 'edit --> view' viene fatta una POST del record

         @action change_state
         @for company/main.js
         @param {boolean} true si passa a 'stato === view'; false si passa a 'stato === edit'
         @param {record} entità company di riferimento
         */
        change_state: function( bool, companyRecord ) {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('company.main'),
                iso3 = null;
            controller.set("companyRecord", companyRecord);

            if( bool === true ) {
                //this.store.find('company', id).then( function(company){
                var this_nation = app_controller.nations.filterBy('country',controller.companyRecord.get('country'));
                if( this_nation[0] ){
                    iso3 = this_nation[0].iso3;
                }
                controller.companyRecord.set('countryIso3', iso3).save().then(function(val){

                    app_controller.autocompleteCompany.forEach(function(item, index){
                            if( item ) {
                                var item_id = item.get('id');

                                if( item_id === controller.companyRecord.get('id') ) {
                                    app_controller.autocompleteCompany.removeAt(index);
                                    app_controller.autocompleteCompany.pushObject(val);
                                }
                            }
                        });

                        //SUCCESS
                        new PNotify({
                            title: 'Saved',
                            text: 'You successfully saved new company.',
                            type: 'success',
                            delay: 1000
                        });
                    }, function(){
                        //NOT SAVED
                        new PNotify({
                            title: 'Not saved',
                            text: 'A problem has occurred.',
                            type: 'error',
                            delay: 2000
                        });
                    });
                //});
            }

            this.controller.set('isView', bool);
        },

        goTo: function( val ) {
            var controller = this.controllerFor('company.main');

            controller.set('itemListActive', val);
            controller.set('itemEditActive', val);
        },

        /**
         azione per vedere a layout lo user con i campi modificabili

         @action edit_record
         @for company/main.hbs
         @param {record} entità user di riferimento
         @param {boolean} true - per visualizzare il partial -user-edit.hbs
         */
        edit_record: function( record, bool ) {
            var self = this, controller = self.controllerFor('company.main');

            controller.set("userRecord", record);
            controller.set('itemEditActive', bool);
        },

        /**
         PUT per la modifica di un record di tipo user

         @action editUser
         @for company/partials/-user-edit.hbs
         @param {record} entità user di riferimento
         @param {boolean} false - per tornare a visualizzare la lista di utenti associati alla company
         */
        editUser: function( record, bool ){
            var self = this, controller = self.controllerFor('company.main'),
                firstName = record.get('firstName'), lastName = record.get('lastName'), email = record.get('email');

            // if data = null --> warning else return to default state
            ( firstName !== null && firstName != "" ? $('span#1.input-group-addon').removeClass('alert-danger') : $('span#1.input-group-addon').addClass('alert-danger'));
            ( lastName !== null && lastName != "" ? $('span#2.input-group-addon').removeClass('alert-danger') : $('span#2.input-group-addon').addClass('alert-danger'));
            ( email !== null && email != "" ?  $('span#3.input-group-addon').removeClass('alert-danger') : $('span#3.input-group-addon').addClass('alert-danger'));

            if( firstName !== null && firstName != "" &&
                lastName !== null && lastName != "" &&
                email !== null && email != "" ) {
                controller.set('itemEditActive', bool);
                record.save().then(function(val){
                    val.reload();
                    //SUCCESS
                    new PNotify({
                        title: 'Saved',
                        text: 'You successfully saved user.',
                        type: 'success',
                        delay: 1000
                    });
                });
            } else {
                //WARNING
                new PNotify({
                    title: 'Attention',
                    text: 'please check if required fields have been entered.',
                    type: 'info',
                    delay: 2000
                });
            }

        },

        update_grants: function( record, type ){
            var self = this, controller = self.controllerFor('company.main');

            if( type === "user" ){
                controller.set("userRecord", record);
                controller = controller.userRecord;
            } else {
                controller.set("companyRecord", record);
            }

            controller.get("grants").then(function(grants){
                grants.forEach(function(val){
                    //if(val.isDirty){
                        val.save();
                    //}
                });
            });

//            controller.get("grants").filter(function(recordGrant){
//                recordGrant.save();
//            });
        },

        /**
         setta il tipo di utente come 'User' o 'PowerUser'

         @action typeUser
         @for company/modals/user-special-permission.hbs
         @param {record} entità user di riferimento
         @param {string} U/PU
         */
        typeUser: function( record, type ){
            if( type === "U" ){
                record.get('grants').filterBy('type', 'userType').filter(function(myGrant){
                    myGrant.set("ckPermission", false);
                });
            } else {
                record.get('grants').filterBy('type', 'userType').filter(function(myGrant){
                    myGrant.set("ckPermission", true);
                });
            }
        },

        set_grantsTypology: function( custom, type ){
            var self = this,  controller = self.controllerFor('company.main'), powerUser = true;

            if( type === "user" ){
                if ( controller.userRecord.get('type') === 'user' ){
                    powerUser = false;
                }
                controller = controller.userRecord;
            }

            switch(custom) {
                case 'A':
                    controller.get('grants').filterBy('value', 'booking').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'voyage').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'Global', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'template').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'None', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'equipment').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');       //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'equipmentClassification').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'Global', 'None', 'None');      //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'vessel').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'None', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'document').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');       //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'company').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');       //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'user').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');       //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'shipment').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'None', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'poi').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'port').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'None', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'charge').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'Global', 'Local', 'Local',  'Local');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'region').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'grant').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'Global', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'stamp').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'segment').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'paymentPlan').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'Global', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'freightPlan').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'Global', 'Global', 'Global', 'Global');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'refill').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'Global', 'Local', 'None', 'None');     //new view edit remove
                    });
                    break;
                case 'S':
                    controller.get('grants').filterBy('value', 'booking').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'Global', 'Global', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'voyage').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'template').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'equipment').filter(function(myGrant){
                        if( powerUser ){
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');
                        } else {
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Basic', 'Local');
                        }
                    });
                    controller.get('grants').filterBy('value', 'equipmentClassification').filter(function(myGrant){
                        if( powerUser ){
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');
                        } else {
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Basic', 'Local');
                        }
                    });
                    controller.get('grants').filterBy('value', 'vessel').filter(function(myGrant){
                        if( powerUser ){
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');
                        } else {
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Basic', 'Local');
                        }
                    });
                    controller.get('grants').filterBy('value', 'document').filter(function(myGrant){
                        if( powerUser ){
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');
                        } else {
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Basic', 'Local');
                        }
                    });
                    controller.get('grants').filterBy('value', 'company').filter(function(myGrant){
                        if( powerUser ){
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');
                        } else {
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Basic', 'Local');
                        }
                    });
                    controller.get('grants').filterBy('value', 'user').filter(function(myGrant){
                        if( powerUser ){
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');
                        } else {
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Basic', 'Local');
                        }
                    });
                    controller.get('grants').filterBy('value', 'shipment').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'None', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'poi').filter(function(myGrant){
                        if( powerUser ){
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');
                        } else {
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Basic', 'Local');
                        }
                    });
                    controller.get('grants').filterBy('value', 'port').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'None', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'charge').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'Global', 'Global', 'Global', 'Local');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'region').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'None', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'grant').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'Global', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'stamp').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'segment').filter(function(myGrant){
                        if( powerUser ){
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');
                        } else {
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Basic', 'Local');
                        }
                    });
                    controller.get('grants').filterBy('value', 'paymentPlan').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'Global', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'freightPlan').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'Global', 'Global', 'Global', 'Global');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'refill').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'Global', 'Global', 'None', 'None');     //new view edit remove
                    });
                    break;
                case 'C':
                    controller.get('grants').filterBy('value', 'booking').filter(function(myGrant){
                        if( powerUser ){
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');
                        } else {
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Basic', 'Basic');
                        }
                    });
                    controller.get('grants').filterBy('value', 'voyage').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'Global', 'None', 'None');
                    });
                    controller.get('grants').filterBy('value', 'template').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'None', 'None', 'None');
                    });
                    controller.get('grants').filterBy('value', 'equipment').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'None', 'None', 'None');
                    });
                    controller.get('grants').filterBy('value', 'equipmentClassification').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'Global', 'None', 'None');
                    });
                    controller.get('grants').filterBy('value', 'vessel').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'None', 'None', 'None');
                    });
                    controller.get('grants').filterBy('value', 'document').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'Global', 'None', 'None');
                    });
                    controller.get('grants').filterBy('value', 'company').filter(function(myGrant){
                        if( powerUser ){
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');
                        } else {
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Basic', 'Basic');
                        }
                    });
                    controller.get('grants').filterBy('value', 'user').filter(function(myGrant){
                        if( powerUser ){
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');
                        } else {
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Basic', 'Basic');
                        }
                    });
                    controller.get('grants').filterBy('value', 'shipment').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'None', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'poi').filter(function(myGrant){
                        if( powerUser ){
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');
                        } else {
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Basic', 'Basic');
                        }
                    });
                    controller.get('grants').filterBy('value', 'port').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'None', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'charge').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'None', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'region').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'None', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'grant').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'Global', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'segment').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'None', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'stamp').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'None', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'paymentPlan').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'None', 'None', 'None');     //new view edit remove
                    });
                    controller.get('grants').filterBy('value', 'freightPlan').filter(function(myGrant){
                        if( powerUser ){
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Local', 'Local');
                        } else {
                            myGrant.allCheck("allCheck", 'Global', 'Global', 'Basic', 'Basic');
                        }
                    });
                    controller.get('grants').filterBy('value', 'refill').filter(function(myGrant){
                        myGrant.allCheck("allCheck", 'None', 'None', 'None', 'None');     //new view edit remove
                    });
                    break;
                case 'D':
                    controller.get('grants').setEach('accessNew', false);
                    controller.get('grants').setEach('accessView', false);
                    controller.get('grants').setEach('accessEdit', false);
                    controller.get('grants').setEach('accessRemove', false);
                    break;
            }
        },

        //********************************************
        //MODAL
        open_modal: function( path, item, type ) {
            var self = this, controller = self.controllerFor('company.main');

            if( type === 'company' ){
                controller.set("companyRecord", item);
            }
            else if ( type === 'file' ) {
                controller.set("fileRecord", item);
            }
            else {
                controller.set("userRecord", item);  //utile per  action 'remove_item'
            }

            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        remove_item: function(){
            var self = this, controller = self.controllerFor('company.main');

            controller.userRecord.deleteRecord();
            controller.userRecord.save();
        },

        close_item: function(){
            var self = this, app_controller = self.controllerFor('application');

            app_controller.send('close_modal', 'overview', 'application');

        },

//        failDownload: function() {
//            this.send('open','companies.modals.modalAlert_FailDownload');
//        },


        remove_file: function(){
            var self = this, controller = self.controllerFor('company.main');

            controller.fileRecord.deleteRecord();
            controller.fileRecord.save();
        },

        update_filesList: function(val, mod, $btn){
            this.store.find(mod, val).then(function(myval){
                myval.reload().then(function(val){
                    //setTimeout(function () {
                    $btn.button('reset');
                    //}, 1000);
                });
            });
        },

        download_file: function( fileId ) {
            var self = this, app_controller = self.controllerFor('application'),
//              https://test.zenointelligence.com/seaforward/
                path = 'api/files/' + fileId + '?token=' + app_controller.token + '&download=true';

            $.fileDownload(path)
                // .done(function () { alert('File download a success!'); })
                .fail(function () {
                    new PNotify({
                        title: 'Error',
                        text: 'The file was removed or cancelled.',
                        type: 'error',
                        delay: 4000
                    });
                });
        }
    }
});
