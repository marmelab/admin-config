var assert = require('chai').assert;

import ReferenceExtractor from "../../../lib/Utils/ReferenceExtractor";

describe('ReferenceExtractor', () => {

    describe('getReferences', () => {
        it('should return an empty object of empty field array', () => {
            assert.deepEqual({}, ReferenceExtractor.getReferences([]));
        });

        it('should index by reference name', () => {
            const fields = [
                { type() { return 'reference' }, name() { return 'foo' } },
                { type() { return 'reference' }, name() { return 'bar' } }
            ];
            assert.deepEqual({
                foo: fields[0],
                bar: fields[1]
            }, ReferenceExtractor.getReferences(fields));
        })

        it('should filter out non-reference fields', () => {
            const fields = [
                { type() { return 'reference' }, name() { return 'foo' } },
                { type() { return 'reference_many' }, name() { return 'bar' } },
                { type() { return 'referenced_list' }, name() { return 'baz' } },
                { type() { return 'string' }, name() { return 'boo' } }
            ];
            assert.deepEqual({
                foo: fields[0],
                bar: fields[1]
            }, ReferenceExtractor.getReferences(fields));
        })

        it('should index reference fields in embedded_list', () => {
            const embedded_fields = [
                { type() { return 'reference' }, name() { return 'foo1' } },
                { type() { return 'reference_many' }, name() { return 'foo2' } },
                { type() { return 'referenced_list' }, name() { return 'foo3' } },
            ]
            const fields = [
                { type() { return 'embedded_list' }, name() { return 'foo' }, targetFields() { return embedded_fields } },
                { type() { return 'string' }, name() { return 'bar' } },
            ];
            assert.deepEqual({
                foo1: embedded_fields[0],
                foo2: embedded_fields[1],
            }, ReferenceExtractor.getReferences(fields));
        })
    })

    describe('getReferencedLists', () => {
        it('should return an empty object of empty field array', () => {
            assert.deepEqual({}, ReferenceExtractor.getReferencedLists([]));
        });

        it('should index by reference name', () => {
            const fields = [
                { type() { return 'referenced_list' }, name() { return 'foo' } },
                { type() { return 'referenced_list' }, name() { return 'bar' } }
            ];
            assert.deepEqual({
                foo: fields[0],
                bar: fields[1]
            }, ReferenceExtractor.getReferencedLists(fields));
        })

        it('should filter out non-referenced_list fields', () => {
            const fields = [
                { type() { return 'reference' }, name() { return 'foo' } },
                { type() { return 'reference_many' }, name() { return 'bar' } },
                { type() { return 'referenced_list' }, name() { return 'baz' } },
                { type() { return 'string' }, name() { return 'boo' } }
            ];
            assert.deepEqual({
                baz: fields[2]
            }, ReferenceExtractor.getReferencedLists(fields));
        })
    })

});
