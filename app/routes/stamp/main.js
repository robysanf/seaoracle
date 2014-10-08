import Ember from 'ember';

export default Ember.Route.extend({
//    beforeModel: function() {
//        var self = this, app_controller = self.controllerFor('application');
//
//        if( !app_controller.autocompletePoiPort.get('length') ) {
//            this.store.findQuery("poi", {tags: 'Port'}).then(function(val){
//                app_controller.set("autocompletePoiPort", val);
//            });
//        }
//    },

    model: function( stamp ) {
        return this.store.find('stamp', stamp.stamp_id);
    },

    actions: {
        change_state: function( bool, record ){
            var self = this, app_controller = self.controllerFor('application'), controller = self.controllerFor('stamp.main');

            if( bool === true ){
                if(record.get('isDocCM')){      //se è true docCM
                    if(record.get('isAlreadyDocCM') === false){    //se non era true prima che l'utente lo modificasse
                        record.get('docTypes').pushObject('docCM');
                    }
                } else {   //se è false
                    if(record.get('isAlreadyDocCM')){    //se non era false prima che l'utente lo modificasse
                        var temporaryList = record.get('docTypes').filter(function(i) {      //rimuovo docCM dalla lista
                            return i !== 'docCM';
                        });
                        record.set('docTypes', temporaryList);
                    }
                }
                record.save().then(function(val){
                    app_controller.autocompleteStamp.forEach(function(item, index){
                        if( item.get('id') === record.get('id') ) {
                            app_controller.autocompleteStamp.removeAt(index);
                            app_controller.autocompleteStamp.pushObject(val);
                        }
                    });
                    controller.set('isView', bool);
                });
            } else {
                controller.set('isView', bool);
            }
        }
    }
});
