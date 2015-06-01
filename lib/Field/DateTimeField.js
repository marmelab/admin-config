import DateField from "./DateField";

class DateTimeField extends DateField {
    constructor(name) {
        super(name);
        this._format = 'yyyy-MM-dd HH:mm:ss';
        this._parse = function(date) {
            return date;
        }
        this._type = 'datetime';
    }
}

export default DateTimeField;
