import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['document/new-record'],

    isChecked: false,
    registerOnParent: function(){
        //register
        this.send('managerCheckLists', null, this, null, "origin_LL", true);    //all'inziio ogni oggetto dell'each helper viene inserito nelle liste ed inizializzato a false
    }.on('init'),
    willDestroy: function(){
        //de-register
        this.send('managerCheckLists', null, this, null, "origin_LL", false);   // se l'each cambia gli oggetti vengono eliminati dalla lista per essere sostituiti con i nuovi
    }
});
