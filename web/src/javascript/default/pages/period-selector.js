/**
 * Created by danejacobi on 2/2/17.
 */

jQuery(function($) {
    $('.period-selector').each(function() {
        var $con = $(this);
        var $form = $con.find('form');
        var $control = $con.find('.control select');
        var $submit = $con.find('.actions input[type=submit]');
        var $extraControls = $con.find('.control-extra');
        var $extraControlSummary;
        var ACTIVE_CLASS = 'active';
        var activeControlKey;
        var $activeExtraControl;

        function showControlExtra(key) {
            var $ec = getControlExtra(key);

            closeControlExtras();
            if ($ec.length) {
                $ec.addClass(ACTIVE_CLASS);
            }
        }

        function closeControlExtras() {
            $extraControls.removeClass(ACTIVE_CLASS);
        }

        function disableControlExtras() {
            $extraControls.find('input, select, textarea').prop('disabled', true);
        }

        function getControlExtra(key) {
            return $extraControls.filter('[data-extra-control="' + key + '"]');
        }

        function getActiveControlKey() {
            return $control.find('option:selected').data('extraControlKey');
        }

        function updateControlSummary(str) {
            $extraControlSummary.text(str);
        }

        $extraControlSummary = $('<div class="summary" />').insertBefore($con.find('.control-extras'));

        $extraControls.filter('.date-range').each(function() {
            var $dateCon = $(this);
            var $dateFields = $dateCon.find('.question input');
            var $dstart = $dateCon.find('.start input');
            var $dend = $dateCon.find('.end input');
            var dstartVal = $dstart.val();
            var dendVal = $dend.val();
            var displayString = "";
            var DATE_PARSE_FORMAT = 'YYYY-MM';
            var DATE_OUTPUT_FORMAT = 'MMM YYYY';
            var today = new Date();

            $dateFields.monthpicker({
                pattern: DATE_PARSE_FORMAT.toLowerCase(),
                startYear: 2013,
                finalYear: today.getFullYear()
            });

            if (dstartVal.length) {
                displayString += 'Custom: ';
                displayString += moment(dstartVal, DATE_PARSE_FORMAT).format(DATE_OUTPUT_FORMAT);
                displayString += ' - ';
                displayString += (dendVal.length ? moment(dendVal, DATE_PARSE_FORMAT).format(DATE_OUTPUT_FORMAT) : 'Present');

                $control.find('option[data-extra-control-key="'+$dateCon.data('extraControl')+'"]').each(function() {
                    $(this).text(displayString);
                });
            }

            $dateCon.find('input[type=submit]').on('click', function(evt) {
                if (!$dstart.val().length) {
                    evt.preventDefault();

                    $dstart.parent().parent().addClass('validation-error');
                }
            });
        });

        $control
            .select2({
                width: 'element',
                minimumResultsForSearch: -1,
                dropdownCssClass: 'select2-tall'
            })
            .on('change', function(evt) {
                var extraControlKey = getActiveControlKey();

                if (extraControlKey) {
                    showControlExtra(extraControlKey);
                } else {
                    closeControlExtras();
                    disableControlExtras();
                    $form.submit();
                }
            })
            .on('select2-open', function(evt) {
                $extraControls
                    .filter('.date-range')
                    .find('.question input')
                    .monthpicker('hide');
                closeControlExtras();
            })
            .on('select2-selecting', function(evt) {
                var extraControlKey = getActiveControlKey();

                $extraControls
                    .filter('.date-range')
                    .find('.question input')
                    .monthpicker('hide');

                if (extraControlKey) {
                    showControlExtra(extraControlKey);
                }
            })
            .on('select2-opening', function(evt) {
                //temp fix for https://github.com/ivaynberg/select2/issues/1541
                $(this).siblings('.select2-container').find('.select2-search, .select2-focusser').remove();
            });

        $('body').on('click', function(evt) {
            closeControlExtras();
        });

        $extraControls.on('click', function(evt) {
            evt.stopPropagation();
        });

        $('.ui-datepicker').on('click', function(evt) {
            evt.stopPropagation();
        });

        $extraControlSummary.on('click', function(evt) {
            var extraControlKey = getActiveControlKey();

            evt.stopPropagation();

            if (extraControlKey) {
                showControlExtra(extraControlKey);
            }
        });

        activeControlKey = getActiveControlKey();
        $activeExtraControl = getControlExtra(activeControlKey);

        if ($activeExtraControl.length) {
            updateControlSummary($activeExtraControl.data('summary'));
        }

        showControlExtra();
    });
});