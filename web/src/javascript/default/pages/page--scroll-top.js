/**
 * Created by danejacobi on 2/2/17.
 */

jQuery(function($) {

    $('form.miwt-form').each(function() {
        var form = this;
        form.submit_options = {
            postUpdate: function(data) {
                $('html, body').animate({
                    scrollTop: $("#page-top").offset().top
                }, 750);
            }
        };
    });

});