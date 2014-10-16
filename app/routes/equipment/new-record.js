import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('equipment.new-record');

        //imposto la tab details come default per 'company'
        if( controller.tabList.details !== true && controller.tabList.import_template !== true ) {
            controller.set('tabList.details', true);
        }

        //reset del campo di ricerca in caso di reload della pagina
        if( !app_controller.autocompleteCompany.get('length') ) {
            self.store.findQuery("company").then(function(val){
                app_controller.set("autocompleteCompany", val);
            });
        }

        if( !app_controller.autocompletePoi.get('length') ){
            self.store.findQuery("poi").then(function(ware){
                app_controller.set("autocompletePoi", ware);
            });
        }
        var queryExpression = {}, searchPath = "equipmentType";
        queryExpression[searchPath] = 'container';
        searchPath = "available";
        queryExpression[searchPath] = true;

        if( !app_controller.autocompleteEqClassification.get('length') ) {
            self.store.findQuery("equipmentClassification", queryExpression).then(function(val){
                app_controller.set("autocompleteEqClassification", val);
            });
        }

        if( !app_controller.autocompleteEquipment.get('length') ) {
            self.store.findQuery("equipment").then(function(comp){
                app_controller.set("autocompleteEquipment", comp);
            });
        }

        controller.searchHolder = Ember.A();
        controller.searchSupplier = Ember.A();
        controller.searchPlanner1 = Ember.A();
        controller.searchPlanner2 = Ember.A();
        controller.searchPlanner3 = Ember.A();
        controller.searchPlanner4 = Ember.A();
    },

    actions: {

        /**
         Gestione della tab navigation in 'your-profile'; rende attiva la tab selezionata dall'utente

         @action setTabs
         @for your-profile/main-page
         @param {string} tab selezionata dall'utente - (company/driver/truck/trailer/clerk)
         */
        setTabs: function (tabToActive) {
            this.controller.set('tabList.details', false);
            this.controller.set('tabList.import_template', false);

            this.controller.set('tabList.' + tabToActive, true);

        },

        create_exel: function(){
            var self = this, app_controller = self.controllerFor('application');

            $.fileDownload('api/custom/createModelExcel?token=' +app_controller.token+'&model=equipment')
                .done(function () {
                    new PNotify({
                        title: 'Success',
                        text: 'The exel was successfully create.',
                        type: 'success',
                        delay: 2000
                    });
                })
                .fail(function () {
                    new PNotify({
                        title: 'Error',
                        text: 'The file was removed or cancelled.',
                        type: 'error',
                        delay: 4000
                    });
                });
        },

        create_record: function( _btn ) {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('equipment.new-record');
            //csqu3054383

            if( controller.searchHolder === null || controller.searchHolder === undefined ) {
                controller.set('searchHolder', []);
            }
            if( controller.searchSupplier === null || controller.searchSupplier === undefined ) {
                controller.set('searchSupplier', []);
            }
            if( controller.searchClassification === null || controller.searchClassification === undefined ) {
                controller.set('searchClassification', []);
            }
            if( controller.searchPosition === null || controller.searchPosition === undefined ) {
                controller.set('searchPosition', []);
            }

            if( controller.searchPlanner1 === null || controller.searchPlanner1 === undefined ) {
                controller.set('searchPlanner1', []);
            }
            if( controller.searchPlanner2 === null || controller.searchPlanner2 === undefined ) {
                controller.set('searchPlanner2', []);
            }
            if( controller.searchPlanner3 === null || controller.searchPlanner3 === undefined ) {
                controller.set('searchPlanner3', []);
            }
            if( controller.searchPlanner4 === null || controller.searchPlanner4 === undefined ) {
                controller.set('searchPlanner4', []);
            }
            if(  controller.searchPlanner1.length !== 0 ){
                controller.plannersList.push(controller.searchPlanner1);
            }
            if(  controller.searchPlanner2.length !== 0 ){
                controller.plannersList.push(controller.searchPlanner2);
            }
            if(  controller.searchPlanner3.length !== 0 ){
                controller.plannersList.push(controller.searchPlanner3);
            }
            if(  controller.searchPlanner4.length !== 0 ){
                controller.plannersList.push(controller.searchPlanner4);
            }

            (controller.newName !== null && controller.newName.length >= 1 ? $('span#1.input-group-addon').removeClass('alert-danger') : $('span#1.input-group-addon').addClass('alert-danger'));

            if ( controller.newName !== null && controller.newName.length >= 1 && controller.searchClassification !== null ) {

                var today = new Date();

                //se è stato inserito il certificato rina
                if(controller.newRinaFromDate !== null && controller.newRinaFromDate !== '') {
//                    var rinaFromDate = new Date();
//                    var arrayFromDate = controller.newRinaFromDate.split("-");    //year - month - day
//                    rinaFromDate.setProperties({year: arrayFromDate[0], month: arrayFromDate[1]-1, day: arrayFromDate[2]});

                    var newRina = this.store.createRecord('rina', {
                        from: controller.newRinaFromDate,//rinaFromDate,
                        visibility: 'private'
                    });

                    if(controller.newRinaToDate !== null && controller.newRinaToDate !== '') {
//                        var rinaToDate = new Date();
//                        var arrayToDate = controller.newRinaToDate.split("-");    //year - month - day
//                        rinaToDate.setProperties({year: arrayToDate[0], month: arrayToDate[1]-1, day: arrayToDate[2]});

                        newRina.set('to', controller.newRinaToDate);//rinaToDate);
                    }


                    //create a rina record
                    newRina.save().then(function(rina){
                        //set commission state to default "decommissioned"
                        self.store.createRecord('commissionState', {
                            state : "decommissioned",
                            date : today,
                            visibility: 'private'
                        }).save().then(function(commissionState){
                            //set equipment state to default "available"
                            self.store.createRecord('equipmentState', {
                                state : "Available",
                                from : today,
                                visibility: 'private'
                            }).save().then(function(equipmentState){

                                //create the new equipment into the local storage
                                var newEquipment = self.store.createRecord('equipment', {
                                    code: controller.newName,
                                    originalCode: controller.newName,
                                    dailyCost: controller.newDailyCost,
                                    currency: controller.newCurrency,
                                    availability: true,
                                    currentStatus: controller.newCurrentStatus,
                                    available: controller.newAvailable,
                                    visibility: 'private'
                                });
                                if(controller.newCurrentStatusDateFrom !== null && controller.newCurrentStatusDateFrom !== '') {
                                    newEquipment.set('currentStatusDateFrom', controller.newCurrentStatusDateFrom);
                                }

                                if( controller.searchClassification.get('length') !== 0 ){
                                    newEquipment.set('equipmentClassification', controller.searchClassification);
                                }
                                if( controller.searchSupplier.get('length') !== 0 ){
                                    newEquipment.set('supplier', controller.searchSupplier);
                                }
                                if( controller.searchHolder.get('length') !== 0 ){
                                    newEquipment.set('holder', controller.searchHolder);
                                }
                                if( controller.searchPosition.get('length') !== 0 ){
                                    newEquipment.set('position', controller.searchPosition);
                                }
                                //push the default values into the new equipment
                                self.store.find('company', app_controller.company).then(function(company){
                                    newEquipment.set('company', company);
                                    newEquipment.get('rinas').then(function(rinas) {
                                        rinas.pushObject(rina);
                                        newEquipment.get('commissionStates').then(function(commissionStates) {
                                            commissionStates.pushObject(commissionState);
                                            newEquipment.get('equipmentStates').then(function(equipmentStates) {
                                                equipmentStates.pushObject(equipmentState);
                                                if( controller.plannersList !== '' && controller.plannersList.length !== 0 ){
                                                    newEquipment.get('planners').then(function(planners) {
                                                        $.each(controller.plannersList, function(index, val) {
                                                            planners.pushObject(val);
                                                            if( controller.plannersList.length === index + 1 ){
                                                                //post the equipment to the server

                                                                newEquipment.save().then(function(eq){

                                                                    app_controller.autocompleteEquipment.pushObject(eq);

                                                                    controller.set('searchClassification', []);
                                                                    controller.set('searchPosition', []);
                                                                    controller.set('searchSupplier', []);
                                                                    controller.set('searchHolder', []);
                                                                    controller.set('searchPlanner1', []);
                                                                    controller.set('searchPlanner2', []);
                                                                    controller.set('searchPlanner3', []);
                                                                    controller.set('searchPlanner4', []);
                                                                    controller.set('plannersList', []);
                                                                    controller.set('newName', null);
                                                                    controller.set('newDailyCost', null);
                                                                    controller.set('newRinaFromDate', null);
                                                                    controller.set('newRinaToDate', null);
                                                                    self.set('newVisibility', null);
                                                                    controller.set('currentStatusDateFrom', null);
                                                                    _btn.stop();
                                                                    //SUCCESS
                                                                    new PNotify({
                                                                        title: 'Saved',
                                                                        text: 'You successfully saved new equipment.',
                                                                        type: 'success',
                                                                        delay: 1000
                                                                    });

                                                                    //go to view
                                                                    //self.transitionTo('equipments.equipmentView', eq.id);
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

                                                            }
                                                        });
                                                    });
                                                }else{
                                                    newEquipment.save().then(function(eq){

                                                        app_controller.autocompleteEquipment.pushObject(eq);

                                                        controller.set('searchClassification', []);
                                                        controller.set('searchPosition', []);
                                                        controller.set('searchSupplier', []);
                                                        controller.set('searchHolder', []);
                                                        controller.set('plannersList', []);
                                                        controller.set('searchPlanner1', []);
                                                        controller.set('searchPlanner2', []);
                                                        controller.set('searchPlanner3', []);
                                                        controller.set('searchPlanner4', []);
                                                        controller.set('newName', null);
                                                        controller.set('newDailyCost', null);
                                                        controller.set('newVisibility', null);
                                                        controller.set('newRinaFromDate', null);
                                                        controller.set('newRinaToDate', null);
                                                        controller.set('currentStatusDateFrom', null);

                                                        _btn.stop();
                                                        //SUCCESS
                                                        new PNotify({
                                                            title: 'Saved',
                                                            text: 'You successfully saved new equipment.',
                                                            type: 'success',
                                                            delay: 1000
                                                        });

                                                        //self.transitionTo('equipments.equipmentView', eq.id);
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
                                                }
                                            });
                                        });
                                    });
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
                } else {
                    //caso in cui non sia stato inserito un certificato rina
                    //set commission state to default "decommissioned"
                    self.store.createRecord('commissionState', {
                        state : "decommissioned",
                        date : today,
                        visibility: 'private'
                    }).save().then(function(commissionState){
                        //set equipment state to default "available"
                        self.store.createRecord('equipmentState', {
                            state : "Available",
                            from : today,
                            visibility: 'private'
                        }).save().then(function(equipmentState){

                            //create the new equipment into the local storage
                            var newEquipment = self.store.createRecord('equipment', {
                                code: controller.newName,
                                originalCode: controller.newName,
                                dailyCost: controller.newDailyCost,
                                currency: controller.newCurrency,
                                availability: true,
                                visibility: 'private'
                            });
                            if(controller.newCurrentStatusDateFrom !== null && controller.newCurrentStatusDateFrom !== '') {
                                newEquipment.set('currentStatusDateFrom', controller.newCurrentStatusDateFrom);
                            }
                            if( controller.searchClassification.get('length') !== 0 ){
                                newEquipment.set('equipmentClassification', controller.searchClassification);
                            }
                            if( controller.searchSupplier.get('length') !== 0 ){
                                newEquipment.set('supplier', controller.searchSupplier);
                            }
                            if( controller.searchHolder.get('length') !== 0 ){
                                newEquipment.set('holder', controller.searchHolder);
                            }
                            if( controller.searchPosition.get('length') !== 0 ){
                                newEquipment.set('position', controller.searchPosition);
                            }
                            //push the default values into the new equipment
                            self.store.find('company', app_controller.company).then(function(company){
                                newEquipment.set('company', company);
                                newEquipment.get('commissionStates').then(function(commissionStates) {
                                    commissionStates.pushObject(commissionState);
                                    newEquipment.get('equipmentStates').then(function(equipmentStates) {
                                        equipmentStates.pushObject(equipmentState);
                                        if( controller.plannersList !== ""  && controller.plannersList.length !== 0 ){
                                            newEquipment.get('planners').then(function(planners) {
                                                $.each(controller.plannersList, function(index, val) {
                                                    planners.pushObject(val);
                                                    if(controller.plannersList.length === index + 1){
                                                        //post the equipment to the server

                                                        newEquipment.save().then(function(){
                                                            controller.set('searchClassification', []);
                                                            controller.set('searchPosition', []);
                                                            controller.set('searchSupplier', []);
                                                            controller.set('searchHolder', []);
                                                            controller.set('searchPlanner1', []);
                                                            controller.set('searchPlanner2', []);
                                                            controller.set('searchPlanner3', []);
                                                            controller.set('searchPlanner4', []);
                                                            controller.set('plannersList', []);
                                                            controller.set('newName', null);
                                                            controller.set('newDailyCost', null);
                                                            controller.set('newRinaFromDate', null);
                                                            controller.set('newRinaToDate', null);
                                                            self.set('newVisibility', null);
                                                            controller.set('currentStatusDateFrom', null);

                                                            _btn.stop();
                                                            //SUCCESS
                                                            new PNotify({
                                                                title: 'Saved',
                                                                text: 'You successfully saved new equipment.',
                                                                type: 'success',
                                                                delay: 1000
                                                            });

                                                            //go to view
                                                            //self.transitionTo('equipments.equipmentView', eq.id);
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

                                                    }
                                                });
                                            });
                                        }else{
                                            newEquipment.save().then(function(){

                                                controller.set('searchClassification', []);
                                                controller.set('searchPosition', []);
                                                controller.set('searchSupplier', []);
                                                controller.set('searchHolder', []);
                                                controller.set('plannersList', []);
                                                controller.set('searchPlanner1', []);
                                                controller.set('searchPlanner2', []);
                                                controller.set('searchPlanner3', []);
                                                controller.set('searchPlanner4', []);
                                                controller.set('newName', null);
                                                controller.set('newDailyCost', null);
                                                controller.set('newVisibility', null);
                                                controller.set('newRinaFromDate', null);
                                                controller.set('newRinaToDate', null);
                                                controller.set('currentStatusDateFrom', null);

                                                _btn.stop();
                                                //SUCCESS
                                                new PNotify({
                                                    title: 'Saved',
                                                    text: 'You successfully saved new equipment.',
                                                    type: 'success',
                                                    delay: 1000
                                                });

                                                //self.transitionTo('equipments.equipmentView', eq.id);
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
                                        }
                                    });
                                });

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
                }
            } else {

                _btn.stop();
                //WARNING
                //NOT SAVED
                new PNotify({
                    title: 'Attention',
                    text: 'Please check if required fields have been entered.',
                    type: 'error',
                    delay: 2000
                });
            }
        }
    }
});
