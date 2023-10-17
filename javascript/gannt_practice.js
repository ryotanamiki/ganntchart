// 課題1 - クリックした行
let $selectedRow = null;
// 課題1 - 選択中行クラス名
const selectRow = "ui-selected";
// 課題2 - インデント幅
const indentPx = 12;
// 課題4 - 日付位置マップ
let datePositions = [];
// 課題5 - width step
const widAdd = 19;

// 初期表示時
$(function() {
	
	// CSS関連 - ヘッダー
	const element = document.querySelector('.column_header');
	// 横にスクロールした分、位置をずらす
	element.style.left = -window.pageXOffset + 'px';
	window.addEventListener('scroll', () => {
	  element.style.left = -window.pageXOffset + 'px';
	});

/* 課題1 */

	// 複数選択行入れ替え
	multiDrag($("#column_table_body"));
	
/* 課題2 */
	// →インデント処理
	$("#indent_right").on('click',function(){
		if($selectedRow != null){
			let indent = parseInt($selectedRow.css("text-indent")) + indentPx;
			if(indent <= (indentPx * 3)) $selectedRow.css("text-indent", indent + "px");
		}
	});
	// ←インデント処理
	$("#indent_left").on('click',function(){
		if($selectedRow != null){
			let indent = parseInt($selectedRow.css("text-indent")) - indentPx;
			if(0 <= indent) $selectedRow.css("text-indent", indent + "px");
		}
	});

/* 課題4 */

	// 日付ヘッダーリスト
	let $tarTr = $(".column_header tr:nth-child(2)");
	let dayLen = $(".column_header tr:nth-child(2) th").length;
	// 各ヘッダー位置をマップに設定
	for(let i = 13; i <= dayLen; i++){
		let $dateTh = $($tarTr.children("th:nth-child(" + i + ")"));
		datePositions[$dateTh.attr("id")] = $dateTh.position().left;
	}
});
	
// 課題1 - 複数選択ドラッグ
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
// 課題3
function getIndex(emt){
	return $(emt).attr("id").split("_")[1];
}

function diffDays(ed, st){
	var diffTime = ed.getTime() - st.getTime();
	var diffDay = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	return ++diffDay;
}

function empty(val){
	return val == null || val == "";
}
// 日数計算
function calcDifDay(emt, result){
	let tar = result ? "plan" : "act";
	let index = getIndex(elem);
	let $planSt = $("#"+tar+"St_" + index);
	let $planEd = $("#"+tar+"Ed_" + index);
	if(!empty($planSt.val()) && !empty($planEd.val())){
		let diff = diffDays(new Date($planEd.val()), new Date($planSt.val()));
		$("#"+tar+"Dif_" + index).text(diff);
	}
}

//開始日変更バー
function stDays(emt, plan) {
	let st = $(emt);
	let index = getIndex(st);

	let stPost = datePositions[st.val()];

	//開始位置
	let tar = plan ? "plan" : "act";
	let bar = $("#" + tar + "Bar_" + index);
	bar.css("left", stPost + "px");

	let ed = $("#" + tar + "Ed_" + index);
	let barPost = datePositions[ed.val()];
	bar.css("width", barPost + widAdd - stPost + "px");
}