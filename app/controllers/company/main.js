import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_company: Ember.computed.alias('controllers.application.company'),
    app_controller: Ember.computed.alias('controllers.application'),
    companyType: Ember.computed.alias('controllers.application.companyType'),
    app_controller_token: Ember.computed.alias('controllers.application.token'),
    app_controller_companyType: Ember.computed.alias('controllers.application.companyType'),

    typeAdmin: Ember.computed.equal('companyType', 'admin'),
    typeShipowner: Ember.computed.equal('companyType', 'shipowner'),

    is_admin: function(){
        return ( this.get('app_controller_companyType') === 'admin' );
    }.property('app_controller_companyType'),

    is_myCompany: function(){
         return ( String(this.get('company_id')) === String(this.get('app_company')) );
    }.property('company_id', 'app_company'),

    userId: null,
    companyRecord: null,
    company_id: null,
    fileRecord: null,
    isView: true,

    /*********************
     * TAB MANAGER
     **/
    tabList: Ember.A(
        {'details': false},
        {'users': false},
        {'files': false}
    ),

    /*********************
     * TAB DETAILS
     **/
    newEmail: null,

    /*********************
     * TAB USERS
     **/
    itemListActive: false,
    itemEditActive: false,
    userRecord: null,

//    unique : null,
//    newVisibility: null,
    userTypeClassification: [
        'user',
        'powerUser'
    ],

    grantsList: [
       'Global',
       'Deep',
       'Local',
       'Basic',
       'None'
    ],

    actions:{

        newName: null,
        newSurname: null,
        newDate: null,
        newUsername: null,
        newPassword: null,
        newEmail: null,
        newPhone: null,
        newType: 'user',

        createUser: function( _btn, id ) {
            var self = this;
            this.companyId = id;
            var data = this.getProperties(
                'newName',
                'newSurname',
                'newDate',
                'newUsername',
                'newPassword',
                'newEmail',
                'newPhone',
                'newType'//,
                //'newVisibility'
            );

            this.unique = data.newName != null && data.newName.length > 1 &&
                data.newSurname != null && data.newSurname.length > 1 &&
                data.newUsername != null && data.newUsername.length > 1 &&
                data.newEmail != null && data.newEmail.length > 1 &&
                data.newPassword != null && data.newPassword.length > 1;

            // if data = null --> warning else return to default state
            ( data.newName != null && data.newName.length > 1 ? $('span#1.input-group-addon').removeClass('alert-danger') : $('span#1.input-group-addon').addClass('alert-danger'));
            ( data.newSurname != null && data.newSurname.length > 1 ? $('span#2.input-group-addon').removeClass('alert-danger') : $('span#2.input-group-addon').addClass('alert-danger'));
            ( data.newUsername != null && data.newUsername.length > 1 ?  $('span#3.input-group-addon').removeClass('alert-danger') : $('span#3.input-group-addon').addClass('alert-danger'));
            ( data.newPassword != null && data.newPassword.length > 1 ? $('span#4.input-group-addon').removeClass('alert-danger') : $('span#4.input-group-addon').addClass('alert-danger'));
            ( data.newEmail != null && data.newEmail.length > 1 ? $('span#5.input-group-addon').removeClass('alert-danger') : $('span#5.input-group-addon').addClass('alert-danger'));

            //var date = null;

//            if(data.newDate){
//                var date = new Date();
//                var arrayDate = data.newDate.split("-");    //year - month - day
//                date.setProperties({year: arrayDate[0], month: arrayDate[1], day: arrayDate[2]});
//            }

            if(this.unique){
                //REMOVE THE WARNING
                //$('div.alert.alert-danger').css('display', 'none');

                var userNew = this.store.createRecord('user', {
                    firstName: data.newName,
                    lastName: data.newSurname,
                    birthDate: data.newDate,
                    username: data.newUsername,
                    password: data.newPassword,
                    email: data.newEmail,
                    phone: data.newPhone,
                    type: data.newType,
                    //grants: [""],
                    visibility: 'private'//data.newVisibility
                });

                this.store.find('company', this.companyId).then(function(company){
                    userNew.set('company', company).save().then(function() {

                        self.set('newName', null);
                        self.set('newSurname', null);
                        self.set('newDate', null);
                        self.set('newUsername', null);
                        self.set('newPassword', null);
                        self.set('newEmail', null);
                        self.set('newPhone', null);
                        self.set('newVisibility', null);

                        _btn.stop();
                        //SUCCESS
                        new PNotify({
                            title: 'Saved',
                            text: 'You successfully saved new user.',
                            type: 'success',
                            delay: 1000
                        });

                        self.store.find('company', self.companyId).then(function(company) {
                            company.reload().then(function(){
                                self.set('itemListActive',false);
                                self.set('itemEditActive',false);
                            });
                        });
                        //self.transitionToRoute('companies.companyViews.companyView', self.companyId);
                    }, function() {
                        _btn.stop();
                        //NOT SAVED
                        new PNotify({
                            title: 'Not saved',
                            text: 'A problem has occurred.',
                            type: 'error',
                            delay: 2000
                        });
                    });

                });

            } else {
                //WARNING
                new PNotify({
                    title: 'Attention',
                    text: 'please check if required fields have been entered.',
                    type: 'error',
                    delay: 2000
                });

                //$('div.alert.alert-danger').css('display', 'inline-block');
            }
        }
    }//,
//    userProfileChanged: function() {
//        localStorage.userProfile = App.get('userProfile');
//    }.observes('App.userProfile')
});
