import Ember from 'ember';

export default Ember.View.extend({
    model_val:[],
    filter_val:[],
    val:[],
    path:[],

    focusOut: function() {
        var controller = this.get('controller'), permanotice = null;
        controller.send('checkUniqueField', this.model_val, this.filter_val, this.val, this.path);

        if( this.model_val === 'equipment' ) {
            /*
             *
             *
             *  numStr: prime quattro cifre del codice, devono essere lettere
             *  numChar: successive 6 cifre del codice, devono essere numeri
             *  lastChar: ultima/e cifre, il codice di controllo
             *  arrayChar: lista di lettere; ad ogni indice di arrayNum troviamo il numero corrispondente alla lettera
             *
             *  step A: converto le prime 4 lettere nei numeri corrispondenti
             *  step B: moltiplico ogni numero per 2 elevato alla sua posizione
             *  step C: sommo tutti i numeri dell'array 'tot_init', li divido per 11, tolgo i numeri dopo la virgola e moltiplico per 11.
             *
             *  se il risultato è uguale a 'lastChar' allora il codice è corretto. ex: CSQU3054383
             *
             *  per info : http://en.wikipedia.org/wiki/ISO_6346
             *
             *
             *  */

            var numStr = /^\d+$/.test(this.val.toUpperCase().substring(4)),
                numChar = this.val.toUpperCase().substring(0,4).match(/^[A-Za-z]+$/),
                lastChar = this.val.substring(10),
                valToArr = this.val.toUpperCase().split(''),
                tot_init = 0, tot_fin = 0,
                arrayChar = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
                arrayNum = [10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 38];

            for( var i = 0; i < 10; i++ ) {
                if( i < 4 ){
                    tot_init = tot_init + arrayNum[arrayChar.indexOf(valToArr[i])] * Math.pow(2,i);
                } else {
                    tot_init = tot_init + Number(valToArr[i]) * Math.pow(2,i);

                    if(i === 9) {
                        tot_fin = tot_init - (Math.floor(tot_init / 11) * 11);

                        if( numStr === null || numChar === false || tot_fin.toString() !== lastChar ) {
                            if (permanotice) {
                                permanotice.open();
                            } else {
                                permanotice = new PNotify({
                                    title: 'Warning',
                                    text: 'The equipment code is not in the correct form.',
                                    hide: false,
                                    buttons: {
                                        closer: true,
                                        sticker: false
                                    }
                                });
                            }
//                            new PNotify({
//                                title: 'Warning',
//                                text: 'The equipment code is not in the correct form.',
//                                type: 'info'
//                            });
                        }
                    }
                }
            }
        }
    }
});

