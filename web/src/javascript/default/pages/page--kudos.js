/**
 * Created by danejacobi on 2/2/17.
 */

jQuery(function($) {

    var cheerForm = $('.cms-popup-content form.miwt-form');


    $(cheerForm).each(function() {
        var form = this;
        form.submit_options = {
            ajax: true,
            // postProcessNode: function(data) {
            //     $.each(data, function(idx, d) {
            //         // $('.cms-popup-component').addClass('fucking-work');
            //     });
            // },
            postUpdate: function(data) {
                $(this).trigger('vs:miwt-post-update');
            },
            processRedirect: function() {
                var $form = $(form);
                $form
                    .hide()
                    .after('<div class="kudo-thank-you"><p>Your Cheer has been successfully sent.</p></div>');
                setTimeout(function () {
                    $('.cms-popup-content').css('display', 'none');
                    $('.kudo-thank-you').remove();
                    $.ajax($form.data('ajaxUri'), {
                        mimeType: 'text/html',
                        error: function() {location.reload();},
                        success: function(response) {
                            var div = document.createElement("div");
                            div.innerHTML = response;
                            var newForm = div.firstElementChild.firstElementChild;
                            form.parentNode.replaceChild(newForm, form);
                            miwt.setupForm(newForm);
                            newForm.submit_options = form.submit_options;
                            form = newForm;
                        }
                    });
                }, 3000);
                return false;
            }
        };
    });
});