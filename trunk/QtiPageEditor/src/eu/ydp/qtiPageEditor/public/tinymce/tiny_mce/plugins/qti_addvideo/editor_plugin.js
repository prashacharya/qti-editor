(function() {

	tinymce.create('tinymce.plugins.addVideoPlugin', {
		
		init : function(ed, url) {
			
			ed.addCommand('mceAddVideo', function(ui, data) {

				var node = ed.selection.getNode();
				if(node.nodeName != 'DIV') {
					node = node.parentNode;
				}
				
				var browseCallback = {

					onBrowseComplete : function(filePath, title) {
						var node = ed.selection.getNode();
						var paragraph = '';

						if(data != undefined && data.src != undefined && data.src != '') {

							while(node.nodeName != 'FIELDSET') {
								node = node.parentNode;
							}

							if (node.nodeName == 'FIELDSET' && node.id == 'runFileUploadLib') {
								node.parentNode.removeChild(node);
							}

						} else {
							paragraph = '<p>&nbsp;</p>';
							
							if (node.nodeName == 'P' && node.attributes.length == 0) {
								var prefix = '';
								
								if (null != node.lastElementChild && node.lastElementChild.nodeName == 'BR') {
									node.removeChild(node.lastElementChild);
								}
								
								if (null != node.previousElementSibling && node.previousElementSibling.nodeName == 'FIELDSET' && node.previousElementSibling.id == 'runFileUploadLib') {
									prefix = '<p>&nbsp;</p>';
								}
								ed.execCommand('mceInsertContent',false,'<span id="__caret">_</span>');

								var pNode = ed.selection.getNode();
								
								ed.dom.setOuterHTML(pNode, pNode.innerHTML);

								var carretNode = ed.dom.get('__caret');
								var node = carretNode.parentNode.firstChild;
								var innerHtml = '';
								pNode = carretNode.parentNode;
								
								while(null != node) {

									if (node.nodeType == 3) {
										
										if ($.trim(node.nodeValue) != '' && node.nodeValue != '\n\n') {
											innerHtml += prefix+'<p>'+node.textContent+'</p>';
											prefix = '';
										}

									} else {
										innerHtml += ed.dom.getOuterHTML(node);
									}
									node = node.nextSibling;
								}
								pNode.innerHTML = innerHtml;

								var rng = ed.dom.createRng();

								rng.setStartBefore(ed.dom.get('__caret'));
								rng.setEndAfter(ed.dom.get('__caret'));
								ed.selection.setRng(rng);
							}
						} 

						var fromPath = tinyMCE.gwtProxy.getPageBasePath();
						var prefix = fromPath.match(/^(.*\/)ctrl.php/i);
						fromPath = fromPath.split('/');
						fromPath.pop();
						fromPath = fromPath.join('/');
						filePath = getRelativeFromAbsoute(fromPath, filePath);
						var videotag = paragraph+'<fieldset id="runFileUploadLib" class="mceNonEditable" style="font-size: 10px; font-color: #b0b0b0; color: #b0b0b0; border: 1px solid #d0d0d0;"><embed src="' + fromPath + '/' + filePath + '" href="' + fromPath + '/' + filePath + '" autostart="false" type="video/mp4" target="myself" scale="tofit"/><img id="mceVideo" src="' + prefix[1] + 'tools/qtitesteditor/tinymce/tiny_mce/plugins/qti_addvideo/img/movie.png" /><br>' + title + '</fieldset><span id="focus">_</span>'+paragraph;
						ed.execCommand('mceInsertContent', false, videotag);

						var toFocus = ed.dom.get('focus').nextElementSibling.firstChild;
						rng = ed.dom.createRng();
						rng.setStart(toFocus, toFocus.nodeValue.length);
						rng.setEnd(toFocus, toFocus.nodeValue.length);
						ed.selection.setRng(rng);
						ed.dom.remove('focus')
						return true;
					},
					
					onBrowseError : function(error) {
						tinyMCE.activeEditor.windowManager.alert(error);
						return false;
					}
					
				}
				
				var extensions = [".mp4", ".swf", ".flv", ".avi"];
				
				var assetBrowser = tinyMCE.gwtProxy.getAssetBrowser();
				
				if(data != undefined) {
					if(data.src != undefined && data.src != '') {
						srcArr = data.src.split('/');
						fileName = String(srcArr[srcArr.length-1]);
						assetBrowser.setSelectedFile(fileName);
					}
					if(data.title != undefined && data.title != '') {
						assetBrowser.setTitle(data.title);
					}
				}
				
				assetBrowser.browse(browseCallback, extensions);
				$('.gwt-TextBox').focus();
			});
			
			ed.addButton('addvideo', {title : 'Add video / flash movie', cmd : 'mceAddVideo'});
			
		},

		getInfo : function() {
			return {
				longname : 'Plugin for uploading movies and flash',
				author : '<a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : "1.0"
			};
		}
	});

	tinymce.PluginManager.add('qti_addvideo', tinymce.plugins.addVideoPlugin);
})();

function getRelativeFromAbsoute(absoluteFrom, absoluteTo) {
	
	var absoluteFromDir = absoluteFrom;
	var absoluteFromDirArr = absoluteFromDir.split("/");
	var prefix = "";
	var path;

	while (absoluteFromDirArr.length) {
		absoluteFrom = absoluteFromDirArr.join('/');
		if (absoluteTo.indexOf(absoluteFrom) == - 1) {
			if (absoluteFromDirArr.pop() != "") {
				prefix+= "../";
			}
		} else {
			break;
		}
	}
	
	if (prefix == "") {
		path = prefix + absoluteTo.substring(absoluteFrom.length, absoluteTo.length);
	} else {
		path = prefix + absoluteTo.substring(absoluteFrom.length + 1, absoluteTo.length);
	}
	
	return path;
	
}