
function dumpBookmarks(query) {
  var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) {
      // $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
      console.log(bookmarkTreeNodes)
    });
}

$(function() {
	$("#add").click(function(){
		console.log('add');
		// alert('asdd');
		chrome.bookmarks.create({parentId: '1',
                 title: '添加测试', url: 'http://baidu.com'});
	});
	$("#show").click(function(){
		console.log('show');
		// no
		// console.log(chrome.bookmarks.getTree());
	});
	$('#remove').click(function(){
		console.log('remove');
		  var bookmarkTreeNodes = chrome.bookmarks.getTree(
		    function(bookmarkTreeNodes) {
		      var len = bookmarkTreeNodes[0].children[0].children["length"];
		      var node = bookmarkTreeNodes[0].children[0].children[len-1];
		      if (node.title=='添加测试') {
		      	chrome.bookmarks.remove(String(node.id));
		      }
		    });
	})
	// temp1[0].children[0].children["length"]
});


document.addEventListener('DOMContentLoaded', function () {
  dumpBookmarks();
});
