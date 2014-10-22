import Ember from 'ember';

export default Ember.Route.extend({
    setupController: function(controller) {
        controller.reset();
    },

    actions: {
        change_newLog: function(val) {
            this.get('controller').set('newLog', val);
        },

        new_signUp: function() {

            var _this = this, data = this.controller.getProperties(
                'firstName',
                'lastName',
                'username',
                'pwd',
                'userEmail',
                'name',
                'vatNumber',
                'street',
                'city',
                'zipCode',
                'country',
                'companyEmail',
                'companyType'
            );

            if( (data.firstName !== '' && data.firstName !== null) &&
                (data.lastName !== '' && data.lastName !== null) &&
                (data.username !== '' && data.username !== null) &&
                (data.pwd !== '' && data.pwd !== null) &&
                (data.userEmail !== '' && data.userEmail !== null) &&
                (data.name !== '' && data.name !== null) &&
                (data.vatNumber !== '' && data.vatNumber !== null) &&
                (data.street !== '' && data.street !== null) &&
                (data.city !== '' && data.city !== null) &&
                (data.zipCode !== '' && data.zipCode !== null) &&
                (data.country !== '' && data.country !== null) &&
                (data.companyEmail !== '' && data.companyEmail !== null) &&
                (data.companyType !== '' && data.companyType !== null) ){

                data.userType = 'powerUser';
                // Clear out any error messages.
                this.set('errorMessage', null);
                $.post('api/signUp', data).then(function(response){
                    if (response.success) {
                        new PNotify({
                            title: 'Success',
                            text: 'We have sent to '+data.userEmail +' an email to verify your email address.',
                            type: 'success'
                        });
                    }
                    _this.get('controller').set('firstName', null);
                    _this.get('controller').set('lastName', null);
                    _this.get('controller').set('username', null);
                    _this.get('controller').set('pwd', null);
                    _this.get('controller').set('userEmail', null);
                    _this.get('controller').set('name', null);
                    _this.get('controller').set('vatNumber', null);
                    _this.get('controller').set('street', null);
                    _this.get('controller').set('city', null);
                    _this.get('controller').set('zipCode', null);
                    _this.get('controller').set('country', null);
                    _this.get('controller').set('companyEmail', null);
                    _this.get('controller').set('companyType', null);

                    _this.get('controller').set('newLog', 0);

                }, function(){
                    new PNotify({
                        title: 'Error',
                        text: 'Something went wrong sending the email. Please check the e-mail field in your company profile.',
                        type: 'error'
                    });
                });
            } else {
                new PNotify({
                    title: 'Error',
                    text: 'All fields have to be compiled.',
                    type: 'error'
                });
            }

        },

        open_modal: function( path ) {
            this.render( path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        }
    }
});
