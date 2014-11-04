import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    myList: [],
    newLog: 0,
    companyTypeList: ['client', 'agency', 'shipowner'],

    reset: function() {
        this.get('controllers.application').set('isLogin', true);
        this.setProperties({
            username: '',
            password: '',
            //errorMessage: '',
            newLog: 0,
            firstName: '',
            lastName: '',
            pwd:'',
            userEmail: '',
            name:'',
            vatNumber: '',
            street: '',
            city: '',
            zipCode: '',
            country: '',
            email: '',
            companyType: 'client'
        });
    },
    actions:{
        login: function() {

            var self = this, data = this.getProperties('username', 'password');

            //$.post('https://test.zenointelligence.com/seaforward/api/auth', data).then(function(response){
            //$.post('http://localhost/seaforward/api/auth', data).then(function(response){
            $.post('api/auth', data).then(function(response){
                if (response.success) {

                    //inizializzo variabili globali in application
                    self.get('controllers.application').set('company', response.company_id);
                    self.get('controllers.application').set('token', response.token);
                    self.get('controllers.application').set('companyType', response.company_type);
                    self.get('controllers.application').set('userId', response.user_id);
                    self.get('controllers.application').set('username', data.username);
                    self.get('controllers.application').set('isAdmin', response.isAdmin);

                    self.store.find('company', response.company_id).then(function( val ){
                        self.get('controllers.application').set('company_record', val);

                        self.get('controllers.application').company_record.reload();
                    });

                    self.store.find('user', response.user_id).then(function(val){
                        var json, queryExpression = {}, name = '';

                        val.get('grants').then(function(grants){
                            grants.forEach(function(grant, index){
                                name = grant.get('value');

                                queryExpression[name] = grant.get('access');
                                queryExpression[name + '_new'] = (grant.get('accessNew') !== 'None');
                                queryExpression[name + '_view'] = (grant.get('accessView') !== 'None');
                                queryExpression[name + '_edit'] = (grant.get('accessEdit') !== 'None');
                                queryExpression[name + '_remove'] = (grant.get('accessRemove') !== 'None');

                                if( val.get('grants').get('length') === index + 1 ){
                                    //diverso perchè si tratta di un array; per metterlo su localstorage devo renderlo una stringa.
                                    //quando invece lo voglio buttare dentro application lo devo ritrasformare in array
                                    localStorage["user_record"] = JSON.stringify(queryExpression);
                                    self.get('controllers.application').set('user_record', queryExpression);

                                    localStorage["grantsValue"] = JSON.stringify(response.grants);
                                    self.get('controllers.application').set('grantsValue', response.grants);

                                    self.transitionToRoute('dashboard/main');
                                    self.get('controllers.application').set('isLogin', false);
                                }
                            });
                        });
                    });

                }
            }, function(){
                new PNotify({
                    title: 'Warning',
                    text: 'Username or password incorrect, please check them.',
                    type: 'error'
                });
            });
        }
    }
});
