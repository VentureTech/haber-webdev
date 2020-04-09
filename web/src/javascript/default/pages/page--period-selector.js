/**
 * Created by danejacobi on 2/2/17.
 */

jQuery(function($) {

    $(window).on('load', function() {
        var $positionId = null;
        var $dateRange = null;
        var results1 = new RegExp('[\?&]vp=([^&#]*)').exec($('.crumbs > li.first > a').attr('href'));
        if (results1 != null) {
            $positionId = decodeURI(results1[1]);
        }
        var results2 = new RegExp('[\?&]dr=([^&#]*)').exec(window.location.href);
        if (results2 != null) {
            $dateRange = decodeURI(results2[1]);
        }
    });
  
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
        var $cycleRange = $con.find('.control-extra.cycle-range');
        var $dateRange = $con.find('.control-extra.date-range');

        $submit.val('Submit');

        $('.control > select').on('change', function() {
            var selected = $(this).val();
            var name = $('.control > select').attr('name');

            // console.log(selected);

            if( $(this).val() == 'cr' ) {
                //console.log("yay cycle");
                $dateRange.removeClass(ACTIVE_CLASS);
                $cycleRange.addClass(ACTIVE_CLASS);

                return;
            } else if ( $(this).val() == 'cmr' ) {
                //console.log("yay month");
                $cycleRange.removeClass(ACTIVE_CLASS);
                $dateRange.addClass(ACTIVE_CLASS);

                return;
            }

            var url = window.location.pathname;
            var curPosition = $('.period-selector > input[type="hidden"]');

            var newUrl;

            if ( url.indexOf('?') > 0 ) {
                newUrl = url + '&' + curPosition.attr('name') + '=' + curPosition.attr('value') + '&' + name + '=' + selected;
            } else {
                newUrl = url + '?' + curPosition.attr('name') + '=' + curPosition.attr('value') + '&' + name + '=' + selected;
            }

            $extraControls.removeClass(ACTIVE_CLASS);
            window.location.href = newUrl;
        }).on('select2:open', function(){
            //console.log('selected open');

            if( $(this).val() == 'cr' ) {
                //console.log('value = cr');

                if (!$('.cycle-range').hasClass(ACTIVE_CLASS)) {
                    $('.cycle-range').addClass(ACTIVE_CLASS);
                }

                return;
            } else if ( $(this).val() == 'cmr' ) {
                //console.log("yay month");
                $cycleRange.removeClass(ACTIVE_CLASS);
                $dateRange.addClass(ACTIVE_CLASS);



                return;
            }
        });

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
            var $dstartCon = $dateCon.find('.start .val');
            var $dstart = $dateCon.find('.start input');
            var $dendCon = $dateCon.find('.end .val');
            var $dend = $dateCon.find('.end input');
            var dstartVal = $dstart.val();
            var dendVal = $dend.val();
            var displayString = "";
            var $yearSelect = $dateCon.find('.month.year-select select');
            var $selectionContainer = $dateCon.find('.selection-container');
            var $monthPicker = $dateCon.find('.month-picker');
            var DATE_PARSE_FORMAT = 'YYYY-MM';
            var DATE_OUTPUT_FORMAT = 'MMM YYYY';
            var dstartValYear = dstartVal.substr(0, 4);
            var dendValYear = dendVal.substr(0, 4);
            var dstartValPlus = dstartVal.substr(dstartVal.indexOf('-') + 1).toString();
            var dendValPlus = dendVal.substr(dendVal.indexOf('-') + 1).toString();
            var dstartValCorrected = dstartValYear + '-' + dstartValPlus;
            var dendValCorrected = dendValYear + '-' + dendValPlus;
            var dstartValFormatted = moment(dstartValCorrected, DATE_PARSE_FORMAT).format(DATE_OUTPUT_FORMAT);
            var dendValFormatted = moment(dendValCorrected, DATE_PARSE_FORMAT).format(DATE_OUTPUT_FORMAT);
            var today = new Date();

            //Append calendar icon to custom month range input container
            $dstartCon.append('<span class="start-cal cal"><i class="fa fa-calendar" aria-hidden="true"></i></span>');
            $dendCon.append('<span class="end-cal cal"><i class="fa fa-calendar" aria-hidden="true"></i></span>');

            var $dateCal = $('span.cal');

            //Make the date fields readonly so people can't keyspam
            $dateFields.attr('readonly', true);

            if(!$dstart.attr('value')) {
                $dstart.addClass('no-value');
            } else {
                $dstart.val(dstartValFormatted);
            }

            if(!$dend.attr('value')) {
                $dend.addClass('no-value');
            } else {
                $dend.val(dendValFormatted);
            }

            var lastFocus = [];
            $dateFields.on('focus', function(){
                $monthPicker.addClass(ACTIVE_CLASS);
                lastFocus = $(this);
            });

            $dateCal.on('click', function(){
               $(this).closest('.val').find('input').focus();
            });

            $yearSelect.on('change', function(event){
                var selectedYear = $(this).val();

                $('.selection-container > div').on('click', function(){
                    var selection = $(this).text();
                    var selectionId = $(this).data('cycleId');
                    var input = $('.cycle-range input.active');
                    var selectedYear = $yearSelect.val();

                    $(lastFocus).val(selection + ' ' + selectedYear).attr('value', selectionId);
                    $monthPicker.removeClass(ACTIVE_CLASS);
                });
            });


            $('.selection-container > div').on('click', function(){
                var selection = $(this).text();
                var selectionId = $(this).data('valueMonth');
                var input = $('.date-range input.active');
                var selectedYear = $yearSelect.val();

                console.log('Selection is' + selection + ' ' + selectedYear);

                $(lastFocus).val(selection + ' ' + selectedYear).attr('value', selectionId);
                $monthPicker.removeClass(ACTIVE_CLASS);
            });

            if (dstartVal.length) {
                displayString += 'Custom: ';
                displayString += moment(dstartValCorrected, DATE_PARSE_FORMAT).format(DATE_OUTPUT_FORMAT);
                displayString += ' - ';
                displayString += (dendVal.length ? moment(dendValCorrected, DATE_PARSE_FORMAT).format(DATE_OUTPUT_FORMAT) : 'Present');

                $control.find('option[data-extra-control-key="'+$dateCon.data('extraControl')+'"]').each(function() {
                    $(this).text(displayString);
                });
            }

            $dateCon.find('input[type=submit]').on('click', function(evt) {
                if (!$dstart.val().length || !$dend.val().length) {
                    evt.preventDefault();

                    $dstart.parent().parent().addClass('validation-error');
                } else {
                    var url = window.location.pathname;
                    var curPosition = $('.period-selector > input[type="hidden"]');
                    var param1 = $('.control-extra.date-range #q-start');
                    var param2 = $('.control-extra.date-range #q-end');
                    var startYear = $dstart.val().slice(-4);
                    var endYear = $dend.val().slice(-4);

                    var newUrl;

                    if ( url.indexOf('?') > 0 ) {
                        newUrl = url + '&';
                    } else {
                        newUrl = url + '?';
                    }

                    newUrl = newUrl + curPosition.attr('name') + '=' + curPosition.attr('value')
                        + '&dr=cmr'
                        + '&' + param1.attr('name')+ '=' + startYear + '-' + param1.attr('value').substr(param1.attr('value').indexOf('-') + 1)
                        + '&' + param2.attr('name') + '=' + endYear + '-' + param2.attr('value').substr(param2.attr('value').indexOf('-') + 1);

                    window.location.href = newUrl;
                }
            });
        });

        //console.log('cycle process starting');

        $extraControls.filter('.cycle-range').each(function() {
            var $dateCon = $(this);
            var $dateFields = $dateCon.find('.question input');
            var $dstartWrap = $dateCon.find('.start .val');
            var $dstart = $dateCon.find('.start input');
            var $dendWrap = $dateCon.find('.end .val');
            var $dend = $dateCon.find('.end input');
            var $yearSelect = $dateCon.find('.year-select select');
            var $selectionContainer = $dateCon.find('.selection-container');
            var $cyclePicker = $dateCon.find('.cycle-picker');

            //Append calendar icon to custom month range input container
            $dstartWrap.append('<span class="start-cycle cycle-icon"><i class="fa fa-refresh" aria-hidden="true"></i></span>');
            $dendWrap.append('<span class="end-cycle cycle-icon"><i class="fa fa-refresh" aria-hidden="true"></i></span>');

            var $dateCal = $('span.cycle-icon');

            //Make the date fields readonly so people can't keyspam
            $dateFields.attr('readonly', true);

            var lastFocus = [];
            $dateFields.on('focus', function(){
                $cyclePicker.addClass(ACTIVE_CLASS);
                lastFocus = $(this);
            });

            $dateCal.on('click', function(){
                $(this).closest('.val').find('input').focus();
            });

            $yearSelect.on('change', function(event){
                var selectedYear = $(this).val();
                //console.log('Hi, the year changed' + selectedYear);

                var newYear = $('.cycles-by-year .cycle-year[data-year-value="' + selectedYear +'"]');

                //console.log(newYear);

                var nameList = [];
                var idList = [];
                $(newYear).find('.cycle').each(function(){
                    nameList.push($(this).data('cycle-name'));
                    idList.push($(this).data('cycle-id'));
                });

                $selectionContainer.empty();
                for (i = 0; i < nameList.length; i++) {
                    $selectionContainer.append('<div data-cycle-id="' + idList[i] + '"><span>' + nameList[i] + '</span></div>');
                }

                $('.selection-container > div').on('click', function(){
                    var selection = $(this).text();
                    var selectionId = $(this).data('cycleId');
                    var input = $('.cycle-range input.active');

                    $(lastFocus).val(selection).attr('value', selection).attr('data-selected-id', selectionId);
                    $cyclePicker.removeClass('active');
                });

                // console.log(nameList + ',' + idList);
            });


            $('.selection-container > div').on('click', function(){
                var selection = $(this).text();
                var selectionId = $(this).data('cycleId');
                var input = $('.cycle-range input.active');

                $(lastFocus).val(selection).attr('value', selection).attr('data-selected-id', selectionId);
                $cyclePicker.removeClass('active');
            });

            $dateCon.find('input[type=submit]').on('click', function(evt) {
                if (!$dstart.val().length || !$dend.val().length) {
                    evt.preventDefault();

                    $dstart.parent().parent().addClass('validation-error');
                } else {
                    var url = window.location.pathname;
                    var curPosition = $('.period-selector > input[type="hidden"]');
                    var param1 = $('.control-extra.cycle-range #q-start');
                    var param2 = $('.control-extra.cycle-range #q-end');

                    var newUrl;

                    if ( url.indexOf('?') > 0 ) {
                        newUrl = url + '&';
                    } else {
                        newUrl = url + '?';
                    }

                    newUrl = newUrl + curPosition.attr('name') + '=' + curPosition.attr('value')
                        + '&dr=cr'
                        + '&' + param1.attr('name')+ '=' + param1.data('selectedId')
                        + '&' + param2.attr('name') + '=' + param2.data('selectedId');

                    // console.log(url + ',' + newUrl);

                    //$(location).attr('href', newUrl);
                    window.location.href = newUrl;
                }
            });
        });

        $('body').on('click', function(evt) {
            var $focused = $(':focus');
            //console.log($focused);
            if ( !($('input.select2-search__field').is(':focus') || $('span.select2-selection.select2-selection--single').is(':focus') )) {
                closeControlExtras();
            }
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
            console.log($activeExtraControl.data('summary'));
            updateControlSummary($activeExtraControl.data('summary'));
        }

        showControlExtra();
    });

    $('.control > select').select2({
        minimumResultsForSearch: 20
    });
});