function Template() {
    this.tempHtml = '';
    this.placeHolders;
    this.globalSearch = false;
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
                    }
                }
                if (row.hasOwnProperty(objectKey)) {
                    return row[objectKey]
                }
            });
            this.tempHtml += pureSingleItem;
        }
        if (this.tempHtml == "") {
            this.tempHtml = "<div class=\"alert alert-warning text-center\">No Result Found</div>"
        }
        document.querySelector(this.tempId).innerHTML = this.tempHtml;
    },
    filterData: function (formName) {
        var parentThis = this;
        var tempSourceData = this.data;
        document.forms[formName].addEventListener('submit', function (ev) {
            ev.preventDefault();
            tempSourceData = parentThis.individualFilter(tempSourceData, this.elements);
            document.querySelector(parentThis.tempId).innerHTML = " ";
            parentThis.parse(tempSourceData);
        });

    },
    processForm: function (elements) {
        var parentThis = this;
        var retObj = {};
        var elementsName = Object.keys(elements);
        for (var f = 0; f < elementsName.length; f++) {
            if (parentThis.placeHolders.hasOwnProperty(elementsName[f])) {
                var currentELem = parentThis.placeHolders[elementsName[f]];
                retObj[currentELem] = elements[elementsName[f]].value;
            }
        }
        return retObj;
    },
    individualFilter: function (tempSourceData, elements) {
        this.filter = this.processForm(elements);
        for (var prop in this.filter) {
            if (this.filter.hasOwnProperty(prop)) {
                var parentThis = this;
                tempSourceData = tempSourceData.filter(function (value) {
                    var rex = new RegExp('.*' + parentThis.filter[prop].trim() + '.*', 'ig');
                    if (value.hasOwnProperty(prop)) {
                        return value[prop].match(rex);
                    }
                });
            }
        }
        return tempSourceData;
    }
}