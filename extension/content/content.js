// Selected comment elements
var comment_list = [];
// Selected comment ids to be sent to server
var comment_ids = [];

/**
	* Iterate through all comments on the page
	* Builds and adds checkboxes to each comment
**/
$(function() {
	var comments = document.querySelectorAll('div.content .commentarea .thing');

	for (var i = 0; i < comments.length; i++) {
		var lie = document.createElement("li");
		var box = document.createElement("input");
		var spa = document.createElement("span");
		var spaText = document.createTextNode("Check if this is useful for summarizing the thread: ");
		spa.appendChild(spaText);
		box.setAttribute("type", "checkbox");
		box.setAttribute("id", "mycheckbox");
		lie.setAttribute("class", "mycheckboxli");
		spa.style.color = "#538C9E"
		spa.style.fontWeight = "bold";
		box.style.verticalAlign = "text-top";
		lie.appendChild(spa);
		lie.appendChild(box);

		comments[i].querySelector('div.entry ul.flat-list').appendChild(lie);
		$(box).click(function(){
			var temp = 	$(this).closest('.thing');
			// Change comments color to green
			// Not clicked yet
			if (temp.attr('clicked') == undefined || temp.attr('clicked') == "false") {
				temp.toggleClass('clicked');
				temp.attr('clicked', "true");
				comment_list.push(temp[0]);
				comment_ids.push(temp.attr('id'));
			}
			// Revert comments color back
			else if (temp.attr('clicked') == "true"){
				temp.toggleClass('clicked');
				temp.attr('clicked', "false");
				for(var i = 0; i < comment_ids.length; i++) {
					if(temp.attr('id') == comment_ids[i]){
						comment_ids.splice(i,1);
						comment_list.splice(i,1);
					}
				}
			}
		});
		if ( comments[i].querySelector('div.child .thing .morechildren') ) {
			var temp = comments[i].querySelector('div.child .thing .morechildren .entry .flat-list .mycheckboxli');
		}
	}
});

/**
 	* remove check boxes from load more comment sections after adding them
**/
$(function() {
	var comments = document.querySelectorAll('div.content .commentarea .thing');

	for (var i = 0; i < comments.length; i++) {
		if ( comments[i].querySelector('div.thing .morecomments')) {
			var temp = comments[i].querySelector('div.thing .morechildren .entry .flat-list');
			if (temp) {
				temp.parentNode.removeChild(temp);
			}
		}
	}

});

// Mutation Observer----------------------------------------------------------------
/**
	* TODO: Add checkboxes to comments that have yet loaded not implememnted
	* Use the code below to use a mutation observer to look for newly loaded Comments
**/

// Find the Tweet stream of the Timeline
var target = document.querySelector('parent of button');
// var target = document.querySelector('div[data-test-selector="ProfileTimeline"]');
if (target !== null) {
	// Create an observer to listen for mutations in the Timeline
	var observer = new MutationObserver(loadMoreComments);
	// Specify configuration options of the observer
	var config = { attributes: true, childList: true, characterData: true };
	// Pass in the target node and the observer options
	observer.observe(target, config);
}

// Modal ----------------------------------------------------------------------
/**
	* Build Menu and add to page
	* Menu button is added to the left side of user screen and follows their view
	* Menu button opens the Submission modal when clicked
**/

// Add Bot Search Result button
$(document.body).append(`<button id="myBtn" style="height:175px;left:-2px;top:40%;"><span id='BSRicon'></span></button>`);
// add bot icon to BSR button
var value = document.body.querySelector('#myBtn');
// Modal initialization
var modal = document.createElement('div');
modal.id = 'myModal';
modal.classList.add('mod');
document.body.appendChild(modal);

// close section of modal
var close = document.createElement('div');
close.classList.add('PermalinkProfile-dismiss', 'modal-close-fixed');
modal.appendChild(close);

// close button of modal
var closeIcon = document.createElement('span');
closeIcon.id = 'clo';
closeIcon.classList.add('Icon', 'Icon--close');
close.appendChild(closeIcon)

// content of modal
var con = document.createElement('div');
con.classList.add('mod-content');
modal.appendChild(con);

