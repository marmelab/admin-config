var assert = require('chai').assert;

import Entity from "../../../lib/Entity/Entity";
import Entry from "../../../lib/Entry";
import Field from "../../../lib/Field/Field";
import ReferenceField from "../../../lib/Field/ReferenceField";
import ReferenceManyField from "../../../lib/Field/ReferenceManyField";
import View from "../../../lib/View/View";
import ListView from "../../../lib/View/ListView";

describe('View', function() {
    describe('name()', function() {
        it('should return a default name based on the entity name and view type', function() {
            var view = new ListView().setEntity(new Entity('foobar'));
            assert.equal(view.name(), 'foobar_ListView');
        });
    });

    describe('title()', function() {
        it('should return false by default', function () {
            var view = new ListView(new Entity('foobar'));
            assert.isFalse(view.title());
        });

        it('should return the view title', function () {
            var view = new View(new Entity('foobar')).title('my-title');
            assert.equal(view.title(), 'my-title');
        });
    });

    describe('description()', function() {
        it('should return empty string by default', function () {
            var view = new View(new Entity('foobar'));
            assert.equal(view.description(), '');
        });

        it('should return the view description', function () {
            var view = new View(new Entity('foobar')).description('my description');
            assert.equal(view.description(), 'my description');
        });
    });

    describe('getReferences()', function() {
        it('should return only reference and reference_many fields', function() {
            var post = new Entity('post');
            var category = new ReferenceField('category');
            var tags = new ReferenceManyField('tags');
            var view = new View(post).fields([
                new Field('title'),
                category,
                tags
            ]);

            assert.deepEqual({category: category, tags: tags}, view.getReferences());
        });

        it('should return only reference with remote complete if withRemoteComplete is true', function() {
            var post = new Entity('post');
            var category = new ReferenceField('category').remoteComplete(true);
            var tags = new ReferenceManyField('tags').remoteComplete(false);
            var view = new View(post).fields([
                new Field('title'),
                category,
                tags
            ]);

            assert.deepEqual({ category: category }, view.getReferences(true));
        });

        it('should return only reference with no remote complete if withRemoteComplete is false', function() {
            var post = new Entity('post');
            var category = new ReferenceField('category').remoteComplete(true);
            var tags = new ReferenceManyField('tags').remoteComplete(false);
            var view = new View(post).fields([
                new Field('title'),
                category,
                tags
            ]);

            assert.deepEqual({ tags: tags }, view.getReferences(false));
        });
    });

    describe('addField()', function() {
        it('should add fields and preserve the order', function () {
            var post = new Entity('post');
            var view = new View(post);
            var refMany = new ReferenceManyField('refMany');
            var ref = new ReferenceField('myRef');

            var field = new Field('body');
            view.addField(ref).addField(refMany).addField(field);

            assert.equal(view.getFieldsOfType('reference_many')[0].name(), 'refMany');
            assert.equal(view.getReferences()['myRef'].name(), 'myRef');
            assert.equal(view.getReferences()['refMany'].name(), 'refMany');
            assert.equal(view.getFields()[2].name(), 'body');
        });
    });

    describe('fields()', function() {
        it('should return the fields when called with no arguments', function() {
            var view = new View(new Entity('post'));
            var field = new Field('body');
            view.addField(field);

            assert.deepEqual(view.fields(), [field]);
        });

        it('should add fields when called with an array argument', function() {
            var view = new View(new Entity('post'));
            var field1 = new Field('foo');
            var field2 = new Field('bar');
            view.fields([field1, field2]);

            assert.deepEqual(view.fields(), [field1, field2]);
        });

        it('should keep the default order of the given array to equal to the index even when more than 10 fields', function() {
            var view = new View(new Entity('post'));
            var fields = Array.from(new Array(11).keys()).map(function (i) {
                return new Field(i);
            });
            view.fields(fields);

            assert.deepEqual(view.fields(), fields);

            fields.map(function (field, index) {
                assert.equal(field.order(), index);
            });
        });

        it('should add fields when called with a nested array argument', function() {
            var view = new View(new Entity('post'));
            var field1 = new Field('foo');
            var field2 = new Field('bar');
            view.fields([field1, [field2]]);

            assert.deepEqual(view.fields(), [field1, field2]);
        });

        it('should add a single field when called with a non array argument', function() {
            var view = new View(new Entity('post'));
            var field1 = new Field('foo');
            view.fields(field1);

            assert.deepEqual(view.fields(), [field1]);
        });

        it('should add fields when called with several arguments', function() {
            var view = new View(new Entity('post'));
            var field1 = new Field('foo');
            var field2 = new Field('bar');
            view.fields(field1, field2);

            assert.deepEqual(view.fields(), [field1, field2]);
        });

        it('should add field collections', function() {
            var view1 = new View(new Entity('post'));
            var view2 = new View(new Entity('category'));
            var field1 = new Field('foo');
            var field2 = new Field('bar');
            view1.fields(field1, field2);
            view2.fields(view1.fields());

            assert.deepEqual(view2.fields(), [field1, field2]);
        });

        it('should allow fields reuse', function() {
            var field1 = new Field('foo'), field2 = new Field('bar');
            var view1 = new View().addField(field1);
            var view2 = new View().fields([
                view1.fields(),
                field2
            ]);

            assert.deepEqual(view2.fields(), [field1, field2]);
        });

        it('should append fields when multiple calls', function() {
            var view = new View();
            var field1 = new Field('foo'), field2 = new Field('bar');
            view
                .fields(field1)
                .fields(field2);

            assert.deepEqual(view.fields(), [field1, field2]);
        });
    });

    describe("validate()", function () {
        it('should call validator on each fields.', function () {
            var entry = new Entry(),
                view = new View('myView'),
                field1 = new Field('notValidable').label('Complex'),
                field2 = new Field('simple').label('Simple');

            entry.values = {
                notValidable: false,
                simple: 1
            };

            view.addField(field1).addField(field2);

            field1.validation().validator = function () {
                throw new Error('Field "Complex" is not valid.');
            };
            field2.validation().validator = function () {
                return true;
            };

            assert.throw(function () { view.validate(entry); }, Error, 'Field "Complex" is not valid.');
        });

        it('should call validator with the targeted field as first parameter', function (done) {
            var entry = new Entry(),
                view = new View('myView'),
                field1 = new Field('field1').label('field1');

            entry.values = {
                field1: "field1_value",
            };

            view.addField(field1);

            field1.validation().validator = function (value) {
                assert.equal("field1_value", value);
                done();
            };

            view.validate(entry);
        });

        it('should call validator with the all other fields as second parameter', function (done) {
            var entry = new Entry(),
                view = new View('myView'),
                field1 = new Field('field1').label('field1'),
                field2 = new Field('field2').label('field2');

            entry.values = {
                field1: "field1_value",
                field2: "field2_value",
            };

            view.addField(field1).addField(field2);

            field1.validation().validator = function (value, all) {
                assert.deepEqual({
                    field1: "field1_value",
                    field2: "field2_value",
                }, all);
                done();
            };

            view.validate(entry);
        });
    });

    describe('mapEntry()', () => {

        it('should return an entry', () => {
            let view = new View();
            view.setEntity(new Entity().name('Foo'));
            assert.instanceOf(view.mapEntry(), Entry);
            assert.equal(view.mapEntry().entityName, 'Foo');
        });

        it('should return an empty entry when passed an empty object', () => {
            let view = new View();
            view.setEntity(new Entity().name('Foo'));
            assert.deepEqual(view.mapEntry({}).values, {});
        });

        it('should use default values when passed an empty object', () => {
            let view = new View();
            view.setEntity(new Entity().name('Foo'));
            view.fields([
                new Field('foo').defaultValue('bar')
            ]);
            assert.equal(view.mapEntry({}).values.foo, 'bar');
        });

        it('should not use default values when passed a non-empty object', () => {
            let view = new View();
            view.setEntity(new Entity().name('Foo'));
            view.fields([
                new Field('foo').defaultValue('bar')
            ]);
            assert.notEqual(view.mapEntry({ hello: 1 }).values.foo, 'bar');
        });

        it('should populate the entry based on the values passed as argument', () => {
            let view = new View();
            view.setEntity(new Entity().name('Foo'));
            let entry = view.mapEntry({ hello: 1, world: 2 });
            assert.equal(entry.values.hello, 1);
            assert.equal(entry.values.world, 2);
        });

        it('should set the entry identifier value by default', () => {
            let view = new View();
            view.setEntity(new Entity().name('Foo'));
            assert.equal(view.mapEntry({ id: 1, bar: 2 }).identifierValue, 1);
        });

        it('should set the entry identifier value according to the fields', () => {
            let view = new View();
            view.setEntity(new Entity().name('Foo').identifier(new Field('bar')));
            assert.equal(view.mapEntry({ id: 1, bar: 2 }).identifierValue, 2);
        });

        it('should transform the object values using the fields map functions', () => {
            let view = new View();
            view.setEntity(new Entity().name('Foo'));
            view.fields([
                new Field('foo').map(v => v - 1)
            ]);
            assert.equal(view.mapEntry({ foo: 2 }).values.foo, 1);
        })
    });

    describe('mapEntries()', () => {
        it('should return entries based on an array of objects', function () {
            let view = new View();
            view
                .addField(new Field('title'))
                .setEntity(new Entity().identifier(new Field('post_id')));

            let entries = view.mapEntries([
                { post_id: 1, title: 'Hello', published: true},
                { post_id: 2, title: 'World', published: false},
                { post_id: 3, title: 'How to use ng-admin', published: false}
            ]);

            assert.equal(entries.length, 3);
            assert.equal(entries[0].identifierValue, 1);
            assert.equal(entries[1].values.title, 'World');
            assert.equal(entries[1].values.published, false);
        });
    });

    describe('transformEntry()', () => {

        it('should return an empty object for empty entries', () => {
            let view = new View();
            let entry = new Entry();
            assert.deepEqual(view.transformEntry(entry), {});
        });

        it('should return an object litteral based on the entry values', () => {
            let view = new View();
            let entry = new Entry('foo', { id: 1, bar: 2 }, 1);
            assert.deepEqual(view.transformEntry(entry), { id: 1, bar: 2 });
        });

        it('should transform the entry values using the fields transform functions', () => {
            let view = new View();
            view.setEntity(new Entity().name('Foo'));
            view.fields([
                new Field('bar').transform(v => v - 1)
            ]);
            let entry = new Entry('foo', { id: 1, bar: 2 }, 1);
            assert.deepEqual(view.transformEntry(entry), { id: 1, bar: 1 });

        });
    });

    describe('identifier()', function() {
        it('should return the identifier.', function () {
            var entity = new Entity('post').identifier(new Field('post_id'));
            var view = entity.listView();
            view.addField(new Field('name'));

            assert.equal(view.identifier().name(), 'post_id');
        });
    });
});
