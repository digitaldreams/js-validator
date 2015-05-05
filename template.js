function Template() {
    this.tempHtml = '';
    this.placeHolders;
    this.data;
    this.ajax;
    this.elem;
    this.tempId;
}
Template.prototype = {
    constructor: Template(),
    settings: function (setting) {
        var setProp = Object.keys(setting);
        for (var i = 0; i < setProp.length; i++) {
            var prop = setProp[i].toString();
            if (this[prop] != 'undefined') {
                this[prop] = setting[prop];
            }
        }
    },
    collectData: function () {
        if (typeof this.ajax != "undefined") {
            if ("url" in this.ajax) {

            }
        }
    },
    parse: function () {
        this.elem = document.querySelector(this.tempId).innerHTML;
        for (var i = 0; i < this.data.length; i++) {
            var singleItem = this.elem;
            var row = this.data[i];
            var parentThis = this;
            var pureSingleItem = singleItem.replace(/\{\{(\w*)\}\}/g, function (a, b) {
                var objectKey = b;
                if (typeof parentThis.placeHolders != "undefined") {
                    if (typeof parentThis.placeHolders[b] != 'undefined') {
                        objectKey = parentThis.placeHolders[b];
                    } else {
                        objectKey = b;
                    }
                }
                if (typeof row[objectKey] != "undefined") {
                    return row[objectKey]
                    console.log(b);
                } else {
                  //  console.log(b);
                }
            });
            this.tempHtml += pureSingleItem;
        }
        document.querySelector(this.tempId).innerHTML = this.tempHtml;

    }
}