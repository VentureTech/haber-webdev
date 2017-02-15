/**
 * Created by danejacobi on 2/2/17.
 */

jQuery(function($) {
    $('.retrieve-password').each(function() {
        var $con = $(this);
        $con.find('button.submit span').text('Create Password');
        $con.find('.email span.email').text('Email');
    });
});