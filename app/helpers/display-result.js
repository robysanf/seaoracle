import Ember from 'ember';

export default function(searchPath, destination, size) {
    var myResult = Ember.get(this, 'destination').get(searchPath);
    if(myResult !== undefined) {
        return myResult.substring(0, size);
    } else {
        return myResult;
    }
}