function dp(inputName, source) {
    var id = '';
    var favfoods = document.querySelector(inputName);
    if (favfoods.hasAttribute('id')) {
        id = favfoods.getAttribute('id');
    }
    var listName = id + "dp_datalist";
    favfoods.setAttribute('list', listName);
    var dlist = document.createElement('datalist');
    dlist.setAttribute('id', listName);
    if (Array.isArray(source) == false) {
        var sourcData = favfoods.getAttribute('data-datalist-options');
        if (sourcData.length > 0) {
            var source = sourcData.split(',');
        }
    }
    for (var i = 0; i < source.length; i++) {
        var ditems = document.createElement('option');
        ditems.setAttribute('value', source[i]);
        dlist.appendChild(ditems);
    }
    var favParent = favfoods.parentNode;
    favParent.insertBefore(dlist, favfoods.nextSibling);
}
function MultiDp() {
    this.searchField;
    this.parentDiv;
    this.dataSource;
    this.multiple;
    this.optionClass = 'list-group';
    this.ulClass = 'list-group-item';
    this.element;
    this.token = ',';
    this.dpHolderName = 'dropdownholder_';
}
MultiDp.prototype = {
    constructor: MultiDp,
    setOpt: function (settings) {
        var setProp = Object.keys(settings);
        for (var i = 0; i < setProp.length; i++) {
            // console.log(setProp[i]);
            var prop = setProp[i].toString();
            if (this[prop] != 'undefined') {
                this[prop] = settings[prop];
            }
        }
    },
    initDom: function () {
        this.element = document.querySelector(this.searchField);
        if (this.element.hasAttribute('id')) {
            this.dpHolderName = 'dropdownholder_' + this.element.getAttribute('id');
        }
        var dropdownHolder = document.createElement('div');
        dropdownHolder.classList.add(this.dpHolderName);
        var ulHolder = document.createElement('ul');
        ulHolder.classList.add(this.ulClass);
        dropdownHolder.appendChild(ulHolder);
        this.parentDiv = this.element.parentNode;
        this.parentDiv.insertBefore(dropdownHolder, this.element.nextSibling);
    },
    autoComplete: function () {
        var parentThis = this;
        this.element.addEventListener('keyup', function () {
            var keyword = this.value;
            if (parentThis.multiple == true && keyword.lastIndexOf(parentThis.token) != -1) {
                var kpart = keyword.split(',');
                if (Array.isArray(kpart) && kpart.length > 0) {
                    keyword = kpart.pop();
                }
            }

            var lists = parentThis.dataSource.filter(function (value) {
                var rex = new RegExp('.*' + keyword + '.*', 'i');
                return value.match(rex);
            });
            var ddholder = document.createElement('ul');
            for (var i = 0; i < lists.length; i++) {
                var litem = document.createElement('li');
                litem.classList.add(parentThis.optionClass);
                var text = document.createTextNode(lists[i]);
                litem.appendChild(text);
                ddholder.appendChild(litem);
            }

            if (document.getElementsByClassName(parentThis.dpHolderName).length > 0) {
                var ddHtml = document.querySelector('.' + parentThis.dpHolderName);
                ddHtml.removeChild(ddHtml.firstChild);
                ddHtml.appendChild(ddholder);
                ddHtml.style.display = 'block';
            } else {
                var dropdownHolder = document.createElement('div');
                dropdownHolder.classList.add(parentThis.dpHolderName);
                dropdownHolder.appendChild(ddholder);
                parentThis.parentDiv.insertBefore(dropdownHolder, this.nextSibling);
            }

        }, false);
    },
    fill: function () {
        var parentThis = this;
        var dpObj = document.querySelector('.' + this.dpHolderName);
        dpObj.addEventListener('click', function (e) {
            if (e.target.nodeName == 'LI') {
                var extValue = parentThis.element.value;
                var currentOption = e.target.textContent;
                extValue.trim();
                if (extValue.lastIndexOf(',') != -1) {
                    var extPureVal = extValue.substr(0, extValue.lastIndexOf(','));
                    currentOption = extPureVal + parentThis.token + currentOption;
                }
                parentThis.element.value = currentOption;
                dpObj.style.display = 'none';
            }
        }, false);
    },
    run: function () {
        this.initDom();
        this.autoComplete();
        this.fill();
    }
}

Object.preventExtensions(MultiDp);
Object.seal(MultiDp);


