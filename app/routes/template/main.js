import Ember from 'ember';

export default Ember.Route.extend({
//    beforeModel: function(){
//        var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('template.main');
//
//        //reset search variables
////        controller.searchCompany = Ember.A();
////        controller.searchPort = Ember.A();
//    },

    model: function(template) {
        return this.store.find('template', template.template_id);
    },

    actions: {
        change_state: function( bool, record ){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('template.main');

            if( bool === true ){

                self.store.find('company', app_controller.company).then(function(company){
                    record.set('company', company);

                    record.get('paths').then(function(paths) {
                        paths.filter(function(poi){
                            self.store.find('poi', poi.id).then(function(poi){
                                paths.removeObject(poi);
                            });
                        });

                        if( controller.temporary_records_list.length ) {
                            $.each( controller.temporary_records_list, function(index, val) {
                                self.store.find('poi', val).then(function(poi){
                                    paths.pushObject(poi);
                                    if( controller.temporary_records_list.length === index + 1 ){
                                        record.save().then(function(res){
                                            app_controller.obj = Ember.Object.create({
                                                things: []
                                            });
                                            controller.set('temporary_records_list', app_controller.obj.things);

                                            app_controller.autocompleteTemplate.forEach(function(item, index){
                                                if( item.get('id') === val ) {
                                                    app_controller.autocompleteTemplate.removeAt(index);
                                                    app_controller.autocompleteTemplate.pushObject(res);
                                                }
                                            });

                                            //SUCCESS
                                            new PNotify({
                                                title: 'Saved',
                                                text: 'You successfully saved template.',
                                                type: 'success',
                                                delay: 1000
                                            });

                                            controller.set( 'isView', bool );

                                        }, function(){
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
                        } else {

                            //NOT SAVED
                            new PNotify({
                                title: 'Not saved',
                                text: 'Please check if required field has been entered.',
                                type: 'error',
                                delay: 2000
                            });
                        }

                    });

                });
            } else {
                controller.set( 'isView', bool );
            }
        },


        /**
         Ad ogni sort fatto dall'utente in stato edit registro il cambiamento di ordinamento nella variabile temporanea

         @action update_temporaryRecordsList
         @for template/main.hbs (--> partials/-details.hbs)
         @param {array} lista di id ordinati
         */
        update_temporaryRecordsList: function( ordered_list ){
            var self = this, controller = self.controllerFor('template.main');

            for( var index in ordered_list ) {
                controller.temporary_records_list[ index ] = ordered_list[ index ];
            }
        },

        /**
         Aggiunta di un nuovo porto al record template.

         @action add_item
         @for template/main.hbs (--> partials/-details.hbs)
         */
        add_item: function(){
            var self = this, controller = self.controllerFor('template.main');

            if( controller.searchPort !== '' && controller.searchPort !== null && controller.searchPort !== undefined ){

                controller.temporary_records_list.pushObject( controller.searchPort.get("id") );
                controller.set("searchPort", []);

                controller.template_record.get('paths').then(function(paths) {

                    paths.filter(function(poi){
                        self.store.find('poi', poi.id).then(function(poi){
                            paths.removeObject(poi);
                        });
                    });

                    $.each( controller.temporary_records_list, function(index, val) {
                        self.store.find('poi', val).then(function(poi){
                            paths.pushObject(poi);

                            if( controller.temporary_records_list.length === index + 1 ){
                                controller.template_record.save();
                            }
                        });
                    });
                });
            }
        },

        /**
         Rimozione di un elemento dalla lista.
         Mi viene passato l'indice dell'elemento da eliminare; tale indice è riferito all'ordine dei poi presente sullo store
         Devo assicurarmi che non siano stati fatti cambi di posizione dall'utente, in caso contrario devo recuperare il
         nuovo indice, "controller.temporary_index_list" tiene traccia dei sort fatti dall'utente:

        se NON sono stati fatti sort temporary_index_list = [0, 1, 2, 3, 4,...]

         ex: dato indexToRemove = '3' se non sono stati fatti spostamenti temp_index = '3'

         @action remove_record
         @for template/main.hbs (--> partials/-details.hbs)
         @param {array} indice dell'elemento da eliminare rispetto all'ordinamento presente nello store
         */
        remove_element: function( indexToRemove ){
            var self = this, controller = self.controllerFor('template.main');

            var temp_index = controller.temporary_index_list.indexOf(indexToRemove);

            controller.temporary_records_list.splice(temp_index, 1);
            controller.temporary_index_list.splice(temp_index, 1);
        },

        open_modal: function( path, record ) {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('template.main');

            controller.set("template_record", record);

            if( !app_controller.autocompletePoiPort.get('length') ) {
                this.store.findQuery( "poi", {tags: "Port"} ).then(function(val){
                    app_controller.set("autocompletePoiPort", val);
                });
            }

            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        close_item: function(){
            var self = this, app_controller = self.controllerFor('application');

            app_controller.send('close_modal', 'overview', 'application');
            this.send('closeSearch');
        }

    }
});
