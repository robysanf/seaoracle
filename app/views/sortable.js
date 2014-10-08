import Ember from 'ember';

export default Ember.View.extend({
    type: [],

    didInsertElement: function() {
        var view = this, indexes={};

        switch(this.type) {
            case 'freight-plan-selection':
                $(".sortable").sortable({
                    //every change set temporaryList
                    update: function() {
                        view.get('controller').set('sorted_list', []);

                        $(this).find('.sort-item').each(function(index) {
                            view.get('controller').sorted_list.pushObject({
                                sort_index: $(this).data('id'),
                                record_index: $(this).data('value')
                            });

                        });
                        //view.get('controller').send('update_temporaryRecordsList');
                    }
                });
                break;
            case 'new':
                //initialize templateList
                $(".sortable").find('.list-group-item').each(function(index) {
                    indexes[index] = $(this).data('id');
                    view.get('controller').temporary_index_list[index] = $(this).data('value');
                });
                view.get('controller').send('update_temporaryRecordsList', indexes);

                $(".sortable").sortable({
                    //every change set temporaryList
                    update: function() {
                        var indexes={};

                        $(this).find('.list-group-item').each(function(index) {
                            indexes[index] = $(this).data('id');
                            view.get('controller').temporary_index_list[index] = $(this).data('value');
                        });
                        view.get('controller').send('update_temporaryRecordsList', indexes);
                    }
                });
                break;
            case 'edit':
                //initialize templateList
                $(".sortable").find('.list-group-item').each(function(index) {

                    //view.get('controller').listOfElements[index] =  $(this).data('id');
                    indexes[index] = $(this).data('id');
                    view.get('controller').temporary_index_list[index] = $(this).data('value');
                });
                view.get('controller').send('update_temporaryRecordsList', indexes);

                $(".sortable").sortable({
                    //every change set temporaryList
                    update: function() {
                        var indexes={};

                        $(this).find('.list-group-item').each(function(index) {
                            // view.get('controller').listOfElements[index] =  $(this).data('id');
                            indexes[index] = $(this).data('id');  //id dei record
                            view.get('controller').temporary_index_list[index] = $(this).data('value');  //posizioni nell'array
                        });

                        view.get('controller').send('update_temporaryRecordsList', indexes);

                    }
                });
                break;
        }
    }
});

