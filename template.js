function Template() {
    this.tempHtml = '';
    this.placeHolders;
    this.filter = {};
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
        this.elem = document.querySelector(this.tempId).innerHTML;
        this.parse(this.data);
    },
    collectData: function () {
        if (typeof this.ajax != "undefined") {
            if ("url" in this.ajax) {

            }
        }
    },
    parse: function (sourceData) {
        this.tempHtml = "";
        for (var i = 0; i < sourceData.length; i++) {
            var singleItem = this.elem;
            var row = sourceData[i];
            var parentThis = this;
            var pureSingleItem = singleItem.replace(/\{\{(\w*)\}\}/g, function (a, b) {
                var objectKey = b;
                if (typeof parentThis.placeHolders != "undefined") {
                    if (parentThis.placeHolders.hasOwnProperty(b)) {
                        objectKey = parentThis.placeHolders[b];
                    } else {
                        objectKey = b;
                    }
                }
                if (row.hasOwnProperty(objectKey)) {
                    return row[objectKey]
                } else {
                    //  console.log(b);
                }
            });
            this.tempHtml += pureSingleItem;
        }
        document.querySelector(this.tempId).innerHTML = this.tempHtml;

    },
    formValue: function (formName) {
        var parentThis = this;
        var formELem = document.forms[formName].elements;
        document.forms[formName].addEventListener('submit', function (ev) {
            ev.preventDefault();
            var elementsName = Object.keys(this.elements);
            for (var f = 0; f < elementsName.length; f++) {
                if (parentThis.placeHolders.hasOwnProperty(elementsName[f])) {
                    var currentELem = parentThis.placeHolders[elementsName[f]];
                    // console.log(currentELem);
                    parentThis.filter[currentELem] = this.elements[elementsName[f]].value;
                }
            }
            var tempSourceData = parentThis.data;
            for (var prop in parentThis.filter) {
                if (parentThis.filter.hasOwnProperty(prop)) {
                    tempSourceData = tempSourceData.filter(function (value) {
                        var rex = new RegExp('.*' + parentThis.filter[prop].trim() + '.*', 'i');
                        if (value.hasOwnProperty(prop)) {
                            return value[prop].match(rex);
                        }

                    });
                }
            }
            document.querySelector(parentThis.tempId).innerHTML = " ";
            parentThis.parse(tempSourceData);
        });

    }
}