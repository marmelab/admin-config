import Field from "./Field";

class JsonField extends Field {
    constructor(name) {
        super(name);
        this._type = "json";
        this._flattenable = false;
    }
}

export default JsonField;
