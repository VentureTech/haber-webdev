/**
 * Created by danejacobi on 2/2/17.
 */

jQuery(function($){
    var $con = $(".featured-resources");

    $con.children(".resources").mCustomScrollbar({
        horizontalScroll:true,
        mouseWheel: true,
        theme: "light",
        advanced:{
            updateOnContentResize: true
        },
        scrollButtons:{
            enable: true,
            scrollType: "continuous",
            scrollSpeed: 50,
            updateOnContentResize: true,
            autoExpandHorizontalScroll: true
        },
        contentTouchScroll: true
    });
    $con.children(".resources.mCustomScrollbar").children(".mCustomScrollBox").addClass("featured-pos");
    $(window).load(function(){
        $con.addClass("loaded");
    });
});