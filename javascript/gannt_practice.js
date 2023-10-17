let $selectedRow = null;
let selectRow = 'ui-selected';
let indentWtd = 12;
let dataArea = [];
let widAdd = 19;

// 初期表示時
//readyベント
$(function() {

	// CSS関連 - ヘッダー
	const element = document.querySelector('.column_header');
	// 横にスクロールした分、位置をずらす
	element.style.left = -window.pageXOffset + 'px';
	window.addEventListener('scroll', () => {
	element.style.left = -window.pageXOffset + 'px';
});

//課題01ーー複数行入れ替え
	multiDrag($("#column_table_body"));

//課題02
//インデントright
	$("#indent_right").on('click', function () {
		if ($selectedRow != null) {
			let indent = parseInt($selectedRow.css("textIndent")) + indentWtd;
			if (indent <= (indentWtd * 3)) $selectedRow.css("textIndent", indent + "px");
		}
	});
//インデントleft
	$("#indent_left").on('click', function () {
		if ($selectedRow != null) {
			let indent = parseInt($selectedRow.css("textIndent")) + indentWtd;
			if (0 <= indent) $selectedRow.css("textIndent", indent + "px");
		}
	});

//日付
	let $tarTr = $(".column_header tr:nth-child(2)");
	let dayLen = $(".column_header tr:nth-child(2) th").length;

	for(let i = 13; i <= dayLen; i++){
		let $dateTh = $($tarTr.children("th:nth-child(" + i + ")"));
		dataArea[$dateTh.attr("id")] = $dateTh.position().left;
	}
});

//複数選択ドラッグ
function multiDrag(emt) {
	$(emt).selectable({
		cancel: '.sort-handle, .ui-selected',

		selected: function (e, ui) {
			$selectedRow = $("." + selectRow).children("td:nth-child(2)");
		}
	}).sortable({
		axis: 'y',
		opacity: 0.9,
		item: "> tr",
		handle: 'td, .sort-handle, .ui-selected',
		helper: function (e, item) {
			if (!item.hasClass('ui-selected')) {
				item.parent().children('.ui-selected').removeClass('ui-selected');
				item.addClass('ui-selected');
			}
			let selected = item.parent().children('.ui-selected').clone();
			ph = item.outerHeight() * selected.length;
			item.data('multidrag', selected).siblings('ui-selected').remove();
			return $('<tr/>').append(selected);
		},
		cursor: "move",
		start: function (e, ui) {
			ui.placeholder.css({ 'height': ph });
		},
		stop: function (e, ui) {
			let selected = ui.item.data('multidrag');
			ui.item.after(selected);
			ui.item.remove();
			selected.removeClass();
			$(selected).children("td").removeClass('ui-selected');
		}
	});
}
//課題03
//日数計算
	function calDifDays(emt, result) {
		let tar = result ? "plan" : "act";
		let index = getIndex(emt);
		let $planSt = $("#" + tar + "St_" + index);
		let $planEd = $("#" + tar + "Ed_" + index);
		if (!empty($planSt.val()) && (!empty($planEd.val()))) {
			let diff = diffDays(new Date($planEd.val()), new Date($planSt.val()));
			$("#" + tar + "Diff_" + index).text(diff);
		}
}
//開始日のバー移動
