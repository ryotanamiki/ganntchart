let $selectedRow = null;
const selectRow = "ui-selected";
const indentPx = 12;
let datePositions = [];
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

//課題1

	// 複数選択行入れ替え
	multiDrag($("#column_table_body"));

//課題2
	// インデントright処理
	$("#indent_right").on('click',function(){
		if($selectedRow != null){
			let indent = parseInt($selectedRow.css("text-indent")) + indentPx;
			if(indent <= (indentPx * 3)) $selectedRow.css("text-indent", indent + "px");
		}
	});
	// インデントleft処理
	$("#indent_left").on('click',function(){
		if($selectedRow != null){
			let indent = parseInt($selectedRow.css("text-indent")) - indentPx;
			if(0 <= indent) $selectedRow.css("text-indent", indent + "px");
		}
	});

//課題4

	// 日付ヘッダーリスト
	let tr = $(".column_header tr:nth-child(2)");
	let day = $(".column_header tr:nth-child(2) th").length;
	for(let i = 13; i <= day; i++){
		let date = $(tr.children("th:nth-child(" + i + ")"));
		datePositions[date.attr("id")] = date.position().left;
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
// 課題3 - 日数計算
function calcDifDay(elem, result){
	let tar = result ? "plan" : "act";
	let index = getIndex(elem);
	let stDays = $("#"+tar+"St_" + index);
	let edDays = $("#"+tar+"Ed_" + index);
	if(!isEmpty(stDays.val()) && !isEmpty(edDays.val())){
		let diff = diffDays(new Date(edDays.val()), new Date(stDays.val()));
		$("#"+tar+"Dif_" + index).text(diff);
	}
}
// 課題4 - 開始日変更時バー移動
function moveSt(elem, result){
	// 開始日
	let st = $(elem);
	let index = getIndex(st);
	// 移動位置
	let stPos = datePositions[st.val()];
	// バー変更
	let tar = result ? "plan" : "act";
	let bar = $("#"+tar+"Bar_" + index);
	bar.css("left", stPos + "px");
	
	let ed = $("#"+tar+"Ed_" + index);
	let barPos = datePositions[ed.val()];
	bar.css("width", barPos + widAdd - stPos + "px");
}
// 課題5 - 終了日変更時バー幅変更
function moveEd(elem, result){
	// 終了日
	let ed = $(elem);
	let index = getIndex(ed);
	// 移動位置
	let barPos = datePositions[ed.val()];
	// 開始日位置
	let tar = result ? "plan" : "act";
	let st = $("#" + tar + "St_" + index);
	let stPos = datePositions[st.val()];
	// バー変更
	let bar = $("#" + tar + "Bar_" + index);
	bar.css("width", barPos + widAdd - stPos + "px");
}
// 課題6 - 進捗率描画
function updateProg(elem){
	let index = getIndex(elem);
	$("#progBar_" + index).css("width", elem.value + "%");
}

/* 汎用処理 ------------------------------------------------------------*/

// インデックス取得
function getIndex(elem){
	return $(elem).attr("id").split("_")[1];
}
// 日付差
function diffDays(ed, st){
	var diffTime = ed.getTime() - st.getTime();
	var diffDay = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	return ++diffDay;
}
// 空文字チェック
function isEmpty(val){
	return val == null || val == "";
}