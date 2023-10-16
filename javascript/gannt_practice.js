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
		if($selectedRow != null){
		let indent = parseInt($selectRow.css('textIndent')) + indentW;
		if (0 <= indent) $selectRow.css('textIndent', indent + 'px');
	}
	});

//課題03
	let tr = $('.column_header tr:nth-child(2)');
	let days = $('.column_header tr:nth-child(2) th').length;

	for (let i = 13; i <= days; i++) {
		let date = $(tr.children('tr:nth-child(' + i + ')'));
		dateState[date.attr('id')] = date.position().left;
	}
});

//複数選択
function multiDrag(element) {
	$(element).selectable({
		cancel: 'sort-handle, .ui-selected',

		selected: function (a, b) {
			$selectRow = $('.' + selectingRow).children('td:nth-child(2)');
		}
	}).sortable({
		axis: 'y',
		items: '> tr',
		handle: 'td, .sort-handle. .ui-selected',
		helper: function (a, c) {
			if(!c.hasClass('ui-selected')) {
			c.parent().children('.ui-selected').removeClass('ui-selected');
			c.addClass('ui-selected');
			}
			let selected = c.parent().children('.ui-selected').clone();
			high = c.Height() * selected.length;
			c.data('multidrag', selected).sibling('.ui-selected').remove();
			return$('<tr/>').append(selected);
		},
		cursor: 'move',
		start: function (a, d) {
			d.placeholder.css({'height':high});
		},
		stop: function (a, d) {
			let selected = d.item.data('multidrag');
			d.item.after(selected);
			d.item.remove();
			selected.removeClass('ui-selected');
			$(selected).children('td').removeClass('ui-selected');
		}
	})
}