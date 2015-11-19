var assert = require('chai').assert;

import Entity from "../../lib/Entity/Entity";
import Entry from "../../lib/Entry";
import Field from "../../lib/Field/Field";
import ReferenceManyField from "../../lib/Field/ReferenceManyField";
import JsonField from "../../lib/Field/JsonField";

describe('Entry', function() {

    describe('createFromRest()', function() {

        it('should return an entry with no value if REST entry is empty and fields is empty', function() {
            var mappedEntry = Entry.createFromRest({}, []);
            assert.deepEqual({}, mappedEntry.values);
        });

        it('should return an entry with default values if REST entry is empty', function() {
            var fields = [
                new Field('id'),
                new Field('title').defaultValue('The best title'),
                new Field('author.name'),
                new ReferenceManyField('tags'),
                new JsonField('address').defaultValue({ number: null, street: null, city: null })
            ];
            var mappedEntry = Entry.createFromRest({}, fields);
            assert.deepEqual({
                id: null,
                title: 'The best title',
                'author.name': null,
                tags: null,
                address: { number: null, street: null, city: null }
            }, mappedEntry.values);
        });

        it('should map each value to related field if existing', () => {
            var mappedEntry = Entry.createFromRest({
                id: 1,
                title: 'ng-admin + ES6 = pure awesomeness!',
                body: 'Really, it rocks!',
                tags: [1, 2, 4]
            });

            assert.deepEqual({
                id: 1,
                title: 'ng-admin + ES6 = pure awesomeness!',
                body: 'Really, it rocks!',
                tags: [1, 2, 4]
            }, mappedEntry.values);
        });

        it('should map even if the value is absent', () => {
            var fields = [new Field('foo').map((v,e) => e.tags.join(' '))];
            var mappedEntry = Entry.createFromRest({
                tags: [1, 2, 3, 4]
            }, fields);
            assert.deepEqual({
                foo: '1 2 3 4',
                tags: [1, 2, 3, 4]
            }, mappedEntry.values)
        });

        it('should set as identifierValue value for identifier field', () => {
            var mappedEntry = Entry.createFromRest({ id: 1 });
            assert.equal(1, mappedEntry.identifierValue);
        });

        it('should set as identifierValue value using identifier field name', () => {
            var mappedEntry = Entry.createFromRest({ id: 1, foo: 2 }, [], '', 'foo');
            assert.equal(2, mappedEntry.identifierValue);
        });

        it('should flatten nested entries', () => {
            var mappedEntry = Entry.createFromRest({
                id: 1,
                title: 'ng-admin + ES6 = pure awesomeness!',
                author: { name: 'John Doe' }
            });

            assert.deepEqual({
                id: 1,
                title: 'ng-admin + ES6 = pure awesomeness!',
                'author.name': 'John Doe'
            }, mappedEntry.values);
        });

        it('should not flatten nested entries mapped by a not flattenable field', () => {
            var mappedEntry = Entry.createFromRest({
                id: 1,
                title: 'ng-admin + ES6 = pure awesomeness!',
                address: { number: 21, street: 'JumpStreet', city: 'Vancouver' } // mapped as JSON field => not flattenable
            }, [new JsonField('address')]);

            assert.deepEqual({
                id: 1,
                title: 'ng-admin + ES6 = pure awesomeness!',
                address: { number: 21, street: 'JumpStreet', city: 'Vancouver' }
            }, mappedEntry.values);
        });

        it('should apply map() functions from fields', () => {
            var mappedEntry = Entry.createFromRest({
                id: 1,
                title: 'ng-admin + ES6 = pure awesomeness!'
            }, [new Field('title').map(s => s.toUpperCase())]);
            assert.deepEqual({
                id: 1,
                title: 'NG-ADMIN + ES6 = PURE AWESOMENESS!'
            }, mappedEntry.values);
        })
    });

    describe('transformToRest()', function() {
        it('should provide both the value and entry when invoking the callback', () => {
            var field = new Field('foo');
            field.defaultValue(2);

            var entry = Entry.createForFields([field]);

            field.transform((value, entry) => {
                assert.equal(value, 2);
                assert.deepEqual(entry, {foo: 2});
            });

            entry.transformToRest([field]);
        });
    });
});
