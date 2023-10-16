let $selectRow = null;
let selectingRow = 'ui-selected';
const indentW = 12;
let dateState = [];
const widthAdd = 19;


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
	multiDrag($('#column_table_body'));

//課題02
//インデントright処理
	$('#indent_right').on('click', function () {
		if ($selectRow != null) {
			let indent = parseInt($selectRow.css('textIndent')) + indentW;
			if (indent <= (indentW * 3)) $selectRow.css('textIndent', indent + 'px');
		}
	});
//インデントleft処理
	$('#indent_left').on('click', function () {
		let indent = parseInt($selectRow.css('textIndent')) + indentW;
		if (0 <= indent) $selectRow.css('textIndent', indent + 'px');
	});

//課題03
	let tr = $('.column_header tr:nth-child(2)');
	let days = $('.column_header tr:nth-child(2) th').length;

	for (let i = 13; i <= days; i++) {
		let date = $(tr.children('tr:nth-child(' + i + ')'));
		dateState[tr.arr('id')] = date.position().left;
	}
});

//複数選択
function multiDrag(element) {
	$(element).selectable({
		disable: 'sort-handle, .ui-selected',

		selected: function (a, b) {
			$selectRow = $('.' + selectingRow).children('td:nth-child(2)');
		}
	}).sortable({
		axis: 'y',
		items: '> tr',
		handle: 'td, .sort-handle. .ui-selected',

	})
}