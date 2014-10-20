import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('document.main');

        //imposto la tab details come default per 'company'
        if( controller.tabList.doc !== true && controller.tabList.items !== true && controller.tabList.details !== true && controller.tabList.files !== true ) {

            controller.set('tabList.doc', true);
            controller.set('isView', true);
            //controller.set('itemNewActive', false);
            //controller.set('itemEditActive', false);
        }

        if( !app_controller.autocompleteStamp.get('length') ) {
            this.store.findQuery("stamp").then(function(val){
                app_controller.set("autocompleteStamp", val);
            });
        }

        controller.set('searchStamp', []);

    },
    model: function(document) {
        return this.store.find('document', document.document_id);
    },

    actions: {
        /**
         Gestione della tab navigation in 'your-profile'; rende attiva la tab selezionata dall'utente

         @action setTabs
         @for your-profile/main-page
         @param {string} tab selezionata dall'utente - (company/driver/truck/trailer/clerk)
         */
        setTabs: function ( tabToActive ) {
            this.controller.set('tabList.doc', false);
            this.controller.set('tabList.items', false);
            this.controller.set('tabList.details', false);
            this.controller.set('tabList.files', false);

            this.controller.set('isView', true);
            this.controller.set('tabList.' + tabToActive, true);
        },

        open_modal: function( path, booking, item ) {
            var self = this, controller = self.controllerFor('document.main'), app_controller = self.controllerFor('application');

            switch ( path ){
                case 'booking.modals.remove-file':

                    controller.set("document_record", booking);
                    controller.set("file_record", item);

                    this.render(path, {
                        into: 'application',
                        outlet: 'overview',
                        view: 'modal-manager'
                    });
                    break;
            }
        },

        add_stamp: function( doc_record ) {
            var self = this, controller = self.controllerFor("document.main");

            if( controller.searchStamp !== "" && controller.searchStamp !== null ){
                doc_record.get("stamps").then(function(stamps){
                    stamps.pushObject(controller.searchStamp);
                    controller.set('searchStamp', []);
                });
                // doc.save()
            }
        },

        remove_stamp: function( doc_record, stamp ){
            doc_record.get('stamps').then(function(stamps){
                stamps.removeObject(stamp);
                doc_record.save();
            });
        },

        download_file: function( fileId ) {
            var self = this, app_controller = self.controllerFor("application");

            var path = 'api/files/' + fileId + '?token=' + app_controller.token + '&download=true';

            $.fileDownload(path)
                //.done(function () { alert('File download a success!'); })
                .fail(function () {
                    new PNotify({
                        title: 'Error',
                        text: 'The file was removed or cancelled.',
                        type: 'error',
                        delay: 4000
                    });
                });
        },

        /*  FILES TAB
         * ******************
         azione di rimozione di un file.

         @action remove_file
         @for Booking - Tab Files
         */
        remove_file: function(){
            var controller = this.controllerFor('document.main');

            controller.file_record.deleteRecord();
            controller.file_record.save().then(function(){
                controller.set('file_record', null);
            });
        },

        resetBL: function( doc ) {
            var data = this.getProperties(), self = this;
            data.idBL = doc.get('id');

            $.post('api/custom/resetBL?token=' + App.token, data).then(function(response){
                if (response.success) {
                    doc.get('docItems').then(function(val){
                        doc.reload();
                        // success
                        new PNotify({
                            title: 'Success',
                            text: 'Well done.',
                            type: 'success',
                            delay: 2000
                        });
                    });

                }
            }, function(error){
                // NOT SAVED
                new PNotify({
                    title: 'Not saved',
                    text: 'A problem has occurred.',
                    type: 'error',
                    delay: 2000
                });
            });
        },

        //eseguo la PUT del cargo manifest
        resetCM: function( doc ) {
            //&& doc.get('nrOriginal') != '' && doc.get('nrOriginal') != null
            if(doc.get('name') != '' && doc.get('name') != null){
                doc.save().then(function(success){
                    success.reload();
                }, function(error){
                    new PNotify({
                        title: 'Not saved',
                        text: 'An error was occurred.',
                        type: 'error',
                        delay: 2000
                    });
                });
            } else {
                new PNotify({
                    title: 'Attention',
                    text: 'Code field and Number of Originals field must be entered.',
                    type: 'info'
                });
            }
        },

        set_docState: function( val ){
            this.set('controller.isView', val);
        },

        updateDoc_other: function( docId, $btn ){
            var self = this, controller = self.controllerFor('document.main');

            this.store.find("document", docId).then(function(doc_record){
                if( doc_record.get('name') !== '' && doc_record.get('name') !== null &&
                    ( doc_record.get('nrOriginal') !== '' && doc_record.get('nrOriginal') !== null && doc_record.get('type') !== 'docCM' ) ||
                    ( doc_record.get('type') === 'docCM' )
                    ){
                    doc_record.save().then(function(success){
                        success.reload().then(function(){
                            $btn.button('reset');
                            controller.set('isView', true);
                        });
                    }, function(){
                        $btn.button('reset');
                        controller.set('isView', true);
                        new PNotify({
                            title: 'Not saved',
                            text: 'An error was occurred.',
                            type: 'error',
                            delay: 2000
                        });
                    });
                } else {
                    $btn.button('reset');
                    controller.set('isView', true);
                    new PNotify({
                        title: 'Attention',
                        text: 'Code field and Number of Originals field must be entered.',
                        type: 'info'
                    });
                }
            });
        },

        update_doc_bl: function( docId, $btn ){
            var self = this, controller = self.controllerFor('document.main');

            this.store.find("document", docId).then(function(doc){

                //verifico che l'utente abbia inserito un nominativo per il documento
                if(doc.get('name') != '' && doc.get('name') != null && doc.get('nrOriginal') != '' && doc.get('nrOriginal') != null ){
                    doc.get('docDetails').then(function(myDocDetails){

                        //  bookings, bookingItems, stamps hanno una relazione hasMany. è quindi necessario forzare
                        // le relazioni ad aggiornarsi prima di salvare l'entità padre
                        doc.get('bookings').then(function(){
                            doc.get('bookingItems').then(function(){
                                doc.get('stamps').then(function(){


                                    myDocDetails.filter(function(val, index){
                                        switch(val.get('isDirty')) {
                                            case true:
                                                val.save().then(function(myVal){
                                                    if(myDocDetails.get('length') == index+1){

                                                        //scorro la lista di doc items (tutti i booking items)
                                                        doc.get('docItems').then(function(docItems){
                                                            docItems.filter(function(items, indexIt){
                                                                items.get('docElements').then(function(elems){
                                                                    elems.filter(function(elem, indexEl){

                                                                        switch(elem.get('isDirty')) {
                                                                            case true:
                                                                                //salvo tutti gli elementi associati ai doc items
                                                                                elem.save().then(function(myVal){
                                                                                    if( (indexIt+1 == docItems.get('length')) && (indexEl+1 == elems.get('length')) ){

                                                                                        var arr = [], val2 = 'dangerous_good|' + doc.get('dangerousGood_bool');
                                                                                        if(doc.get('bl_type')){
                                                                                            var val1 = 'bl_type|' + doc.get('bl_type');
                                                                                            arr.push(val1);
                                                                                        }
                                                                                        arr.push(val2);
                                                                                        doc.set('tags', []);
                                                                                        //console.log(doc.get('tags'));

                                                                                        // Saving parent (doc) only after all hasMany items has been loaded
                                                                                        doc.set('tags', arr);
                                                                                        setTimeout(function(){
                                                                                            doc.save().then(function(){
                                                                                                $btn.button('reset');

                                                                                                controller.set('isView', true);

                                                                                            }, function(){
                                                                                                $btn.button('reset');
                                                                                                controller.set('isView', true);
                                                                                                new PNotify({
                                                                                                    title: 'Not saved',
                                                                                                    text: 'An error was occurred.',
                                                                                                    type: 'error',
                                                                                                    delay: 2000
                                                                                                });
                                                                                            });
                                                                                        }, 5000)

                                                                                    }
                                                                                });
                                                                                break;
                                                                            case false:
                                                                                if( (indexIt+1 == docItems.get('length')) && (indexEl+1 == elems.get('length')) ){

                                                                                    var arr = [], val2 = 'dangerous_good|' + doc.get('dangerousGood_bool');
                                                                                    if(doc.get('bl_type')){
                                                                                        var val1 = 'bl_type|' + doc.get('bl_type');
                                                                                        arr.push(val1);
                                                                                    }
                                                                                    arr.push(val2);
                                                                                    doc.set('tags', []);
                                                                                    doc.set('tags', arr);
                                                                                    setTimeout(function(){
                                                                                        doc.save().then(function(){
                                                                                            $btn.button('reset');
                                                                                            controller.set('isView', true);

                                                                                        }, function(){
                                                                                            $btn.button('reset');
                                                                                            controller.set('isView', true);
                                                                                            new PNotify({
                                                                                                title: 'Not saved',
                                                                                                text: 'An error was occurred.',
                                                                                                type: 'error',
                                                                                                delay: 2000
                                                                                            });
                                                                                        });
                                                                                    }, 5000)

                                                                                }
                                                                                break;
                                                                        }
                                                                    });
                                                                });

                                                            });
                                                        });
                                                    }
                                                });
                                                break;
                                            case false:
                                                if(myDocDetails.get('length') == index+1){

                                                    //scorro la lista di doc items (tutti i booking items)
                                                    doc.get('docItems').then(function(docItems){
                                                        docItems.filter(function(items, indexIt){
                                                            items.get('docElements').then(function(elems){
                                                                elems.filter(function(elem, indexEl){

                                                                    switch(elem.get('isDirty')) {
                                                                        case true:
                                                                            //salvo tutti gli elementi associati ai doc items
                                                                            elem.save().then(function(myVal){
                                                                                if( (indexIt+1 == docItems.get('length')) && (indexEl+1 == elems.get('length')) ){

                                                                                    var arr = [], val2 = 'dangerous_good|' + doc.get('dangerousGood_bool');
                                                                                    if(doc.get('bl_type')){
                                                                                        var val1 = 'bl_type|' + doc.get('bl_type');
                                                                                        arr.push(val1);
                                                                                    }
                                                                                    arr.push(val2);
                                                                                    doc.set('tags', []);
                                                                                    doc.set('tags', arr);

                                                                                    setTimeout(function(){
                                                                                        doc.save().then(function(){
                                                                                            $btn.button('reset');
                                                                                            controller.set('isView', true);

                                                                                        }, function(){
                                                                                            $btn.button('reset');
                                                                                            controller.set('isView', true);
                                                                                            new PNotify({
                                                                                                title: 'Not saved',
                                                                                                text: 'An error was occurred.',
                                                                                                type: 'error',
                                                                                                delay: 2000
                                                                                            });
                                                                                        });
                                                                                    }, 5000)


                                                                                }
                                                                            });
                                                                            break;
                                                                        case false:
                                                                            if( (indexIt+1 == docItems.get('length')) && (indexEl+1 == elems.get('length')) ){

                                                                                var arr = [], val2 = 'dangerous_good|' + doc.get('dangerousGood_bool');
                                                                                if(doc.get('bl_type')){
                                                                                    var val1 = 'bl_type|' + doc.get('bl_type');
                                                                                    arr.push(val1);
                                                                                }
                                                                                arr.push(val2);
                                                                                doc.set('tags', []);
                                                                                doc.set('tags', arr);
                                                                                setTimeout(function(){
                                                                                    doc.save().then(function(){

                                                                                        $btn.button('reset');

                                                                                        controller.set('isView', true);
                                                                                    }, function(){
                                                                                        $btn.button('reset');
                                                                                        controller.set('isView', true);
                                                                                        new PNotify({
                                                                                            title: 'Not saved',
                                                                                            text: 'An error was occurred.',
                                                                                            type: 'error',
                                                                                            delay: 2000
                                                                                        });
                                                                                    });
                                                                                }, 5000)

                                                                            }
                                                                            break;
                                                                    }
                                                                });
                                                            });

                                                        });
                                                    });
                                                }
                                                break;
                                        }
                                    });
                                });
                            });
                        });


                    });

                } else {
                    $btn.button('reset');
                    controller.set('isView', true);
                    new PNotify({
                        title: 'Attention',
                        text: 'Code field and Number of Originals field must be entered.',
                        type: 'info'
                    });
                }
            });
        },

        save_docItems: function( val, docItems, doc_record ){
            var self = this, controller = self.controllerFor('document.main');

            docItems.filter(function(items, indexIt){
                items.get('docElements').then(function(elems){
                    elems.filter(function(elem, indexEl){

                        switch(elem.get('isDirty')) {
                            case true:
                                elem.save().then(function(myVal){
                                    if( (indexIt+1 === docItems.get('length')) && (indexEl+1 === elems.get('length')) ){
                                        doc_record.get('bookings').then(function(){
                                            doc_record.get('bookingItems').then(function(){
                                                doc_record.get('stamps').then(function(){
                                                    doc_record.get('docDetails').then(function(myDocDetails){
                                                        myDocDetails.filter(function(val, index){
                                                            switch(elem.get('isDirty')) {
                                                                case true:
                                                                    val.save().then(function(){
                                                                        if( myDocDetails.get('length') === index+1 ){
                                                                            setTimeout(function(){
                                                                                doc_record.save().then(function(){
                                                                                    controller.set('isView', true);
                                                                                }, function(){
                                                                                    controller.set('isView', true);
                                                                                    new PNotify({
                                                                                        title: 'Not saved',
                                                                                        text: 'An error was occurred.',
                                                                                        type: 'error',
                                                                                        delay: 2000
                                                                                    });
                                                                                });
                                                                            }, 5000);
                                                                        }
                                                                    });
                                                                    break;
                                                                case false:
                                                                    if( myDocDetails.get('length') === index+1 ){
                                                                        setTimeout(function(){
                                                                            doc_record.save().then(function(){
                                                                                controller.set('isView', true);
                                                                            }, function(){
                                                                                controller.set('isView', true);
                                                                                new PNotify({
                                                                                    title: 'Not saved',
                                                                                    text: 'An error was occurred.',
                                                                                    type: 'error',
                                                                                    delay: 2000
                                                                                });
                                                                            });
                                                                        }, 5000);
                                                                    }
                                                                    break;
                                                            }
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    }
                                });

                                break;
                            case false:
                                if( (indexIt+1 === docItems.get('length')) && (indexEl+1 === elems.get('length')) ){
                                    //self.store.find("document", docId).then(function(doc){
                                    doc_record.get('docDetails').then(function(myDocDetails){
                                            myDocDetails.filter(function(val, index){
                                                switch(elem.get('isDirty')) {
                                                    case true:
                                                        val.save().then(function(myVal){
                                                            if(myDocDetails.get('length') === index+1){
                                                                setTimeout(function(){
                                                                    doc_record.save().then(function(){
                                                                        controller.set('isView', true);
                                                                    }, function(){
                                                                        controller.set('isView', true);
                                                                        new PNotify({
                                                                            title: 'Not saved',
                                                                            text: 'An error was occurred.',
                                                                            type: 'error',
                                                                            delay: 2000
                                                                        });
                                                                    });
                                                                }, 5000);
                                                            }
                                                        });

                                                        break;
                                                    case false:
                                                        if(myDocDetails.get('length') === index+1){
                                                            setTimeout(function(){
                                                                doc_record.save().then(function(){
                                                                    controller.set('isView', true);
                                                                }, function(){
                                                                    controller.set('isView', true);
                                                                    new PNotify({
                                                                        title: 'Not saved',
                                                                        text: 'An error was occurred.',
                                                                        type: 'error',
                                                                        delay: 2000
                                                                    });
                                                                });
                                                            }, 5000);
                                                        }
                                                        break;
                                                }

                                            });
                                        });
                                    //});
                                }
                                break;
                        }

                    });
                });
            });
        }
    }
});
