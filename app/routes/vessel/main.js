import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var self = this, controller = self.controllerFor('vessel.main');

        //imposto la tab details come default per 'company'
        if( controller.tabList.details !== true &&  controller.tabList.files !== true ) {
            controller.set('tabList.details', true);
        }
    },

    model: function( vessel ) {
        return this.store.find('vessel', vessel.vessel_id);
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
            this.controller.set('tabList.files', false);

            this.controller.set('tabList.' + tabToActive, true);
        },

        change_state: function( bool, record ){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('vessel.main');

            if( bool === true ){
                record.save().then(function() {

                    app_controller.autocompleteVessel.forEach(function(item, index){
                        if( item.get('id') === record.get('id') ) {
                            app_controller.autocompleteVessel.removeAt(index);
                            app_controller.autocompleteVessel.pushObject(record);
                        }
                    });

                    controller.set('isView', bool);

                }, function() {
                    new PNotify({
                        title: 'Error',
                        text: 'A problem was occurred, Vessel is not update.',
                        type: 'error',
                        delay: 4000
                    });
                });
            } else {
                controller.set('isView', bool);
            }
        },

        //********************************************
        //MODAL
        open_modal: function( path, item, type ) {
            var self = this, controller = self.controllerFor('vessel.main');

            if ( type === 'file' ) {
                controller.set("fileRecord", item);
            }

            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        remove_file: function(){
            var self = this, controller = self.controllerFor('vessel.main');

            controller.fileRecord.deleteRecord();
            controller.fileRecord.save();
        },

        close_item: function(){
            var self = this, app_controller = self.controllerFor('application');

            app_controller.send('close_modal', 'overview', 'application');

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
        },

        update_filesList: function(val, mod, $btn){
            this.store.find(mod, val).then(function(myval){
                myval.reload().then(function(){
                    //setTimeout(function () {
                    $btn.button('reset');
                    //}, 1000);
                });
            });
        }
    }
});
