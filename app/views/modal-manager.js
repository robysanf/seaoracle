import Ember from 'ember';

export default Ember.View.extend({
    didInsertElement: function() {
        Ember.run.next(this,function(){
            this.$('.modal, .modal-backdrop').addClass('in');
        });
    },

    layoutName: 'modal-layout',
    actions: {
        remove_booking: function(){
            var view = this;
            this.controller.send('remove_booking');

            this.$('.modal, .modal-backdrop').one("transitionend", function(ev) {
                view.controller.send('close_item');
            });

            this.$('.modal').removeClass('in');
        },

        send_authorizeResource: function() {
            var view = this;
            view.controller.send('send_authorizeResource');

            this.$('.modal, .modal-backdrop').one("transitionend", function(ev) {
                view.controller.send('close_item');
            });
            this.$('.modal').removeClass('in');
        },

        send_shareResource: function() {
            var view = this;
            view.controller.send('send_shareResource');

            this.$('.modal, .modal-backdrop').one("transitionend", function(ev) {
                view.controller.send('close_item');
            });
            this.$('.modal').removeClass('in');
        },

        send_BL: function() {
            var view = this, data = view.getProperties();

            data.val = view.controller.codeBL;
            data.type = 'docBL';
            $.post('api/custom/checkDocumentCode?token=' + view.get('controller.controllers.application').token, data).then(function(response){
                if (response.success) {
                    view.controller.send('generate_BL');

                    view.$('.modal, .modal-backdrop').one("transitionend", function(ev) {
                        view.controller.send('close_item');
                    });
                    view.$('.modal').removeClass('in');
                } else {
                    new PNotify({
                        title: 'Attention',
                        text: 'A document with this code already exists, please change it.',
                        type: 'info'
                    });
                }
            }, function(){
                new PNotify({
                    title: 'Attention',
                    text: 'A problem occurred.',
                    type: 'info'
                });
            });
        },

        /**
         Chiamata per definire (PUT) i grants associati alla compani in oggetto.

         @action update_grants
         @for company/main/-details.hbs
         @param {Number} - unique key
         */
        update_grants: function( record, type ){
            var view = this;
            // view.controller.send('addGrants') --> rimanda al controller (App.CompaniesCompanyViewsCompanyUsersListsCompanyUserAddController)
            view.controller.send( 'update_grants', record, type );

            this.$('.modal, .modal-backdrop').one("transitionend", function() {
                view.controller.send('close_item');
            });
            this.$('.modal').removeClass('in');
        },
        remove_file: function(){
            var view = this;
            this.controller.send('remove_file');

            this.$('.modal, .modal-backdrop').one("transitionend", function() {
                view.controller.send('close_item');
            });

            this.$('.modal').removeClass('in');

        },

        send_delay: function(){
            var view = this;

            if( view.controller.codeBooking !== null && view.controller.codeBooking !== '' ) {
                var queryExpression = {}, searchPath = "code";
                queryExpression[searchPath] = view.controller.codeBooking;

                view.controller.store.findQuery('booking', queryExpression).then(function(queryExpressResults){
                    if( queryExpressResults.get('length') > 0 ) {

                        queryExpressResults.filter(function(val, index) {
                            if (index === 0) {

                                view.controller.bookingCodeId = val.get('id');
                                view.controller.send('send_delay');

                                this.$('.modal, .modal-backdrop').one("transitionend", function(ev) {
                                    view.controller.send('close');
                                });
                                this.$('.modal').removeClass('in');
                            }
                        })

                    } else {
                        new PNotify({
                            title: 'Attention',
                            text: 'The booking code is not valid.',
                            type: 'info'
                        });
                    }
                });

            } else {
                new PNotify({
                    title: 'Attention',
                    text: 'You have not insert a booking code.',
                    type: 'info'
                });
            }
        },

        remove_item: function(){
            var view = this;
            this.controller.send('remove_item');

            this.$('.modal, .modal-backdrop').one("transitionend", function() {
                view.controller.send('close_item');
            });

            this.$('.modal').removeClass('in');

        },

        add_item: function(){
            var view = this;

            view.controller.send('add_item');
            view.$('.modal, .modal-backdrop').one("transitionend", function() {
                view.controller.send('close_item');
            });
            view.$('.modal').removeClass('in');

        },

        close: function(outlet, parentView) {
            var view = this;

            this.$('.modal, .modal-backdrop').one("transitionend", function() {
                view.controller.send( 'close_modal', outlet, parentView );
            });

            this.$('.modal').removeClass('in');
        },

        /******************************************************************
         * BOOKING - item-list
         * */
        send_replica: function(){
            var view = this;

            this.controller.send('send_replica');

            this.$('.modal, .modal-backdrop').one("transitionend", function() {
                view.controller.send('close_item');
            });
            this.$('.modal').removeClass('in');
        },

        send_loadedOn: function(){
            var view = this;

            this.controller.send('send_loadedOn');

            this.$('.modal, .modal-backdrop').one("transitionend", function() {
                view.controller.send('close_item');
            });
            this.$('.modal').removeClass('in');
        },

        create_record: function(bookItem_type, tu_type, item, val) {
            var view = this;
            var booking = this.controller.booking_record;

            this.controller.send('createRecord_item', bookItem_type, tu_type, item, booking, val);

            this.$('.modal, .modal-backdrop').one("transitionend", function(ev) {
                view.controller.send('close');
            });
            this.$('.modal').removeClass('in');
        },

        new_plan: function(){
            var view = this;

            this.controller.get('store').createRecord('paymentPlan', {
                name: view.controller.planName,
                description: view.controller.planDescription,
                amount: view.controller.planAmount,
                currency: view.controller.planCurrency,
                credit: view.controller.planCredit
            }).save().then(function(val){

                view.$('.modal, .modal-backdrop').one("transitionend", function(ev) {
                    view.get('controller.controllers.application').autocompletePaymentPlan.pushObject(val);

                    view.controller.send('close_item');

                    view.controller.set('planName', null);
                    view.controller.set('planDescription', null);
                    view.controller.set('planAmount', null);
                    view.controller.set('planCurrency', null);
                    view.controller.set('planCredit', null);
                });

                view.$('.modal').removeClass('in');
            });
        },

        send_toStripe: function(){
            var view = this;

            if( this.controller.mm != null && this.controller.yyyy != null &&
                /^\d+$/.test(this.controller.cardNumber1) && /^\d+$/.test(this.controller.cardNumber2) &&
                /^\d+$/.test(this.controller.cardNumber3) && /^\d+$/.test(this.controller.cardNumber4)
                ) {
                this.controller.send('send_toStripe');

                this.$('.modal, .modal-backdrop').one("transitionend", function(ev) {
                    view.controller.send('close_item');
                });

                this.$('.modal').removeClass('in');

            } else {
                new PNotify({
                    title: 'Attention',
                    text: 'The payment details are not correct, please check them',
                    delay: 2000
                });
            }
        }
    }
});


