jQuery(function($) {
  var $topicLists = $('.topic-lists');
  var $topicListToggles = $topicLists.find('.topics > button');
  
  $topicListToggles.on('click', function() {
    $(this).parent().toggleClass('is-open');
  });
});