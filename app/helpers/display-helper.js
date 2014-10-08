import Ember from 'ember';

export default function(searchPath) {
    return new Ember.Handlebars.SafeString(Ember.get(this, searchPath));
}
