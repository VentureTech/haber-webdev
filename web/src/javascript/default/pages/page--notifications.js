/**
 * Created by danejacobi on 2/2/17.
 */

jQuery(function($) {

    function Notification(opts) {
        var $root;
        var settings = {};
        var defaults = {
            type: 'info',
            content: $([])
        };

        function getRenderedEl() {
            return $root;
        }

        function hide() {
            $root.addClass('hidden');
        }

        function render() {
            $root = $('<div class="notification" />')
                .addClass(settings.type)
                .append(settings.content);
        }

        function init() {
            settings = $.extend(defaults, opts);

            render();
        }

        init();

        return {
            getRenderedEl: getRenderedEl,
            hide: hide,
            id: settings.id
        };
    }

    function NotificationBar(target, opts) {
        var settings = {};
        var defaults = {
            notifications: false,
            notificationSummaryTarget: null
        };
        var notificationItems = {};
        var notificationItemCount = 0;
        var $root;
        var $notificationBar;
        var $notificationSummary;
        var $notificationSummaryCount;
        var dateKey = moment().format('YYYYMMDD');

        function storeNotificationStatus(id) {
            //noinspection JSUnresolvedVariable
            store.set(dateKey + id, '1');
        }

        function storeNotificationsStatus() {
            $.each(notificationItems, function(key, notificationItem) {
                storeNotificationStatus(notificationItem.notification.id);
            });
        }

        function isNotificationUnread(key) {
            //noinspection JSUnresolvedVariable
            return store.get(dateKey + key) !== '1';
        }

        function addNotification(notification) {
            var $notification;
            var n = new Notification(notification);

            var ni = {
                notification: n,
                visible: isNotificationUnread(n.id)
            };

            notificationItems[n.id] = ni;
            notificationItemCount++;

            updateSummaryInterface();

            if (!ni.visible) {
                return;
            }

            $notification = n.getRenderedEl();
            $notificationBar.append($notification);
        }

        function addNotifications(notifications) {
            $.each(notifications, function(index, n) {
                addNotification(n);
            });
        }

        function getNotificationItemById(id) {
            return typeof notificationItems[id] !== 'undefined' ? notificationItems[id] : null;
        }

        function updateSummaryInterface() {
            var visibleCount = 0;

            $.each(notificationItems, function(idx, notificationItem) {
                if (notificationItem.visible) {
                    visibleCount++;
                }
            });

            //setSummaryVisible(!!visibleCount);

            $notificationSummaryCount.text(notificationItemCount);
            if (notificationItemCount) {
                $notificationSummary.addClass('has-notifications');
            }
        }

        function setSummaryVisible(hasVisibleNotifications) {
            if (hasVisibleNotifications) {
                $notificationSummary.addClass('visible-notifications');
            } else {
                $notificationSummary.removeClass('visible-notifications');
            }
        }

        function init() {
            $root = $(target);

            settings = $.extend(defaults, opts);

            $notificationBar = $('<div class="notification-bar" />').prependTo($root);
            $notificationSummary = $('<div class="notification-summary" title="View Notifications" />');
            $notificationSummaryCount = $('<span class="notification-count" />').appendTo($notificationSummary);

            if (settings.notificationSummaryTarget) {
                $notificationSummary.appendTo(settings.notificationSummaryTarget);

                $notificationSummary.on('click', function(evt) {
                    if (notificationItemCount) {
                        toggleNotificationsView();
                    }
                });
            }
        }

        function toggleNotificationsView(){
            var $notificationBarCon =  $('.notification-bar-con');
            if($notificationBarCon.hasClass('hidden')){
                $notificationBarCon.removeClass('hidden');
                setSummaryVisible(false);

            }
            else{
                $notificationBarCon.addClass('hidden');
                setSummaryVisible(true);
            }
        }

        init();

        return {
            addNotifications: addNotifications
        };
    }

    $('.notification-data').each(function() {
        var $con = $(this);
        var notifications = [];
        var $notificationBarCon =  $('<div class="notification-bar-con" />').insertAfter('header');

        var nb = new NotificationBar($notificationBarCon, {
            notificationSummaryTarget: '#header-wc-0'
        });

        $con.find('.quotes .ac_item').each(function() {
            var $el = $(this);
            notifications.push({
                el: this,
                id: $el.attr('id'),
                content: $('<div class="intro">Quote of the Week:</div>').add($('<div class="content" />').append($el.find('.article_content').children())),
                type: 'quote'
            });
        });

        $.when($.getJSON('/data-feed/dash-notifications')).then(function(peopleNotifications) {
            nb.addNotifications(notifications);
            nb.addNotifications(peopleNotifications);
        });
    });
});