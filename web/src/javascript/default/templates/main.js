/*const*/
var SELECT2_INIT = "select2-init";

// select2
function initSelect2(ctx) {
	var $select = $(ctx || document).find('select');
	if($select.length === 0 && !!ctx && ctx.nodeName.toLowerCase() == 'select') $select = $(ctx);
	if ($select.length && !($select.closest('.cke_dialog').length || $select.closest('tr[data-dnd-source-def]').length)) {

		//noinspection JSUnresolvedVariable
		var $result = $select
			.select2({
				minimumResultsForSearch: 10,
				dropdownAutoWidth: true,
				width: 'style'
			})
			.addClass(SELECT2_INIT)
			.filter('[data-features~="watch"]');
		if (window.miwt) {
			//noinspection JSUnresolvedVariable
			$result.on('change', miwt.observerFormSubmit);
		}
	}
}

function destroySelect2(ctx) {
	if(!ctx) return;
	var $select = $(ctx);
	if (!$select.hasClass(SELECT2_INIT)) {
		$select = $select.find('select').filter('.' + SELECT2_INIT);
	}

	if ($select.length) {
		$select.removeClass(SELECT2_INIT).select2('destroy');
	}
}

// Note: openSidebar function is declared in the HTML of the page (header)
jQuery(function () {

	initSelect2();

	$('form.miwt-form').each(function (idx, form) {
		//noinspection JSUnusedGlobalSymbols
		form.submit_options = {
			preProcessNode: function (data) {
				destroySelect2(document.getElementById(data.refid));
				return data.content;
			},
			postProcessNode: function (data) {
				$.each(data, function (idx, ctx) {
					initSelect2(ctx);
				});
			},
			postUpdate: function () {
				$(this).trigger('vs:miwt-post-update');
			}
		};
	});
});