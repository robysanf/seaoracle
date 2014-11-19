import Ember from 'ember';

export default Ember.View.extend({
    didInsertElement: function(){
        $(window).on('scroll', $.proxy(this.didScroll, this));
    },

    willDestroyElement: function(){
        $(window).off('scroll', $.proxy(this.didScroll, this));
    },

    didScroll: function(){
        if (this.isScrolledToBottom()) {
            this.get('controller').send('getMore');
        }
    },

    isScrolledToBottom: function(){
        var distanceToViewportTop = (
            $(document).height() - $(window).height());
        var viewPortTop = $(document).scrollTop();

        if (viewPortTop === 0) {
            return false;
        }

        return (viewPortTop - distanceToViewportTop === 0);
    }
});
