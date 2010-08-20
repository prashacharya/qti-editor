/**
 * $Id: editor_plugin_src.js 848 2008-05-15 11:54:40Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright � 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	var Event = tinymce.dom.Event, each = tinymce.each, DOM = tinymce.DOM;

	tinymce.create('tinymce.plugins.ContextMenu', {
		init : function(ed) {
			var t = this;

			t.editor = ed;
			t.onContextMenu = new tinymce.util.Dispatcher(this);

			ed.onContextMenu.add(function(ed, e) {
				if (!e.ctrlKey) {
					if(ed.settings.readonly != true) {
						t._getMenu(ed).showMenu(e.clientX, e.clientY);
						Event.add(ed.getDoc(), 'click', hide);
						Event.cancel(e);
					}
				}
			});
			ed.addButton('insertgap', {title : 'Insert Gap', cmd : 'InsertGap'});
			//ed.addButton('removegap', {title : 'Remove Gap', cmd : 'RemoveGap'});
			
			function hide() {
				if (t._menu) {
					t._menu.removeAll();
					t._menu.destroy();
					Event.remove(ed.getDoc(), 'click', hide);
				}
			};

			ed.onMouseDown.add(hide);
			ed.onKeyDown.add(hide);
		},

		getInfo : function() {
			return {
				longname : 'Contextmenu',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/contextmenu',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		},

		_getMenu : function(ed) {
			var t = this, m = t._menu, se = ed.selection, col = se.isCollapsed(), el = se.getNode() || ed.getBody(), am, p1, p2;

			if (m) {
				m.removeAll();
				m.destroy();
			}

			p1 = DOM.getPos(ed.getContentAreaContainer());
			p2 = DOM.getPos(ed.getContainer());

			m = ed.controlManager.createDropMenu('contextmenu', {
				offset_x : p1.x + ed.getParam('contextmenu_offset_x', 0),
				offset_y : p1.y + ed.getParam('contextmenu_offset_y', 0),
				constrain : 1
			});

			t._menu = m;

			m.add({title : 'advanced.cut_desc', icon : 'cut', cmd : 'Cut'}).setDisabled(col);
			m.add({title : 'advanced.copy_desc', icon : 'copy', cmd : 'Copy'}).setDisabled(col);
			m.add({title : 'advanced.paste_desc', icon : 'paste', cmd : 'Paste'});

			if ((el.nodeName == 'A' && !ed.dom.getAttrib(el, 'name')) || !col) {
				m.addSeparator();
				m.add({title : 'advanced.link_desc', icon : 'link', cmd : ed.plugins.advlink ? 'mceAdvLink' : 'mceLink', ui : true});
				m.add({title : 'advanced.unlink_desc', icon : 'unlink', cmd : 'UnLink'});
			}

			t.onContextMenu.dispatch(t, m, el, col);
			
			m.addSeparator();
			//m.add({title : 'advanced.image_desc', icon : 'image', cmd : ed.plugins.advimage ? 'mceAdvImage' : 'mceImage', ui : true});
			am = m.addMenu({title : 'Media files support'});
			if((el.id != undefined && el.id == 'runFileUploadLib') || (el.nodeName != undefined && el.nodeName == 'IMG')) {
				am.add({title : 'Insert image', icon : 'fileuploadlib_image', cmd : 'mceAppendImageToPage'}).setDisabled(true);
				am.add({title : 'Insert flash / video movie', icon : 'addvideo', cmd : 'mceAddVideo'}).setDisabled(true);
				am.add({title : 'Remove media file', icon : '', cmd : 'mceRemoveMedia'});
			} else {
				am.add({title : 'Insert image', icon : 'fileuploadlib_image', cmd : 'mceAppendImageToPage'});
				am.add({title : 'Insert flash / video movie', icon : 'addvideo', cmd : 'mceAddVideo'});
				am.add({title : 'Remove media file', icon : '', cmd : 'mceRemoveMedia'}).setDisabled(true);
			}

			m.addSeparator();
			am = m.addMenu({title : 'contextmenu.align'});
			am.add({title : 'contextmenu.left', icon : 'justifyleft', cmd : 'JustifyLeft'});
			am.add({title : 'contextmenu.center', icon : 'justifycenter', cmd : 'JustifyCenter'});
			am.add({title : 'contextmenu.right', icon : 'justifyright', cmd : 'JustifyRight'});
			am.add({title : 'contextmenu.full', icon : 'justifyfull', cmd : 'JustifyFull'});
						
			m.addSeparator();
			
			///////////////////
			
			var selectedNode = el;
			var node = '';
			
			if(selectedNode.nodeName != 'HTML') {
			
				while(selectedNode.nodeName != 'BODY') {
					if(selectedNode.attributes != undefined) {
						
						// QY Comments
						if (selectedNode.nodeName == 'DIV' && selectedNode.getAttribute('class') == 'mceNonEditable qy_comment') {
							node = 'comment';
							break;
						}
						
						// MediaLib
						if(selectedNode.nodeName == 'IMG' || (selectedNode.nodeName == 'FIELDSET' && selectedNode.id == 'runFileUploadLib')) {
							node = 'media';
							break;
						}
						
						// Gap
						if (selectedNode.nodeName == 'SPAN' && selectedNode.id == 'gap') {
							node = 'gap';
							break
						}
						
						// Inline choice
						if (selectedNode.id == 'inlineChoiceInteraction' || selectedNode.id == 'inlineChoiceAnswer' || selectedNode.parentNode.id == 'inlineChoiceAnswer') {
							node = 'inlinechoice';
							break;
						}
						
						// Multiple choice
						if ((selectedNode.nodeName == 'P' && selectedNode.id == 'choiceInteraction' && selectedNode.parentNode.id == 'choiceInteraction') || (selectedNode.nodeName == 'DIV' && selectedNode.id == 'choiceInteraction')) {
							node = 'multiplechoice';
							break;
						}
						
						// Order
						if (selectedNode.id == 'orderOption' || (selectedNode.id == 'choiceInteraction' && selectedNode.parentNode.id == 'orderInteraction')) {
							node = 'order';
							break;
						}
						
						// Match
						if (selectedNode.id != undefined && (selectedNode.id == 'matchInteraction' || selectedNode.id.match(/canvas_/))) {
							node = 'match';
							break;
						}
						
					}
					selectedNode = selectedNode.parentNode;
				}
			
			}
			
			/////////
			
			qtimenu = m.addMenu({title : 'QTI Support'});
			
			if(node != '') {
				qtimenu.add({title : 'Insert gap', icon : 'insertgap', cmd : 'mceGap'}).setDisabled(true);
			} else {
				qtimenu.add({title : 'Insert gap', icon : 'insertgap', cmd : 'mceGap'});
			}
			
			if(node == 'gap') {
				qtimenu.add({title : 'Remove gap', icon : 'removegap', cmd : 'mceGapRemove'});	
			} else {
				qtimenu.add({title : 'Remove gap', icon : 'removegap', cmd : 'mceGapRemove'}).setDisabled(true);	
			}
			
			if(node != '') {
				qtimenu.add({title : 'Insert inline choice element', icon : 'insertinlinechoice', cmd : 'mceInlineChoice'}).setDisabled(true);
			} else {
				qtimenu.add({title : 'Insert inline choice element', icon : 'insertinlinechoice', cmd : 'mceInlineChoice'});
			}
			if(node == 'inlinechoice') {
				qtimenu.add({title : 'Remove inline choice element', icon : 'removeinlinechoice', cmd : 'mceInlineChoiceRemove'});
			} else {
				qtimenu.add({title : 'Remove inline choice element', icon : 'removeinlinechoice', cmd : 'mceInlineChoiceRemove'}).setDisabled(true);	
			}
			
			if(node != '') {
				qtimenu.add({title : 'Insert choice section', icon : 'insertchoicesection', cmd : 'mceChoice'}).setDisabled(true);
			} else {
				qtimenu.add({title : 'Insert choice section', icon : 'insertchoicesection', cmd : 'mceChoice'});
			}
			if(node == 'multiplechoice') {
				qtimenu.add({title : 'Remove choice section', icon : 'removechoicesection', cmd : 'mceChoiceRemove'});
			} else {
				qtimenu.add({title : 'Remove choice section', icon : 'removechoicesection', cmd : 'mceChoiceRemove'}).setDisabled(true);	
			}
			
			if(node != '') {
				qtimenu.add({title : 'Insert order section', icon : 'insertordersection', cmd : 'mceOrder'}).setDisabled(true);
			} else {
				qtimenu.add({title : 'Insert order section', icon : 'insertordersection', cmd : 'mceOrder'});
			}
			if(node == 'order') {
				qtimenu.add({title : 'Remove order section', icon : 'removeordersection', cmd : 'mceOrderRemove'});
			} else {
				qtimenu.add({title : 'Remove order section', icon : 'removeordersection', cmd : 'mceOrderRemove'}).setDisabled(true);	
			}
			
			if(node != '') {
				qtimenu.add({title : 'Insert match section', icon : 'insertmatchsection', cmd : 'mceMatch'}).setDisabled(true);
			} else {
				qtimenu.add({title : 'Insert match section', icon : 'insertmatchsection', cmd : 'mceMatch'});
			}
			if(node == 'match') {
				qtimenu.add({title : 'Remove match section', icon : 'removematchsection', cmd : 'mceMatchRemove'});
			} else {
				qtimenu.add({title : 'Remove match section', icon : 'removematchsection', cmd : 'mceMatchRemove'}).setDisabled(true);	
			}
		
			//if(tinymce.plugins.applinkPlugin != undefined) {
			//	
			//	m.addSeparator();
			//	
			//	m.add({title : 'Insert / modify applink', icon : 'insertapplink', cmd : 'mceApplink'});
			//	if(el.nodeName == 'APPLINK') {
			//		m.add({title : 'Remove applink', icon : 'removeapplink', cmd : 'mceApplinkRemove'});	
			//	} else {
			//		m.add({title : 'Remove applink', icon : 'removeapplink', cmd : 'mceApplinkRemove'}).setDisabled(true);	
			//	}
			//	
			//}
			
			if(tinymce.plugins.commentPlugin != undefined) {
				
				m.addSeparator();
				
				if(node == 'comment') {
					m.add({title : 'Insert / modify comment', icon : 'insertcomment', cmd : 'mceComment'}).setDisabled(true);
					m.add({title : 'Remove comment', icon : 'removecomment', cmd : 'mceCommentRemove'});	
				} else {
					if(selectedNode.getAttribute('class') != 'qy_comment') {
						m.add({title : 'Insert / modify comment', icon : 'insertcomment', cmd : 'mceComment'});
					}
					m.add({title : 'Remove comment', icon : 'removecomment', cmd : 'mceCommentRemove'}).setDisabled(true);	
				}
				
			}
			
			m.addSeparator();
				
			if(node == 'gap' || node == 'inlinechoice' || node == 'multiplechoice' || node == 'order' || node == 'match') {
				m.add({title : 'Copy QTI activity', icon : 'copyqtibutton', cmd : 'mceCopyQTI', ui: selectedNode});
			} else if (tinyMCE.clipboard != undefined && ed.selection.getContent() == '') {
				m.add({title : 'Paste QTI activity', icon : 'pasteqtibutton', cmd : 'mcePasteQTI'});
			}
			
			return m;
		}
	});

	// Register plugin
	tinymce.PluginManager.add('contextmenu', tinymce.plugins.ContextMenu);
})();