import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var app_controller = this.controllerFor('application');

        /** se non è presente in memoria il token l'utente viene ri-direzionato alla pagina di login **/
        if ( !app_controller.token ){
            this.redirectToLogin();
//        } else {
//            this.redirectToDashboard();
        }
    },

    redirectToLogin: function() {
        this.transitionTo('login/main');
    },

    redirectToDashboard: function() {
        this.transitionTo('dashboard/main');
    },

    actions: {
        error: function(reason) {
//            switch (reason.status){
//                case '401':
//
//                    break;
//                case '403':
//
//                    break;
//                case '404':
//
//                    break;
//                default:
//
//                    break;
//            }

            if (reason.status === 400) {        //ANAUTHORIZED  - invalid authentication token
                this.redirectToLogin();
            } else {
                new PNotify({
                    title: 'Attention!',
                    text: 'Something went wrong.',
                    type: 'error'
                });
                this.redirectToDashboard();
            }
        },
        closeSearch: function(){
            this.disconnectOutlet({
                outlet: 'search-result',
                parentView: "application"
            });
        },

        close_modal: function(outlet, parentView) {
            this.disconnectOutlet({
                outlet: outlet,
                parentView: parentView
            });
        },

        /*     INFINITE SCROLL    */
        getMore: function(){
            var self = this, controller = self.controllerFor('application'),
                items = [];

            // simulate latency
            Ember.run.later( function() {
                items = self.send('fetchPage', controller.firstIndex + 1, controller.perPage);
            }, 500);
        },

        fetchPage: function(firstIndex, perPage){
            var self = this, controller = self.controllerFor('application'),
                items = Ember.A([]),
                lastIndex  = firstIndex + perPage;

            if(firstIndex <= controller.queryExpressResults_length) {
                controller.queryExpressResults.forEach(function(equ, index){

                    if( index+1 >= firstIndex && index+1 <= lastIndex ) {
                        controller.items.pushObject(equ);
                        if(index+1 === controller.queryExpressResults_length){
                            controller.firstIndex = controller.queryExpressResults_length;
                            controller.set("searchResultList", controller.items);
                            return false;
                        }
                    } else if (index+1 > lastIndex){
                        controller.firstIndex = lastIndex;
                        controller.set("searchResultList", controller.items);
                        return false;
                    }
                });
            }
            this.get('controller').send('gotMore', items, firstIndex);
        },

        /**
         Alla creazione di un nuovo record vengono controllati i campi che devono avere un valore univoco; se esiste
         già un record con valore uguale viene avvertito l'utente e viene cancellato il campo.

         @action checkUniqueField
         @for New record
         @param {string} modello da interrogare
         @param {string} campo da cercare
         @param {string} value del campo da cercare
         @param {string} path del controller di riferimento
         */
        checkUniqueField: function( myModel, myFilter, myVal, path ){
            var self = this, controller = self.controllerFor(path),
                queryExpression = {}, searchPath = '';

            searchPath = myFilter; queryExpression[searchPath] = myVal;

            this.store.findQuery(myModel, queryExpression).then(function(val){
                if(val.get('length') === 1){
                    controller.set('newName', null);
                    //SUCCESS
                    new PNotify({
                        title: 'Attention',
                        text: 'Already exists an item with this '+ myFilter,
                        delay: 2000
                    });
                }
            });
        }

    }
});
