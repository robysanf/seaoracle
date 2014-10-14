import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var self = this, app_controller= self.controllerFor('application'), controller = self.controllerFor('template.new-record');

        if( !app_controller.autocompleteTemplate.get('length') ) {
            self.store.findQuery("template").then(function(val){
                app_controller.set("autocompleteTemplate", val);
            });
        }

        controller.listOfPorts = Ember.A();
        controller.searchPort = Ember.A();
    },
    actions: {
        update_temporaryRecordsList: function( ordered_list ){
            var self = this, controller = self.controllerFor('template.new-record');

            for( var index in ordered_list ) {
                controller.listOfPorts[ index ] = ordered_list[ index ];
            }
        },

        add_item: function(){
            var self = this, controller = self.controllerFor('template.new-record');

            if( controller.searchPort !== null && controller.searchPort !== '' && controller.searchPort !== undefined ){
                controller.listOfPorts = controller.listOfPorts.concat(controller.searchPort.get("id"));

                controller.temporary_index_list.push('');
                controller.temporary_index_list.filter(function(val, index){
                    controller.temporary_index_list[ index ] = index;
                });


                this.send('update_temporaryPath');
            }
        },

        remove_item: function( indexToRemove ){
            var self = this, controller = self.controllerFor('template.new-record');

            var temp_index = controller.temporary_index_list.indexOf(indexToRemove);

            controller.listOfPorts.splice(temp_index, 1);
            controller.temporary_index_list.splice(temp_index, 1);
        },

        update_temporaryPath: function(){
            var self = this, app_controller= self.controllerFor('application'), controller = self.controllerFor('template.new-record');

            app_controller.obj = Ember.Object.create({ things: [] });

            $.each(controller.listOfPorts, function(index, val) {  // val: poi.id
                self.store.find("poi", val).then(function(poi){

                    app_controller.obj.things.pushObject(Ember.Object.create({
                        id: poi.id,
                        name: poi.get("name")
                    }));

                    if(controller.listOfPorts.length === index + 1){
                        controller.set( 'temporaryPath', app_controller.obj.things );
                        controller.set( 'searchPort', [] );
                    }
                });
            });
        },

        create_record: function(){
            var self = this, app_controller= self.controllerFor('application'), controller = self.controllerFor('template.new-record');

            (controller.newName != null && controller.newName.length > 1 ? $('span#1.input-group-addon').removeClass('alert-danger') : $('span#1.input-group-addon').addClass('alert-danger'));

            //check for the validity name
            if (controller.newName != null && controller.newName.length > 1) {

                //create new Template
                var newTemplate = this.store.createRecord('template', {
                    name: controller.newName,
                    visibility: 'private'
                });
                //define company and pois list
                self.store.find('company', app_controller.company).then(function(company){
                    newTemplate.set('company', company);
                    newTemplate.get('paths').then(function(paths) {
                        $.each(controller.listOfPorts, function(index, val) {

                            self.store.find( 'poi', val ).then(function(poi){
                                paths.pushObject(poi);

                                if(controller.listOfPorts.length === index + 1){
                                    newTemplate.save().then(function(temp){
                                        app_controller.autocompleteTemplate.pushObject(temp);

                                        //SUCCESS
                                        new PNotify({
                                            title: 'Saved',
                                            text: 'You successfully saved template.',
                                            type: 'success',
                                            delay: 1000
                                        });

                                        controller.set('newName', null);
                                        controller.set('temporaryPath', []);
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
                    });
                });
            }
            else {
                //WARNING
                //NOT SAVED
                new PNotify({
                    title: 'Attention',
                    text: 'Please check if required fields have been entered.',
                    type: 'error',
                    delay: 2000
                });
            }
        },

        open_modal: function( path, record ) {
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('template.new-record');

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