// Initialize modal contents
var modalTitle = document.createElement('h1');
var submitButton = document.createElement('button');
submitButton.style.float = 'right';
var newLine = document.createElement('br');
var searchContent = document.createElement('div');
searchContent.id = 'modalContentDiv';
var commentContent = document.createElement('div');
commentContent.id = 'modalContentDivComment';
var textnode = document.createTextNode('Write a summary of the thread in the box below. Click the checkbox for any comments in the thread that you believe are the most necessary to understand the thread and to generate a summary of the thread.');
var posth = document.createElement('h1');
var posts = document.createTextNode('Chosen Comments: ');
posth.appendChild(posts);
var textnodeButton = document.createTextNode('Submit');
modalTitle.appendChild(textnode);
submitButton.appendChild(textnodeButton);
con.appendChild(modalTitle);
con.appendChild(newLine);
con.appendChild(searchContent);

var tx = document.createElement('textarea');
tx.id = 'mytextarea';
tx.style.maxWidth = "100%";
tx.style.minWidth = "100%";
tx.style.minHeight = "200px";
searchContent.appendChild(tx);
searchContent.appendChild(submitButton);
commentContent.appendChild(posth);
con.appendChild(commentContent);

// Get the modal
var modal = document.getElementById('myModal');
// Get the button that opens the modal
var btn = document.getElementById("myBtn");
// Clear button in modal
var cbtn = document.getElementById('clear');
// Get the <span> element that closes the modal
var span = document.getElementById("clo");

// Open Modal
btn.onclick = function(event) {
	event.stopPropagation();
	if (event.target.id = 'myBtn') {
		modal.style.display = "block";
	}

	// reset comment list ul
	var old_ul = document.querySelector("#comment_ul");
	if (old_ul) {
		old_ul.parentNode.removeChild(old_ul);
	}

	// update list with current comment_list
	var commentUL = document.createElement("ul");
	commentUL.setAttribute("id", "comment_ul");
	for (var i = 0; i < comment_list.length; i++) {
		var commentLI = document.createElement("li");
		var parent = $(comment_list[i]).clone()[0];
		commentLI.appendChild(parent);
		parent.removeChild(parent.querySelector(".child"));
		$(parent.querySelector(".flat-list")).remove();
		var commentClose = document.createElement("span");
		commentClose.class = "close";
		commentClose.style.cursor = "pointer";
		commentClose.style.float = "right";
		commentClose.style.fontSize = "initial";
		var closeText = document.createTextNode('x');
		commentClose.appendChild(closeText);
		parent.querySelector("div.entry .tagline").appendChild(commentClose);
		commentUL.appendChild(commentLI);
		$(commentClose).click(function(){
			// remove element
			var thisComment =	$(this).closest('.thing');
			thisComment.remove();
			// get id
			var thisCommentId = thisComment.attr("id");
			// uncheck from main page
			var mainComment = $("#" + thisCommentId)[0];
			var mainCommentCheck = mainComment.querySelector("#mycheckbox");
			mainCommentCheck.click();
		});
	}
	posth.appendChild(commentUL);
}

// submit
// Submit textarea and comment_ids
submitButton.onclick = function(event) {
	event.stopPropagation();
	var text = $('textarea#mytextarea').val();
	comment_ids.unshift(text);
	chrome.runtime.sendMessage({
		method: 'POST',
		action: 'xhttp',
		url: 'http://localhost:5000/test',
		data: JSON.stringify(comment_ids),
	},
	function(string) {
		console.log("submit success");
	});
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

/**
* Add Search Result info to modal content
**/
function modalContent(results, bot_score) {
	var lines = results.split('|');
	// bot user : score
	var count = 0;
	for (var index = 0; index < lines.length; index++) {
		var line = lines[index].split(':');
		var user = line[0];
		var score = line[1];
		// only add bots to results
		if (score > bot_score) {
			var p = document.createElement('a');
			var s = document.createElement('span');
			var b = document.createElement('br');
			var textnode = document.createTextNode(user);
			p.appendChild(textnode);
			var textnodes = document.createTextNode('score: ' + score);
			s.appendChild(textnodes);
			s.setAttribute('style', 'margin-right:65%;float:right');
			searchContent.appendChild(p);
			searchContent.appendChild(s);
			searchContent.appendChild(b);
		}
	}
}
