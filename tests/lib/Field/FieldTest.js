var assert = require('chai').assert;

import Entry from "../../../lib/Entry";
import Field from "../../../lib/Field/Field";

describe('Field', function() {
    describe('detailLink', function() {
        it('should be false if not specified', function() {
            var field = new Field('foo');
            assert.equal(false, field.isDetailLink());
        });

        it('should be true if not specified and if name is "id"', function() {
            var field = new Field('id');
            assert.equal(true, field.isDetailLink());
        });

        it('should return given value if already set, whatever name may be', function() {
            var field = new Field('id');
            field.detailLink = false;

            assert.equal(false, field.isDetailLink());
        });
    });

    describe('label', function() {
        it('should be based on name if non label has been provided', function() {
            var field = new Field('first_name');
            assert.equal('First Name', field.label());
        });

        it('should return the camelCased name by default', function () {
            assert.equal(new Field('myField').label(), 'MyField');
            assert.equal(new Field('my_field_1').label(), 'My Field 1');
            assert.equal(new Field('my-field-2').label(), 'My Field 2');
            assert.equal(new Field('my_field-3').label(), 'My Field 3');
        });

        it('should be given value if already provided', function() {
            var field = new Field('first_name').label('Prénom');
            assert.equal('Prénom', field.label());
        });
    });

    describe('getCssClasses', function() {
        var field;

        beforeEach(function() {
            field = new Field('title');
        });

        it('should return result of callback called with entry if function', function() {
            field.cssClasses(entry => entry.values.id % 2 ? "odd-entry" : "even-entry");

            var entry = new Entry('post', { id: 1 });
            assert.equal("odd-entry", field.getCssClasses(entry));

            entry = new Entry('post', { id: 2 });
            assert.equal("even-entry", field.getCssClasses(entry));
        });

        it('should concatenate all elements if array', function() {
            field.cssClasses(["important", "approved"]);
            assert.equal("important approved", field.getCssClasses());
        });

        it('should return passed classes if neither function nor array', function() {
            field.cssClasses("important approved");
            assert.equal("important approved", field.getCssClasses());
        });

        it('should return an empty string by default', function() {
            assert.equal(field.getCssClasses(), '');
        });

        it('should return an class string as set by cssClasses(string)', function() {
            field.cssClasses('foo bar');
            assert.equal(field.getCssClasses(), 'foo bar');
        });

        it('should return an class string as set by cssClasses(array)', function() {
            field.cssClasses(['foo', 'bar']);
            assert.equal(field.getCssClasses(), 'foo bar');
        });

        it('should return an class string as set by cssClasses(function)', function() {
            field.cssClasses(function() { return 'foo bar'; });
            assert.equal(field.getCssClasses(), 'foo bar');
        });

    });

    describe('validation()', function() {
        it('should have sensible defaults', function() {
            assert.deepEqual(new Field().validation(), {required: false, minlength : 0, maxlength : 99999});
        });

        it('should allow to override parts of the validation settings', function() {
            var field = new Field().validation({ required: true });
            assert.deepEqual(field.validation(), {required: true, minlength : 0, maxlength : 99999});
        });

        it('should allow to remove parts of the validation settings', function() {
            var field = new Field().validation({ minlength: null });
            assert.deepEqual(field.validation(), {required: false, maxlength : 99999});
        });
    });

    describe('map()', function() {
        it('should add a map function', function() {
            var fooFunc = function(a) { return a; }
            var field = new Field().map(fooFunc);
            assert.ok(field.hasMaps());
            assert.deepEqual(field.map(), [fooFunc]);
        });
        it('should allow multiple calls', function() {
            var fooFunc = function(a) { return a; }
            var barFunc = function(a) { return a + 1; }
            var field = new Field().map(fooFunc).map(barFunc);
            assert.deepEqual(field.map(), [fooFunc, barFunc]);
        });
    });

    describe('getMappedValue()', function() {
        it('should return the value argument if no maps', function() {
            var field = new Field();
            assert.equal(field.getMappedValue('foobar'), 'foobar');
        });
        it('should return the passed transformed by maps', function() {
            var field = new Field()
                .map(function add1(a) { return a + 1; })
                .map(function times2(a) { return a * 2; });
            assert.equal(field.getMappedValue(3), 8);
        });
    });

    describe('template()', function() {
        it('should accept string values', function () {
            var field = new Field().template('hello!');
            assert.equal(field.getTemplateValue(), 'hello!');
        });

        it('should accept function values', function () {
            var field = new Field().template(function () { return 'hello function !'; });
            assert.equal(field.getTemplateValue(), 'hello function !');
        });
    });

    describe('getTemplateValue()', function() {
        it('should return the template function executed with the supplied data', function() {
            var field = new Field().template(function (name) { return 'hello ' + name + ' !'; });
            assert.equal(field.getTemplateValue('John'), 'hello John !');
        });
    });
});
