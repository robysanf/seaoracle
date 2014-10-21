import Ember from 'ember';
import DS from 'ember-data';

var get = Ember.get,
    set = Ember.set,
    addObserver = Ember.addObserver;

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

    thereIsAVal : false,

//    itemView : Ember.View.extend({
//        layoutName: 'item',
//        value: [],
//
//        keyPress: function( ev ) {
//            var _this = this;
//            if (ev.keyCode === 13) {
//                _this.send("addSelection", _this.value);
//            }
//        }
//    }),

//    autocompleteResult : Ember.View.extend({
//        value: [],
//
//        keyPress: function( ev ) {
//            var _this = this;
//            if (ev.keyCode === 13) {
//                _this.send("addSelection", _this.value);
//            }
//        }
//    }),

    init: function(){
        this._super.apply(this, arguments);
        addObserver(this, 'query', this.queryDidChange);
        set(this, 'displayResults', Ember.A());
    },

    keyPress: function( ev ) {
        var _this = this;
        if (ev.keyCode === 13) {
            _this.send("addSelection", _this.value);
        }
    },

    didInsertElement: function(){
        var self = this, allowedKeyCodes = Ember.A([this.KEY_UP, this.KEY_DOWN, this.TAB, this.ENTER, this.ESCAPE]);

        this.set('allowedKeyCodes', allowedKeyCodes);

        Ember.assert('You must supply a source for the autocomplete component', get(this, 'source'));
        //Ember.assert('You must supply a destination for the autocomplete component', get(this, 'destination'));

        this.$('ul.suggestions-autocomplete').on('mouseover', 'li', this.mouseOver.bind(this));
        this.$('ul.suggestions-autocomplete').on('mouseout', 'li', this.mouseOut.bind(this));
        this.$('ul.suggestions-autocomplete').on('mouseleave', this.mouseLeave.bind(this));

        $(document).keyup(function( e ){
            var keyCode = e.keyCode;

            if(!allowedKeyCodes.contains(keyCode)){
                return;
            }

            switch(keyCode){
                case self.KEY_UP:
                    self.send('moveSelection', 'up');
                    break;
                case self.KEY_DOWN:
                    self.send('moveSelection', 'down');
                    break;
                case self.ENTER:
                    self.send('selectActive');
                    break;
                case self.ESCAPE:
                    self.send('hideResults');
                    break;
//                default:
//                    console.log(keyCode);
            }
        });
    },

    actions: {
        addSelection: function(selection){
            set(this, 'query', '');
            set(this, 'destination', selection) ;
            set(this, 'thereIsAVal', true);
            this.send('hideResults');

            set(this, 'selectionIndex', -1);
        },


        hideResults: function(){
            var displayResults = get(this, 'displayResults');

            set(this, 'selectionIndex', -1);

            if(!get(displayResults, 'length')){
                this.$('.no-results').addClass('hdn');
            }

            this.$('.results').addClass('hdn');
        },

        removeSelection: function(){
            //get(this, 'destination').removeObject(item);
            set(this, 'destination', null);
            set(this, 'thereIsAVal', false);
        },

        displayAllResults: function(query){
            var self = this;
            this._queryPromise(query).then(function(results){
                self.processResults(query, results);
                self.positionResults();
            });
        },

        buttonManager: function( query ) {
            if(this.thereIsAVal) {
                this.send('removeSelection', query);
            } else {
                this.send('displayAllResults', "");
            }
        },

        moveSelection: function( direction ){
            var selectionIndex = get(this, 'selectionIndex'),
                isUp = direction === 'up',
                isDown = !isUp,
                displayResults = get(this, 'displayResults'),
                displayResultsLength = get(displayResults, 'length'),
                searchPath = get(this, 'searchPath'),
                hoverEl;

            displayResults.setEach('active', false);

            if(!displayResultsLength){
                set(this, 'selectionIndex', -1);
                return;
            }

            hoverEl = this.$('li.result.hover');

            if(hoverEl !== undefined){
                if(hoverEl.length){
                    var text = Ember.$('span', hoverEl).text(),
                        selected = displayResults.find(function(item){
                            return get(item, searchPath) === text;
                        });

                    selectionIndex = displayResults.indexOf(selected);

                    this.$('ul.suggestions-autocomplete li').removeClass('hover');

                    this.$('input.autocomplete').focus();
                }
            }


            if(isUp && selectionIndex <= 0){
                selectionIndex =  0;
            }
            else if(isDown && selectionIndex === displayResultsLength -1){
                selectionIndex = displayResultsLength -1;
            }else if(isDown){
                selectionIndex++;
            }else{
                selectionIndex--;
            }

            var active = get(this, 'displayResults').objectAt(selectionIndex);

            set(this, 'selectionIndex', selectionIndex);

            set(active, 'active', true);
        },


        selectActive: function(){
            var displayResults = get(this, 'displayResults');
            var displayResultsLength = get(this, 'displayResults.length');

            if(!displayResultsLength){
                return;
            }

            var active = displayResults.find(function( item ){
                return get(item, 'active');
            });

            if(!active){
                this.send('hideResults');
                return;
            }

            this.send('addSelection', active);
        }
    },

    _queryPromise: function( query ){
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
    },

    hasQuery: Ember.computed(function(){
        var query = get(this, 'query');
        if(query && query.length > get(this, 'minChars')){
            this.positionResults();
            return true;
        }

        return false;
    }).property('query'),

    mouseOver: function( evt ){
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

    mouseOut: function(evt){
        var target = $(evt.target);
        if(target.parents('ul').hasClass('suggestions-autocomplete')){
            return;
        }
        this.$('ul.suggestions-autocomplete li').removeClass('hover');
    },

    mouseLeave: function(){
        var _this = this;
        $( "div.ember-view" ).click(function() {        //clickando fuori dal contesto si chiude il menù a tendina
            _this.send('hideResults')
        });
    },

    positionResults: function(){
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
            this._super.apply(this, arguments);
        }
    }),

    _yield: function(context, options) {
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
