/*!
 *  扩展多图上传
 *
 * @file        images-dialog.js
 * @author      杨啸
 * @version     0.1
 * @updateTime  2015-12-10
 */

(function () {

    var factory = function (exports) {

        var pluginName = "image-dialog";

        exports.fn.imageDialog = function () {

            var _this = this;
            var cm = this.cm;
            var lang = this.lang;
            var editor = this.editor;
            var settings = this.settings;
            var cursor = cm.getCursor();
            var selection = cm.getSelection();
            var imageLang = lang.dialog.image;
            var classPrefix = this.classPrefix;
            var iframeName = classPrefix + "image-iframe";
            var dialogName = classPrefix + pluginName, dialog;

            cm.focus();

            var loading = function (show) {
                var _loading = dialog.find("." + classPrefix + "dialog-mask");
                _loading[(show) ? "show" : "hide"]();
            };

            if (editor.find("." + dialogName).length < 1)
            {
                var guid = (new Date).getTime();

                var dialogContent = "<iframe src='" + settings.imageUploadURL + "' name=\"" + iframeName + "\" id=\"" + iframeName + "\" guid=\"" + guid + "\"></iframe>";

                dialog = this.createDialog({
                    title: imageLang.title,
                    width: (settings.imageUpload) ? 830 : 380,
                    height: 400,
                    name: dialogName,
                    content: dialogContent,
                    mask: settings.dialogShowMask,
                    drag: settings.dialogDraggable,
                    lockScreen: settings.dialogLockScreen,
                    maskStyle: {
                        opacity: settings.dialogMaskOpacity,
                        backgroundColor: settings.dialogMaskBgColor
                    },
                    buttons: {
                        enter: [lang.buttons.enter, function () {
                                
                                var item=$(document.getElementById(iframeName).contentWindow.document.body).find("#select");
                                var url = item.attr("data-url");
                                var alt = item.attr("data-alt");
                                //var link = this.find("[data-link]").val();

                                if (url === "" || url==undefined)
                                {
                                    alert(imageLang.imageURLEmpty);
                                    return false;
                                }

                                cm.replaceSelection("![" + alt + "](" + url  + ")");

                                this.hide().lockScreen(false).hideMask();

                                return false;
                            }],
                        cancel: [lang.buttons.cancel, function () {
                                this.hide().lockScreen(false).hideMask();

                                return false;
                            }]
                    }
                });
            }

            dialog = editor.find("." + dialogName);

            this.dialogShowMask(dialog);
            this.dialogLockScreen();
            dialog.show();

        };

    };

    // CommonJS/Node.js
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
    {
        module.exports = factory;
    }
    else if (typeof define === "function")  // AMD/CMD/Sea.js
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
    }
    else
    {
        factory(window.editormd);
    }

})();

