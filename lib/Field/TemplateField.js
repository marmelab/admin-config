import Field from "./Field";

class TemplateField extends Field {
    constructor(name) {
        super(name);
        this._type = "template";
        this._flattenable = false;
    }
}

export default TemplateField;
