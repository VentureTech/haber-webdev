/**
 * Created by danejacobi on 2/2/17.
 */

jQuery(function($) {
    var SAVE_DELAY_AMOUNT = 5000;
    var autoSaveTimeoutId;

    $.assocArraySize = function(obj) {
        // http://stackoverflow.com/a/6700/11236
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    function AutoSaveMessageContainer(target, opts) {
        var $root = $(target);
        var $mc, $messageTemplate;
        var defaults = {
            messageRemoveDelay: 2500,
            messageRemoveAnimationDelay: 300,
            messageTemplate: '<div class="message" />',
            emptyClass: 'empty'
        };
        var settings = {};
        var messages = {};
        var messagesIdx = 0;

        function addMessage(msg, type) {
            var messageTimeoutId;
            var $message;

            $message = $messageTemplate.clone().addClass(type).text(msg).appendTo($mc);

            messages[messagesIdx] = $message;

            $mc.removeClass(settings.emptyClass);

            if (settings.messageRemoveDelay > 0) {
                (function(mIdx) {
                    setTimeout(function() {
                        removeMessage(mIdx);
                    }, settings.messageRemoveDelay);
                })(messagesIdx);
            }

            messagesIdx++;
        }

        function removeMessage(idx) {
            var $message = messages[idx];

            if ($.assocArraySize(messages) - 1 <= 0) {
                $mc.addClass(settings.emptyClass);
            }

            setTimeout(function() {
                delete messages[idx];
                $message.remove();
            }, settings.messageRemoveAnimationDelay);
        }

        function info(msg) {
            addMessage(msg, 'info');
        }

        function init() {
            if ($root.data('mcinit')) {
                return;
            }

            //get the settings, combination of defaults and option overrides
            settings = $.extend({}, defaults, opts);

            //set up container element in dom
            $mc = $('<div class="message-container-autosave" />').addClass(settings.emptyClass).prependTo($root);

            //define message template
            $messageTemplate = $(settings.messageTemplate);

            //make sure the slide knows it is ready for work
            $root.data('mcinit', true);
        }

        init();

        return {
            info: info
        };
    };

    function initSalesManagerForm() {
        var form = this;
        var $form = $(this);
        var $goalsTable;
        var mc;

        function saveForm() {
            form.MIWTSubmit();
            mc.info('Autosaved the form');
        }

        function startDelayedSaveForm() {
            clearTimeout(autoSaveTimeoutId);
            autoSaveTimeoutId = setTimeout(function() {
                saveForm();
                autoSaveTimeoutId = null;
            }, SAVE_DELAY_AMOUNT);
        }

        mc = new AutoSaveMessageContainer($form);

        $form.on('blur', '.goals-table-wrapper input', startDelayedSaveForm);
    }

    $('form.miwt-form').each(function() {
        var form = this;
        var oldPostUpdate = function(){};

        if (!form.submit_options) {
            form.submit_option = {};
        }

        if (form.submit_options.postUpdate) {
            oldPostUpdate = form.submit_options.postUpdate;
        }

        form.submit_options.postUpdate = function() {
            oldPostUpdate.call(form);

            clearTimeout(autoSaveTimeoutId);
        };

        initSalesManagerForm.call(form);
    });

});