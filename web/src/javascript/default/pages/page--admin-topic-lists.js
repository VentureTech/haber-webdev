jQuery(function($) {

    var SELECT_OPTIONS = {
        width: function() {
            return parseInt(this.element.width(), 10) + 15;
        },
        minimumResultsForSearch: -1
    };

    var isOldIe = !!$('html.lt-ie9').length;

    function destroySelectUpdates(context) {
        var $con = $(context || document);

        if (!isOldIe) {
            if ($con.hasClass('select2-offscreen')) {
                $con.not('.plan-toggle-switch').select2('destroy');
            } else {
                $con.find('.select2-offscreen').not('.plan-toggle-switch').select2('destroy');
            }
        }
    }

    function updateMIWT(context) {
        var $con = $(context || document);

        if (!isOldIe) {
            if ($con.is('select')) {
                //noinspection JSUnresolvedVariable
                $con.not('.plan-toggle-switch').select2(SELECT_OPTIONS).on('change', miwt.observerFormSubmit);
            } else {
                //noinspection JSUnresolvedVariable
                $con.find('select').not('.plan-toggle-switch').select2(SELECT_OPTIONS).on('change', miwt.observerFormSubmit);
            }
        }
    }

    function topicToggle() {
        /*var $topicLists = $('div.topic-list');
        var $topicListToggles = $topicLists.find('div.topics > .btn');*/

        $('div.topics > .btn').on('click', function(){
            $(this).parent().addClass('is-open');
        });

        $('div.topics.is-open > .btn').on('click', function(){
            $(this).parent().removeClass('is-open');
        });
    }

    topicToggle();

    $('form.miwt-form').each(function() {
        var form = this;
        form.submit_options = {
            preProcessNode: function(data) {
                destroySelectUpdates(document.getElementById(data.refid));
                return data.content;
            },
            postProcessNode: function(data) {
                $.each(data, function(idx, d) {
                    updateMIWT(d.node);
                    topicToggle();
                });
            },
            postUpdate: function() {
                topicToggle();
            }
        };

        topicToggle();
        updateMIWT(this);
    });
});