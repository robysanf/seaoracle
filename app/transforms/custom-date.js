
import DS from 'ember-data';

export default DS.Transform.extend({
    deserialize: function(serialized) {
        var isNull =  (serialized === null || serialized === undefined || serialized === '');
        return isNull ? null : serialized;
        //return Ember.isNone(serialized) ? null : serialized;
    },

    serialize: function(deserialized) {
        var isNull =  (deserialized === null || deserialized === undefined || deserialized === '');
        return isNull ? null : moment(deserialized).format("YYYY-MM-DD");
        //return Ember.isNone(deserialized) ? null : moment(deserialized).format("YYYY-MM-DD");
    }
});
