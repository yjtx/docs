/*!
 *  img dialog plugin for Editor.md
 *
 * @file        img-dialog.js
 * @author      yangxiao
 * @version     0.0.1
 * @updateTime  2016-03-07
 */
(function () {

    var factory = function (exports) {

        var pluginName = "img-dialog";

        exports.fn.imgDialog = function () {

            var _this = this;
            var $_this;
            var cm = this.cm;
            var editor = this.editor;
            var settings = this.settings;
            var selection = cm.getSelection();
            var lang = this.lang;
            var imgLang = {"url": "url", "urlTitle": "标题", "title": "插入图片", "urlEmpty": ""};
            var classPrefix = this.classPrefix;
            var dialogName = classPrefix + pluginName, dialog;
            cm.focus();
            if (editor.find("." + dialogName).length > 0)
            {
                editor.find("." + dialogName).remove();
            }

                var dialogHTML = "<div class=\"" + classPrefix + "form\">" +
                        "<div class=\"modal-dialog\" style=\" margin: 0px;width:auto\">" +
                        "<div class=\"\">" +
                        "<div class=\"modal-body\">" +
                        "<p>请填写图片URL：</p>" +
                        "<div class=\"input-group\">" +
                        "<span class=\"input-group-addon\"><i class=\"fa fa-image\"></i></span><input id=\"input-insert-image\" type=\"text\" class=\"form-control\" style=\"width: 100%;\" placeholder=\"http://example.com/image.jpg\">" +
                        "</div>" +
                        "<div class=\"help-block\"><b>注意：</b> <span>文集支持从剪切板直接复制图片，截屏粘贴到输入框试试。支持（JPG,PNG,GIF）。</span></div>" +
                        "</div>" +
                        "<div class=\"modal-footer\" style=\"text-align: left;\">" +
                        "<a href=\"#\" class=\"btn btn-default\"><input type=\"file\" id=\"uploader\" name=\"files[]\" multiple=\"\" onchange=\"\" style=\"position:absolute;opacity:0; filter: alpha(opacity=0); font-size:23px; direction: ltr; cursor: pointer;width: 134px;margin-top: -4px;margin-left: -10px;\"><i class=\"fa fa-hdd-o\"></i> 插入本地图片... </a>" +
                        "</div>" +
                        "</div>" +
                        "</div>" +
                        "</div>";

                dialog = this.createDialog({
                    title: imgLang.title,
                    name: dialogName,
                    width: 600,
                    height: 311,
                    content: dialogHTML,
                    mask: settings.dialogShowMask,
                    drag: settings.dialogDraggable,
                    lockScreen: settings.dialogLockScreen,
                    maskStyle: {
                        opacity: settings.dialogMaskOpacity,
                        backgroundColor: settings.dialogMaskBgColor
                    },
                    buttons: {
                        enter: [lang.buttons.enter, function () {
                                var link = this.find("#input-insert-image").val();

                                if (link === "" || link === "http://")
                                {
                                    cm.replaceSelection("![标题](URL路径)");
                                }
                                else
                                {
                                    cm.replaceSelection("![](" + link + ")");
                                }

                                this.hide().lockScreen(false).hideMask();

                                return false;
                            }],
                        cancel: [lang.buttons.cancel, function () {
                                this.hide().lockScreen(false).hideMask();

                                return false;
                            }]
                    }
                });
                
                var inputPaste=function(event){
                    var clipboardData = event.originalEvent.clipboardData,
                    i = 0, items, item, types;

                    if (clipboardData) {
                        items = clipboardData.items;

                        if (!items) {
                            alert("仅支持 Chrome 或 Microsoft Edge");
                            return;
                        }
                        item = items[0];
                        types = clipboardData.types || [];

                        for (; i < types.length; i++) {
                            if (types[i] === 'Files') {
                                item = items[i];
                                break;
                            }
                        }

                        if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
                            editormd.imgReader(item.getAsFile(),null,cm);
                            $_this.hide().lockScreen(false).hideMask();
                        }
                    }
                };
                
                var upLoader=function(event){
                    var fileList = event.target.files;
                    var item;
                    for(var i=0;i<fileList.length;i++)
                    {
                        item=fileList[i];
                        if (item.type.match(/^image\//i))
                        {
                            //lastModified: 1351315098000
                            //lastModifiedDate: Sat Oct 27 2012 13:18:18 GMT+0800 (中国标准时间)
                            //name: "鬼谷子-NPC.jpg"
                            //size: 735496
                            //type: "image/jpeg"
                            //webkitRelativePath: ""
                            editormd.imgReader(item,item.name,cm);
                        }
                    }
                    $_this.hide().lockScreen(false).hideMask();
                };
                $_this= dialog;
                $(dialog).find("#uploader").bind('change',upLoader);
                $(dialog).find("#input-insert-image").bind('paste',inputPaste);
            
        };
    };

    // CommonJS/Node.js
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
    {
        module.exports = factory;
    } else if (typeof define === "function")  // AMD/CMD/Sea.js
    {
        if (define.amd) { // for Require.js

            define(["editormd"], function (editormd) {
                factory(editormd);
            });

        } else { // for Sea.js
            define(function (require) {
                var editormd = require("./../../editormd");
                factory(editormd);
            });
        }
    } else
    {
        factory(window.editormd);
    }

})();
