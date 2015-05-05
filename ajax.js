function Dpajax() {
    this.url;
    this.data;
    this.success;
    this.loading;
    this.error;
    this.abort;
    this.contentType = 'application/x-www-form-urlencoded';
    this.dataType = 'text';
    this.method;
    this.xhr = '';
    Object.defineProperty(this, 'state', {
        value: {
            UNINITIALIZED: 0,
            LOADING: 1,
            LOADED: 2,
            INTERACTIVE: 3,
            COMPLETE: 4
        },
        writable: false,
        enumerable: true,
        configurable: false
    });
    Object.defineProperty(this, 'responseType', {
        value: ['arraybuffer', 'blob', 'document', 'json', 'text'],
        writable: false,
        enumerable: true,
        configurable: true
    });
}
Dpajax.prototype = {
    constructor: Dpajax,
    settings: function (setting) {
        var setProp = Object.keys(setting);
        for (var i = 0; i < setProp.length; i++) {
            var prop = setProp[i].toString();
            if (this[prop] != 'undefined') {
                this[prop] = setting[prop];
            }
        }
    },
    initObj: function () {
        if (window.XMLHttpRequest) {
            this.xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            var versions = ["MSXML2.XmlHttp.5.0",
                "MSXML2.XmlHttp.4.0",
                "MSXML2.XmlHttp.3.0",
                "MSXML2.XmlHttp.2.0",
                "Microsoft.XmlHttp"]

            for (var i = 0, len = versions.length; i < len; i++) {
                try {
                    this.xhr = new ActiveXObject(versions[i]);
                    break;
                }
                catch (e) {
                }
            } // end for
        } else {
            console.log('Ajax does not supported to your browser.');
        }
    },
    handleResponse: function () {
        if (this.xhr.readyState != "undefined" && this.xhr.readyState == this.state.COMPLETE) {
            if (this.success != "undefined") {
                this.success(this.xhr.response);
            } else {
                return;
            }
        } else if (this.xhr.readyState != "undefined" && this.xhr.readyState == this.state.LOADING){
            if (this.loading != "undefined") {
                this.loading();
            } else {
                return;
            }
        } else {
            if (this.xhr.status != 200) {
                if (this.error != "undefined") {
                    this.error();
                } else {
                    return;
                }
            }
        }
    },
    run: function () {
        this.initObj();
        this.xhr.open(this.method, this.url, true);
        var parentThis = this;
        this.xhr.onreadystatechange = function () {
            parentThis.handleResponse();
        };
        if (this.responseType.indexOf(this.dataType) != -1) {
            this.xhr.responseType = this.dataType;
        }
        this.xhr.setRequestHeader("Content-Type", this.contentType);
        this.xhr.send(this.data);
    },
}


Object.preventExtensions(Dpajax);
Object.seal(Dpajax);
 