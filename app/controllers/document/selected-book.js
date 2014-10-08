import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['document/new-record'],
    /*  NOTA BENE
     *   non è stato possibile spostare la variabile  'selectedBookItList' all'interno di questo controller poichè
     *   non so come fare per agganciarmici dal route... con controllerFor non funziona, neanche utilizzando i 'needs'
     *   o dichiarando l'itemController a livello di documents.documentsNew Controller.
     * */


    /*   ALL CHECKED
     *
     *   arguments.length === 1 --> caso iniziale in cui vengono mostrati a video i dati per la prima volta
     *                     else --> viene premuto uno dei checkbox a livello di booking che controllano i booking item
     *
     *   if(key == 'allChecked' && value == true) --> se è stato fatto il check di un booking tutti i suoi figli (booking item)
     *                                                verrano checkkati a loro volta.
     *                                       else --> se viene de-checkkato un booking il check dei suoi figli
     *                                                viene impostato a false
     *
     * */

    allChecked: function( key, value ) {
        var bookId= this.get('content').get('id');

        if (arguments.length === 1) {
            this.send('managerCheckLists', this, null, "allChecked", false);
        } else {
            this.send('managerCheckLists', bookId, value, key, "allChecked", true);
        }
    }.property('selectedBookItList.@each.isChecked')
});
