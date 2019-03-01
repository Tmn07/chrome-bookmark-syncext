
function dumpBookmarks(query) {
  var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) {
      // $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
      console.log(bookmarkTreeNodes)
    });
}

function addinfo(pid, node){
	if (node.hasOwnProperty("url")) {
		return {'parentId': pid, 'title': node.title, 'url': node.url};
	}
	else {
		return {'parentId': pid, 'title': node.title};
	}
}

function getinfo(node){
	if (node.hasOwnProperty("url")) {
		return {'parentId': node.parentId, 'title': node.title, 'url': node.url, 'id': node.id};
	}
	else {
		return {'parentId': node.parentId, 'title': node.title, 'id': node.id};
	}
}

var res_node = [];
function simplify(Nodes){
	// 有children属性，是文件夹
	if(Nodes.hasOwnProperty("children")){
		// console.log(getinfo(Nodes))
		res_node.push(getinfo(Nodes))
		for (var i = 0; i < Nodes.children.length; i++) {
			simplify(Nodes.children[i]);
		}		
	}
	else {
		res_node.push(getinfo(Nodes))
	}
}

var idmap = {1:'1',2:'2'};
var bookmarks_length = 2;
function MyCreate(Nodes, i){
	if (i==bookmarks_length) { return ; }
	if (Nodes[i].hasOwnProperty("url")) {
		pid = idmap[Nodes[i].parentId];
		chrome.bookmarks.create(addinfo(pid, Nodes[i]), function(data){
			MyCreate(Nodes, i+1);
		});
	}
	else{
		if (Nodes[i].parentId==0) {
			MyCreate(Nodes, i+1);
		}
		else{
			pid = idmap[Nodes[i].parentId];
			console.log(Nodes[i].parentId +" dir now is " + pid);
			chrome.bookmarks.create(addinfo(pid, Nodes[i]), function(data){
				idmap[Nodes[i]['id']] = data['id'];
				MyCreate(Nodes, i+1);
			});
		}
	}
}

function MyremoveTree(id) {
	chrome.bookmarks.getSubTree(id, function(Nodes){
		// console.log(Nodes);
		var len = Nodes[0]["children"].length;
		// console.log(len);
		for (var i = 0; i < len; i++) {
			// console.log(Nodes[0]["children"][i].id);
			chrome.bookmarks.removeTree(Nodes[0]["children"][i].id);
		}
	})
}

$(function() {

	$("#show").click(function(){
		console.log('show');
		dumpBookmarks();
	});

	$("#show2").click(function(){
		console.log('show');
		var nums = 0;
		chrome.storage.local.get({bookmark_nums: 0}, function(item){
		    nums = item.bookmark_nums;
		    console.log('一共存储了'+String(nums)+'份')
    		var download_set = {}
			for (var i = 0; i <= nums; i++) {
			    download_set[i] = ""
			}
			download_string = ""
			chrome.storage.local.get(download_set,function(data){
			    for (var i = 0; i <= nums; i++) {
			        download_string += data[i];
			    }
    			var bookmarks = JSON.parse(download_string);
    			console.log(bookmarks);
    			// bookmarks_length = bookmarks.length;
				// MyCreate(bookmarks, 2);
			})
		});
	});


	$('#removeall').click(function(){
		console.log('remove all');
		MyremoveTree('1');
		MyremoveTree('2');
	})

	$("#update").click(function(){
		var nums = 0;
		chrome.storage.local.get({bookmark_nums: 0}, function(item){
		    nums = item.bookmark_nums;
		    console.log('一共存储了'+String(nums)+'份')
    		var download_set = {}
			for (var i = 0; i <= nums; i++) {
			    download_set[i] = ""
			}
			download_string = ""
			chrome.storage.local.get(download_set,function(data){
			    for (var i = 0; i <= nums; i++) {
			        download_string += data[i];
			    }
    			var bookmarks = JSON.parse(download_string);
    			bookmarks_length = bookmarks.length;
    			// console.log(download_string);
				MyCreate(bookmarks, 2);
			})
		});
	})

	$("#upload").click(function(){
		res_node = [];
		var bookmarkTreeNodes = chrome.bookmarks.getTree(
		    function(bookmarkTreeNodes) {
		    	simplify(bookmarkTreeNodes[0]);

		    	var jsonstr = JSON.stringify(res_node);
				var i = 0;
				var storageObj = {};
				var valueLength = 5000;
				while(jsonstr.length > 0) {
				    var index = i++;
				    var segment = jsonstr.substr(0, valueLength);           
				    storageObj[index] = segment;
				    jsonstr = jsonstr.substr(valueLength);
				}

				chrome.storage.local.set({bookmark_nums: i-1}, function(){
				    console.log('一共分成了'+String(i-1)+'份')
				    chrome.storage.local.set(storageObj, function(){
				        console.log('存储完成')
				    });
				});
	    });
	})
});


// document.addEventListener('DOMContentLoaded', function () {
//   dumpBookmarks();
// });
