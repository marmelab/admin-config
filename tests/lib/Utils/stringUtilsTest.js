const assert = require('chai').assert;

import {camelCase} from '../../../lib/Utils/stringUtils';

describe('StringUtils', () => {
    describe('camelCase()', () => {
        it('should not change an already camel-cased string', () => assert.equal(camelCase('Foo'), 'Foo'));
        it('should not change an uppercase string', () => assert.equal(camelCase('FOO'), 'FOO'));
        it('should camel-case a lowercase string', () => assert.equal(camelCase('foo'), 'Foo'));
        it('should camel-case all words string', () => assert.equal(camelCase('foo bar'), 'Foo Bar'));
        it('should camel-case all sub strings', () => assert.equal(camelCase('foo_bar-baz.foo'), 'Foo Bar Baz Foo'));
    });
});
