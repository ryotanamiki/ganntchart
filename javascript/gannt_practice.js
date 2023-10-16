let $selectRow = null;
let selectingRow = 'ui-selected';
const indentW = 12;


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

//課題02--インデントright処理
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
});