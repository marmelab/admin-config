var assert = require('chai').assert;

import ReferenceExtractor from "../../../lib/Utils/ReferenceExtractor";

import ReferenceField from "../../../lib/Field/ReferenceField";
import ReferenceManyField from "../../../lib/Field/ReferenceManyField";
import ReferencedListField from "../../../lib/Field/ReferencedListField";
import Field from "../../../lib/Field/Field";

class CustomReferenceField extends ReferenceField {
    constructor(name) {
        super(name);
        this._type = 'custom_reference';
    }
}

class CustomReferenceManyField extends ReferenceManyField {
    constructor(name) {
        super(name);
        this._type = 'custom_reference_many';
    }
}

class CustomReferencedListField extends ReferencedListField {
    constructor(name) {
        super(name);
        this._type = 'custom_referenced_list';
    }
}



describe('ReferenceExtractor', () => {

    describe('getReferences', () => {
        it('should return an empty object of empty field array', () => {
            assert.deepEqual({}, ReferenceExtractor.getReferences([]));
        });

        it('should index by reference name', () => {
            const fields = [
                new ReferenceField('foo'),
                new ReferenceField('bar')
            ];
            assert.deepEqual({
                foo: fields[0],
                bar: fields[1]
            }, ReferenceExtractor.getReferences(fields));
        })

        it('should filter out non-reference fields', () => {
            const fields = [
                new ReferenceField('foo'),
                new ReferenceManyField('bar'),
                new ReferencedListField('baz'),
                new Field('boo'),
		new CustomReferenceField('cfoo'),
                new CustomReferenceManyField('cbar'),
                new CustomReferencedListField('cbaz'),
            ];
            assert.deepEqual({
                foo: fields[0],
                bar: fields[1],
		cfoo: fields[4],
		cbar: fields[5]
            }, ReferenceExtractor.getReferences(fields));
        })
    })

    describe('getReferencedLists', () => {
        it('should return an empty object of empty field array', () => {
            assert.deepEqual({}, ReferenceExtractor.getReferencedLists([]));
        });

        it('should index by reference name', () => {
            const fields = [
                new ReferencedListField('foo'),
                new ReferencedListField('bar'),
		new CustomReferencedListField('baz'),
		new CustomReferencedListField('boo')
            ];
            assert.deepEqual({
                foo: fields[0],
                bar: fields[1],
		baz: fields[2],
		boo: fields[3],
            }, ReferenceExtractor.getReferencedLists(fields));
        })

        it('should filter out non-referenced_list fields', () => {
            const fields = [
                new ReferenceField('foo'),
                new ReferenceManyField('bar'),
                new ReferencedListField('baz'),
                new Field('boo'),
		new CustomReferenceField('cfoo'),
                new CustomReferenceManyField('cbar'),
                new CustomReferencedListField('cbaz'),
            ];
            assert.deepEqual({
                baz: fields[2],
		cbaz: fields[6]
            }, ReferenceExtractor.getReferencedLists(fields));
        })
    })

});
