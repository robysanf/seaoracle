import Ember from 'ember';
import DS from 'ember-data';

var get = Ember.get,
    set = Ember.set;
    //addObserver = Ember.addObserver;

export default Ember.Component.extend({
    classNameBindings: [':autocomplete'],
    minChars: 1,
    searchPath: 'name',
    query: null,
    selectionIndex: -1,

    KEY_DOWN: 40,
    KEY_UP: 38,
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,

    displayResults: [],
    thereIsAVal : false,

    init: function(){
        console.log('init');
        this._super.apply(this, arguments);
        Ember.addObserver(this, 'query', this.queryDidChange);
        set(this, 'displayResults', []);
    },

    down: function( ev ) {
        if ( ev.keyCode === this.KEY_DOWN ) {
            this.send('moveSelection', 'down');
            return false;
        }
    }.on( 'keyDown' ),

    up: function( ev ) {
        if ( ev.keyCode === this.KEY_UP ) {
            this.send('moveSelection', 'up');
            return false;
        }
    }.on( 'keyUp' ),

    press: function( ev ) {
        console.log('keyPress');
        var _this = this;

        if ( ev.keyCode === this.ENTER ) {
            var displayResults = get(_this, 'displayResults');
            var displayResultsLength = get(_this, 'displayResults.length');

            if(!displayResultsLength){
                return;
            }

            var active = displayResults.find(function( item ){
                return get(item, 'active');
            });

            if(!active){
                _this.send('hideResults');
                return;
            }
            _this.send('addSelection', active);
        }
    }.on( 'keyPress' ),

    /*
    gestione degli eventi di tipo click e key-press
    @action: didInsertElement
    */
    didInsertElement: function(){
        var self = this; //allowedKeyCodes = Ember.A([this.KEY_UP, this.KEY_DOWN, this.TAB, this.ENTER, this.ESCAPE]);

        //this.set('allowedKeyCodes', allowedKeyCodes);

        Ember.assert('You must supply a source for the autocomplete component', get(this, 'source'));
        //Ember.assert('You must supply a destination for the autocomplete component', get(this, 'destination'));

        this.$('ul.suggestions-autocomplete').on('mouseover', 'li', this.mouseOverAutocomplete.bind(this));
        this.$('ul.suggestions-autocomplete').on('mouseout', 'li', this.mouseOutAutocomplete.bind(this));
        this.$('ul.suggestions-autocomplete').on('mouseleave', this.mouseLeaveAutocomplete.bind(this));
    },

    actions: {
        addSelection: function(selection){
            //console.log('addSelection');
            set(this, 'query', '');
            set(this, 'destination', selection) ;
            set(this, 'thereIsAVal', true);
            this.send('hideResults', this );

            set(this, 'selectionIndex', -1);
        },


        hideResults: function( _this ){
            //console.log('hideResults');
            var _displayResults = get(_this, 'displayResults');

            set(_this, 'selectionIndex', -1);

            if(!get(_displayResults, 'length')){
                _this.$('.no-results').addClass('hdn');
            }

            _this.$('.results').addClass('hdn');
        },

        removeSelection: function(){
            //console.log('removeSelection');
            //get(this, 'destination').removeObject(item);
            set(this, 'destination', null);
            set(this, 'thereIsAVal', false);
        },

        displayAllResults: function(query){
            //console.log('displayAllResults');
            var self = this;
            this._queryPromise(query).then(function(results){
                self.processResults(query, results);
                self.positionResults();
            });
        },

        /*azione a livello di layout per gestire il doppio pulsante rimuovielemento/cerca*/
        buttonManager: function( query ) {
            //console.log('buttonManager');
            if(this.thereIsAVal) {
                this.send('removeSelection', query);
            } else {
                this.send('displayAllResults', "");
            }
        },

        moveSelection: function( direction ){
            var self = this;
            //console.log('moveSelection: '+this.displayResults);
            var selectionIndex = get(this, 'selectionIndex'),
                isUp = direction === 'up',
                isDown = !isUp,
                _displayResults = get(this, 'displayResults'),
                _displayResultsLength = get(this, 'displayResults.length'),
                searchPath = get(self, 'searchPath'),
                hoverEl;

            if( !_displayResultsLength ){
                set(self, 'selectionIndex', -1);
                return;
            } else {
                _displayResults.setEach('active', false);
            }

            hoverEl = this.$('li.result.hover');

            if(hoverEl !== undefined){
                if(hoverEl.length){
                    var text = Ember.$('span', hoverEl).text(),
                        selected = _displayResults.find(function(item){
                            return get(item, searchPath) === text;
                        });

                    selectionIndex = _displayResults.indexOf(selected);

                    this.$('ul.suggestions-autocomplete li').removeClass('hover');
                    this.$('input.autocomplete').focus();
                }
            }


            if(isUp && selectionIndex <= 0){
                selectionIndex =  0;
            }
            else if(isDown && selectionIndex === _displayResultsLength -1){
                selectionIndex = _displayResultsLength -1;
            }else if(isDown){
                selectionIndex++;
            }else{
                selectionIndex--;
            }

            var active = get(self, 'displayResults').objectAt(selectionIndex);

            set(self, 'selectionIndex', selectionIndex);

            set(active, 'active', true);
        }
    },

    _queryPromise: function( query ){
        //console.log('_queryPromise');
        var source = get(this, 'source'),
            searchPath = get(this, 'searchPath'),
            store = get(this, 'store');
        return new Ember.RSVP.Promise(function(resolve, reject){
            //return Ember.RSVP.Promise(function(resolve, reject){
            if(('undefined' !== typeof DS) && (DS.Model.detect(source))){
                var queryExpression = {};

                queryExpression[searchPath] = query;

                var type = source.toString().humanize();

                store.find(type, queryExpression).then(resolve, reject);

            }
            else if(source.then){
                source.then(resolve, reject);
            }else{
                resolve(source);
            }
        });
    },

    queryDidChange: function(){
        //console.log('queryDidChange');
        var query = get(this, 'query'),
            displayResults = get(this, 'displayResults'),
            hasQuery = get(this, 'hasQuery'),
            self = this;

        if(!hasQuery){
            set(this, 'selectionIndex', -1);
            displayResults.clear();
            return;
        }

        this._queryPromise(query).then(function(results){
                self.processResults(query, results);
            },

            function(e){
                console.log(e.message);
                console.log(e.stack);
                throw e;
            });
    },

    processResults: function(query, source){
        //console.log('processResults');
        var self = this,
            displayResults = get(this, 'displayResults');

        var results = source.filter(function(item){

            if(item.get(get(self, 'searchPath'))){        // aggiunto controllo di esistenza:  if(item.get(get(self, 'searchPath'))){    mi serve per escludere dalla lista campi nulli
                return item.get(get(self, 'searchPath')).toLowerCase().search(query.toLowerCase()) !== -1;
            }
        });

        if(get(results, 'length') === 0){
            return displayResults.clear();
        }

        this.positionResults();

        var searchPath = get(this, 'searchPath');

        displayResults.clear();

        displayResults.pushObjects(Ember.A(results.sort(function(a, b){
            return Ember.compare(get(a, searchPath), get(b, searchPath));
        })));

        //console.log('2 displayResults: '+displayResults);
    },

    hasQuery: Ember.computed(function(){
        //console.log('hasQuery');
        var query = get(this, 'query');
        if(query && query.length > get(this, 'minChars')){
            this.positionResults();
            return true;
        }

        return false;
    }).property('query'),

    mouseOverAutocomplete: function( evt ){
        //console.log('mouseOver');
        var el = this.$(evt.target);

        var active = get(this, 'displayResults').filter(function(item){
            return get(item, 'active');
        });

        if(active || active.length){
            active.setEach('active', false);
            set(this, 'selectionIndex', -1);
        }

        if(el.hasClass('result-name')){
            return;
        }
        this.$('ul.suggestions-autocomplete li').removeClass('hover');
        el.addClass('hover');
    },

    mouseOutAutocomplete: function(evt){
        //console.log('mouseOut');
        var target = $(evt.target);
        if(target.parents('ul').hasClass('suggestions-autocomplete')){
            return;
        }
        this.$('ul.suggestions-autocomplete li').removeClass('hover');
    },

    mouseLeaveAutocomplete: function(){
        //console.log('mouseLeave');
        var _this = this;
        $( "div.ember-view" ).click(function() {        //clickando fuori dal contesto si chiude il menù a tendina
            _this.send('hideResults', _this)
        });
    },

    positionResults: function(){
        //console.log('positionResults');
        var results = this.$('.results');

        var suggestions = this.$('ul.suggestions-autocomplete'),
            el = this.$(),
            position = el.position();

        results.removeClass('hdn');

        suggestions.css('position', 'absolute');
        suggestions.css('left', position.left);
        suggestions.css('top', position.top + this.$().height());

        var width = el.outerWidth();

        suggestions.css('width', width);
    },

    autocomplete: Ember.TextField.extend({
        init: function(){
            //console.log('autocomplete init');
            this._super.apply(this, arguments);
        }
    }),

    _yield: function(context, options) {
        //console.log('_yield');
        var get = Ember.get,

            view = options.data.view,
            parentView = this._parentView,
            template = get(this, 'template');

        if (template) {
            Ember.assert("A Component must have a parent view in order to yield.", parentView);
            view.appendChild(Ember.View, {
                isVirtual: true,
                tagName: '',
                _contextView: parentView,
                template: template,
                context: get(view, 'context'), // the default is get(parentView, 'context'),
                controller: get(view, 'controller'), // the default is get(parentView, 'context'),
                templateData: { keywords: parentView.cloneKeywords() }
            });
        }
    }
});
