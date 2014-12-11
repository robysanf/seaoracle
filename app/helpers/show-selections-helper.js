import Ember from 'ember';

export default function(usecase, searchPath) {
    switch (usecase) {
        case 'originalMode':
            return new Ember.Handlebars.SafeString(Ember.get(this, searchPath));
        case 'customMode':
            return this;
        case 'customModeWithoutSource':
            return this;
    }
}
