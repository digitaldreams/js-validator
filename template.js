function Template() {
    this.tempHtml = '';
    this.placeHolders;
    this.globalSearch = false;
    this.filter = {};
    this.index = {
        start: 0,
        end: 0,
    };
    this.pagination = {};

    this.data;
    this.tempData;
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
        if (this.pagination.hasOwnProperty('perpage')) {
            this.index.end = parseInt(this.pagination.perpage)
        } else {
            this.index.end = this.data.length;
        }
        this.tempData = this.data.slice(this.index.start, this.index.end);
        this.parse();
    },
    collectData: function () {
        if (typeof this.ajax != "undefined") {
            if ("url" in this.ajax) {

            }
        }
    },
    parse: function () {
        this.tempHtml = "";
        for (var i = 0; i < this.tempData.length; i++) {
            var singleItem = this.elem;
            var row = this.tempData[i];
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
            parentThis.tempData = tempSourceData;
            parentThis.parse();
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
    },
    paginate: function () {
        var startIndex = 0;
        var endIndex = 0;
        if (this.pagination.hasOwnProperty('wrapper') || this.pagination.hasOwnProperty('perpage')) {
            var wrapper = document.querySelector(this.pagination.wrapper);
            if (this.data.length > this.pagination.perpage) {
                var pageId = 0;
                for (var p = 0; p < this.data.length; p += this.pagination.perpage) {
                    pageId += 1;
                    var list = document.createElement('LI');
                    var anchor = document.createElement('A');
                    anchor.setAttribute('href', 'javascript://');
                    anchor.setAttribute('data-page', p);
                    var linkText = document.createTextNode(pageId);
                    anchor.appendChild(linkText);
                    list.appendChild(anchor);
                    wrapper.appendChild(list);
                }
            } else {
                this.index.end = this.data.length;

            }
            this.linkEvt();
        }
    },
    linkEvt: function () {
        var parentThis = this;
        var paginateWrapper = document.querySelector(this.pagination.wrapper);
        paginateWrapper.addEventListener('click', function (evt) {
            if (evt.target.nodeName == 'A') {
                var pagegId = evt.target.getAttribute('data-page');
                parentThis.index.start = parseInt(pagegId);
                parentThis.index.end = parseInt(parentThis.index.start) + parseInt(parentThis.pagination.perpage);
                if (parentThis.index.end > parentThis.data.length) {
                    parentThis.index.end = parentThis.data.length;
                }
                parentThis.tempData = parentThis.data.slice(parentThis.index.start, parentThis.index.end);
                parentThis.parse();
            }
        });
    }



}