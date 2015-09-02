import ReferencedListField from "./ReferencedListField";
import Entry from "../Entry";

class NestedReferencedListField extends ReferencedListField {
    constructor(name) {
        super(name);
        this._type = 'nested_referenced_list';
        var field = this;
        this.map(function(values, entry){
            var targetEntity = field.targetEntity();
            var id = targetEntity.identifier().name();
            targetEntity = targetEntity.name();
            for (var i = 0; i < values.length; i++) {
                var value = values[i]
                values[i] = new Entry(targetEntity, value, value[id]);
            }
            return values;
        });
    }

    entries(parent) {
        var values = parent.values[this.name()];
        var identifier = this.targetEntity().identifier().name();

        for (var i = 0 ; i < values.length; i++) {
            values[i].identifierValue = values[i][identifier];
        }
        return values;
    }
}

export default NestedReferencedListField;
