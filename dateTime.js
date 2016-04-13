
var dateTime = {
    _date: new Date(), //Primary date which is Date Object or a string.
    _format: '', // Format e.g yyy-mm-dd
    _diffInMs: 0, //Difference in Miliseconds
    _timezone: '',
    _from_date: '',
    _minuteAhead: 15,
    set: function (date) {
        this._date = this.initDate(date);
        return this;
    },
    get: function () {
        return this._date;
    },
    ahead: function (number, type) {
        var mtype = typeof type !== 'undefined' ? type : 'minute';
        var newFDate = this.modify(Math.abs(number), mtype, new Date());
        this.set(newFDate);
        return this;
    },
    behind: function (number, type) {
        var mtype = typeof type !== 'undefined' ? type : 'minute';
        var newFDate = this.modify(-Math.abs(number), type, new Date());
        this.set(newFDate);

    },
    from: function (date) {
        this._from_date = this.initDate(date);
        return this;
    },
    initDate: function (date) {
        var retDate = 0;
        if (date instanceof Date) {
            retDate = date;
        } else {
            retDate = new Date(date);
        }
        return retDate;
    },
    /**
     * Add day,month etc to current date
     * @param time number Number to add
     * @param string type either year,month,day,hour,minute,second
     * @returns 
     */
    add: function (number, type) {
        this.modify(Math.abs(number), type);
        return this;
    },
    /**
     * Substract day,month etc to current date
     * @param time number Number to add
     * @param string type either year,month,day,hour,minute,second
     * @returns 
     */
    substract: function (number, type) {
        this.modify(-Math.abs(number), type);
        return this;
    },
    /**
     * Internal function for substraction and addition operation of time
     */
    modify: function (number, type, date) {
        var date = typeof date !== 'undefined' ? date : this._date;
        switch (type) {
            case 'year':
                var exYear = date.getFullYear();
                date.setYear(parseInt(exYear) + parseInt(number))
                break;
            case 'month':
                var exMonth = date.getMonth();
                date.setMonth(parseInt(exMonth) + parseInt(number))
                break;
            case 'day':
                var exDay = date.getDate(); //get the existing day e.g it may be may 8. Now we will add two days so we need get 8 and add 2 then set date to 10.
                date.setDate(parseInt(exDay) + parseInt(number))
                break;
            case 'hour':
                var exHour = date.getHours(); //get the existing day e.g it may be may 8:18:12 AM. Now we will add 2 hours  so we need get 8 hours and add 2 then hours will 10.
                date.setHours(parseInt(exHour) + parseInt(number))
                break;
            case 'minute':
                var exMin = date.getMinutes(); //get the existing day e.g it may be may 8:18:12 AM. Now we will add two days so we need get 18 and add 2 then set date to 20.
                date.setMinutes(parseInt(exMin) + parseInt(number))
                break;
            case 'second':
                var exMin = date.getSeconds(); //get the existing day e.g it may be may 8:18:12 AM. Now we will add two days so we need get 18 and add 2 then set date to 20.
                date.setHours(parseInt(exMin) + parseInt(number))
                break;
        }
        return date;
    },
    difference: function () {
        return this._diffInMs = parseInt(this._from_date.getTime()) - parseInt(this._date.getTime());
    },
    utcDiff: function () {
        return this._diffInMs = parseInt(Date.parse(this._from_date.toISOString())) - parseInt(Date.parse(this._date.toISOString()));
    },
    getDiffObj: function () {
        if (this._timezone == 'UTC') {
            var msc = this.utcDiff();
        } else {
            var msc = this.difference();
        }
        var op = '';
        if (msc < 0) {
            op = '-';
            msc = Math.abs(msc);
        }
        var retObj = {
            day: 0,
            hour: 0,
            minute: 0,
            second: 0,
            ms: 0
        };
        var oneSecond = 1000;
        var oneMinute = parseInt(oneSecond) * parseInt(60);
        var oneHour = parseInt(oneMinute) * parseInt(60);
        var oneDay = parseInt(oneHour) * parseInt(24);

        if (msc > oneDay) {
            var days = parseInt(msc) / parseInt(oneDay);
            retObj.day = Math.floor(days);
            var totalDaySec = parseInt(retObj.day) * parseInt(oneDay);
            msc = parseInt(msc) - parseInt(totalDaySec);
            retObj.day = parseInt(op + retObj.day);
        }
        if (msc > oneHour) {
            var hours = parseInt(msc) / parseInt(oneHour);
            retObj.hour = Math.floor(hours);

            var totalHourSec = parseInt(retObj.hour) * parseInt(oneHour);
            msc = parseInt(msc) - parseInt(totalHourSec);
            retObj.hour = parseInt(op + retObj.hour);
        }
        if (msc > oneMinute) {
            var minutes = parseInt(msc) / parseInt(oneMinute);
            retObj.minute = Math.floor(minutes);

            var totalMinuteSec = parseInt(retObj.minute) * parseInt(oneMinute);
            msc = parseInt(msc) - parseInt(totalMinuteSec);
            retObj.minute = parseInt(op + retObj.minute);

        }
        if (msc > oneSecond) {
            var seconds = parseInt(msc) / parseInt(oneSecond);
            retObj.second = Math.floor(seconds);

            var totalSecond = parseInt(retObj.second) * parseInt(oneSecond);
            msc = parseInt(msc) - parseInt(totalSecond);
        }
        retObj.ms = msc;

        return retObj;
    },
    getDiffString: function () {
        var diffObj = this.getDiffObj();
    },
    /**
     * 
     * @param string format Angualar native time format string
     * 'yyyy': 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
     * 'yy': 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
     * 'MMMM': Month in year (January-December)
     * 'MMM': Month in year (Jan-Dec)
     * 'MM': Month in year, padded (01-12)
     * 
     * 'dd': Day in month, padded (01-31)
     * 'HH': Hour in day, padded (00-23)
     * 'hh': Hour in AM/PM, padded (01-12)
     * 'mm': Minute in hour, padded (00-59)
     * 'ss': Second in minute, padded (00-59)
     * 'a': AM/PM marker
     * 'Z': 4 digit (+sign) representation of the timezone offset (-1200-+1200)
     
     
     and +more...   https://docs.angularjs.org/api/ng/filter/date
     * @returns {unresolved}
     */
    format: function (format, date) {
        var retDateStr = '';
        var showFormat = typeof format !== 'undefined' ? format : this._format;
        var fdate = typeof date !== 'undefined' ? date : this._date;

        var year = fdate.getFullYear();
        var month = fdate.getMonth() + 1;

        var day = fdate.getDate();
        var minutes = fdate.getMinutes();
        var seconds = fdate.getSeconds();
        var timeZoneOffset = fdate.getTimezoneOffset();

        switch (format) {
            case 'usa':
                retDateStr = month + '/' + day + '/' + year;

                break;
            case 'british':
                retDateStr = day + '-' + month + '-' + year;

                break;
            case 'system':
                retDateStr = year + '-' + month + '-' + day;
                break;
            default :
                retDateStr = fdate.toString();
                break;
        }
        return retDateStr;

        //  return  $filter('date')(fdate, showFormat)
    },
    /**
     * This function will convert _date to UTC Time
     */
    toUTC: function () {
        this._date = this.converUTC();
        return this;
    },
    //This is not working properly
    converUTC: function (date) {
        var date = typeof date !== 'undefined' ? date : this._date;
        var utcDate = new Date(Date.parse(date.toISOString()));
        return utcDate;
    }
}
