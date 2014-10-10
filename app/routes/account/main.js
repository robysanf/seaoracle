import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var _this = this, controller = _this.controllerFor('account.main'), app_controller = _this.controllerFor('application');

        //imposto la tab company come default per 'your-profile'
        if( controller.tabList.account !== true && controller.tabList.buyCredits !== true && controller.tabList.orderHistory !== true ) {
            controller.set('tabList.account', true);
        }

        if( !app_controller.autocompletePaymentPlan.get('length') ) {
            this.store.findQuery("payment-plan").then(function(val){
                app_controller.set("autocompletePaymentPlan", val);
            });
        }
    },

    model: function( user ) {
        return this.store.find('user', user.user_id);
    },

    actions: {
        /**
         Gestione della tab navigation in 'your-profile'; rende attiva la tab selezionata dall'utente

         @action setTabs
         @for your-profile/main-page
         @param {string} tab selezionata dall'utente - (company/driver/truck/trailer/clerk)
         */
        setTabs: function( tabToActive ){
            var _this = this;

            _this.controller.set('tabList.account',false);
            _this.controller.set('tabList.buyCredits',false);
            _this.controller.set('tabList.orderHistory',false);

            _this.controller.set('tabList.' + tabToActive, true);
        },

        open_modal: function( path, record ) {
            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        send_toStripe: function() {
            var _this = this, app_controller = _this.controllerFor('application'),
                data = this.getProperties(), customerData = this.getProperties();

            data.number = _this.controller.cardNumber1;
            data.number = data.number + _this.controller.cardNumber2;
            data.number = data.number + _this.controller.cardNumber3;
            data.number = data.number + _this.controller.cardNumber4;
            data.cvc = _this.controller.cvc;
            data.exp_month = _this.controller.mm;
            data.exp_year = _this.controller.yyyy;

            this.store.find('user', app_controller.userId).then(function(user){
                user.set('cardNumber', _this.controller.cardNumber4);
                user.save().then(function(){
                    user.reload();
                })
            });

            Stripe.card.createToken(data, stripeResponseHandler);

            function stripeResponseHandler(status, response) {
                _this.controller.set('cardNumber', null);
                _this.controller.set('cvc', null);
                _this.controller.set('mm', null);
                _this.controller.set('yyyy', null);

                if (response.error) {
                    // Show the errors on the form
                    new PNotify({
                        title: 'Error',
                        text: response.error.message,
                        type: 'warning',
                        delay: 2000
                    });
                } else {
                    // response contains id and card, which contains additional card details
                    customerData.token = response.id;
                    customerData.user_id = app_controller.userId;
                      //https://test.zenointelligence.com/seaforward/
                    $.post('api/custom/customerCard?token=' + app_controller.token, customerData).then(function(response){
                        if (response.success) {
                            new PNotify({
                                title: 'Well done',
                                text: 'You successfully save payment details',
                                type: 'success',
                                delay: 2000
                            });

                            _this.controller.set('curr_pwd', null);
                            _this.controller.set('new_pwd', null);
                            _this.controller.set('confirm_pwd', null);
                            //_this.set('successMessage', 'Well done: You successfully changed password.');
                        }
                    }, function(){
                        new PNotify({
                            title: 'Error',
                            text: 'A problem was occurred.',
                            type: 'error',
                            delay: 2000
                        });
                        _this.controller.set('curr_pwd', null);
                        _this.controller.set('new_pwd', null);
                        _this.controller.set('confirm_pwd', null);
                        //_this.set('errorMessage', 'Warning: username or password incorrect, please check them.');
                    });
                }
            }
        },

        delete_plan: function( model, record ) {
            var _this = this, app_controller = _this.controllerFor('application');
            record.deleteRecord();
            record.save().then(function(val){
                _this.store.findQuery("paymentPlan").then(function(val){
                    app_controller.set("autocompletePaymentPlan", val);
                });
            });
        },

        new_refill: function(payment, company, user, $btn) {
            var _this = this, app_controller = _this.controllerFor('application'),
                today = new Date(), data = this.getProperties();

            data.paymentPlan = payment.get('id');
            data.date = moment(today).format("YYYY-MM-DD");
            data.amount = payment.get('amount');
            data.credit = payment.get('credit');
            data.currency = payment.get('currency');
            data.company = company.get('id');
            data.user = user.get('id');
                    //https://test.zenointelligence.com/seaforward/
            $.post('api/custom/refill?token=' + app_controller.token, data).then(function(response){

                if (response.success) {
                    company.reload();
                    $btn.set('disabled', false);

                    new PNotify({
                        title: 'Well done',
                        text: 'You successfully save refill',
                        type: 'success',
                        delay: 2000
                    });
                }
            }, function(response){
                var json = response.responseText, obj = JSON.parse(json);
                $btn.set('disabled', false);
                new PNotify({
                    title: 'Error',
                    text: obj.message,
                    type: 'error',
                    delay: 2000
                });
            });
        },

        download_file: function( fileId ) {
            var _this = this, app_controller = _this.controllerFor('application'),
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

        close_item: function(){
            var self = this, app_controller = self.controllerFor('application');

            app_controller.send('close_modal', 'overview', 'application');
            this.send('closeSearch');
        }

    }
});
