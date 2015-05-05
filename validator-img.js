
function fileObj(inputId) {

    var element = document.querySelector(inputId);
    this.fileObject = element.files;
    /**
     * File Original Size in kilo byte I KB=1024 Kilo Bytes
     */
    this.files;
    /**
     * File Type like Image or text or Application
     */
    this.fileType = "image";
    this.size;
    this.maxSize = 1024;
    /**
     * Accept a comma seperate extension size.like jpeg,jpg,png,gif etc
     */
    this.allowedtype;
    /**
     * This will internal use only. It explode the allowedtype and make an array of extension
     * @returns array
     */
    this.acceptType = new Array();

    this.size;
    this.type;
    //When the last modified this file.
    this.lastModified;
    //Name of the File
    this.name;
    //Temp Upload directory of this file.
    this.error = new Array();
    this.init = function () {
        for (var i = 0; i < this.fileObject.length; i++) {
            this.files = this.fileObject[i];
            this.size = this.files.size;
            this.name = this.files.name;
            this.type = this.files.type;
            this.lastModified = this.files.lastModifiedDate;
            var reader = new FileReader();
            reader.readAsDataURL(this.files);
            reader.onloadend = function (e) {
                var hasAttr = document.querySelector(inputId).hasAttribute('data-previw-img');
                if (Boolean(hasAttr) == true) {
                    var tempImg = document.querySelector(inputId).getAttribute('data-previw-img');
                    document.querySelector(tempImg).src = e.target.result;
                }
            }
            var extArr = this.allowedtype.split(",");
            for (var i = 0; i < extArr.length; i++) {
                this.acceptType.push(this.fileType + "/" + extArr[i]);
            }
        }
    }
    this.getValueByAttr = function () {
        var hasAllowedTypeAttr = element.hasAttribute('data-img-type');
        if (Boolean(hasAllowedTypeAttr) == true) {
            this.allowedtype = element.getAttribute('data-img-type');
        }
        var hasMaxSizeAttr = element.hasAttribute('data-max-size');
        if (Boolean(hasMaxSizeAttr) == true) {
            var msize = element.getAttribute('data-max-size');
            this.maxSize = parseInt(msize) * parseInt(1024);
        }
    }
    this.getValueByAttr();
    this.init(); // Call this init fucntion 


    this.validate = function () {
        //First size;
        if (this.size > this.maxSize) {
            this.error.size = "File size is too large.Allowed size are upto " + parseInt(this.maxSize) / parseInt(1024) + " KB. " + this.name + " size is " + Math.floor(parseInt(this.size) / parseInt(1024)) + " KB";
        }
        if (this.acceptType.indexOf(this.type) == -1) {
            this.error.type = "File type does not allowed.Allowed extension are " + this.allowedtype;
        }

    }
    //
    this.getErros = function () {
        return this.error;
    }
    this.hasError = function () {
        if (this.error.length > 0) {
            return 'true';
        } else {
            alert(this.error.length);
            return   'false';
        }

    }
}