/**
 * Created by danejacobi on 2/2/17.
 */

jQuery(function($) {
    $('.activity-resources.media').each(function() {
        var $con = $(this);
        var $videosCon = $con.find('.videos');
        var $videos = $con.find('.video');

        function playVideo(file, opts) {
            var defaults = {
                poster: ''
            };
            var settings;

            if (!file) {
                return;
            }

            settings = $.extend(defaults, opts);

            $.fancybox('<div id="jw-video-player"></div>', {
                type: 'inline',
                width: 640,
                height: 384,
                maxHeight: 384,
                padding: 0,
                fitToView: false,
                scrolling: 'no',
                helpers:  {
                    title:  null
                },
                afterShow: function() {
                    var $this = $(this.element);
                    jwplayer("jw-video-player").setup({
                        height: 384,
                        width: 640,
                        file: file,
                        image: settings.poster,
                        flashplayer: '/_resources/dyn/files/13397z18d4970f/_fn/player.swf'
                    });
                }
            });
        }

        $videos.each(function() {
            var $video = $(this);
            var file = $video.data('file');
            var thumbnail = $video.data('poster');
            var poster = $video.data('poster');
            var name = $video.data('name');
            var $thumb = $('<div class="thumb" />');
            var $name = $('<div class="name" />');

            if (thumbnail && thumbnail.length) {
                $thumb.css({
                    backgroundImage: 'url(' + thumbnail + ')'
                });
            }

            $name.text(name);

            $('<a />')
                .attr({
                    href: file,
                    target: '_blank'
                })
                .append($thumb)
                .append($name)
                .appendTo($video);

            /*
             commented until we want inline files

             $video.on('click', function(evt) {
             playVideo(file, {
             poster: poster
             });
             });
             */
        });

        $videosCon.wrap('<div class="videos-con" />');

        $videosCon.mCustomScrollbar({
            horizontalScroll:true,
            mouseWheel: true,
            theme: "light",
            advanced:{
                updateOnContentResize: true
            },
            scrollButtons:{
                enable: true,
                scrollType: "continuous",
                scrollSpeed: 150,
                updateOnContentResize: true,
                autoExpandHorizontalScroll: true
            },
            contentTouchScroll: true
        });
    });
});