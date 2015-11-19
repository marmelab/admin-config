const assert = require('chai').assert;

import {cloneAndFlatten, cloneAndNest} from '../../../lib/Utils/objectProperties';

describe('cloneAndFlatten()', () => {
    it('should not allow a non-object parameter', () =>
        assert.throws(() => cloneAndFlatten(2))
    );
    it('should return same values for flat objects', () =>
        assert.deepEqual(cloneAndFlatten({ foo: 1, bar: 'baz'}), { foo: 1, bar: 'baz'})
    );
    it('should copy null values', () =>
        assert.deepEqual(cloneAndFlatten({ foo: null }), { foo: null })
    );
    it('should clone the input', () => {
        let object = { foo: 1, bar: 'baz'};
        let flatObject = cloneAndFlatten(object);
        assert.notStrictEqual(flatObject, object);
        flatObject.foo = 2;
        assert.equal(object.foo, 1);
    });
    it('should flatten nested objects', () =>
        assert.deepEqual(cloneAndFlatten({ a: 1, b: { c: 2 }, d: { e: 3, f: { g: 4, h: 5 } } }),
                                         { a: 1, 'b.c': 2, 'd.e': 3, 'd.f.g': 4, 'd.f.h': 5 })
    );
    it('should not flatten arrays', () =>
        assert.deepEqual(cloneAndFlatten({ a: [1, 2, 3] }), { a: [1, 2, 3]})
    );
    it('should not flatten strings', () =>
        assert.deepEqual(cloneAndFlatten({ a: "hello, world" }), { a: "hello, world" })
    );
    it('should not flatten dates', () => {
        let d = new Date();
        assert.deepEqual(cloneAndFlatten({ a: d }), { a: d })
    });
    it('should not flatten excluded properties', () =>
        assert.deepEqual(cloneAndFlatten({ a: 1, b: { c: 2 }, d: { e: 3, f: { g: 4, h: 5 } } }, ['d']),
                                         { a: 1, 'b.c': 2, d: { e: 3, f: { g: 4, h: 5 } } })
    );
});

describe('cloneAndNest()', () => {
    it('should not allow a non-object parameter', () =>
        assert.throws(() => cloneAndNest(2))
    );
    it('should return same values for flat objects', () =>
        assert.deepEqual(cloneAndNest({ foo: 1, bar: 'baz'}), { foo: 1, bar: 'baz'})
    );
    it('should copy null values', () =>
        assert.deepEqual(cloneAndNest({ foo: null }), { foo: null })
    );
    it('should clone the input', () => {
        let object = { foo: 1, bar: 'baz'};
        let nestedObject = cloneAndNest(object);
        assert.notStrictEqual(nestedObject, object);
        nestedObject.foo = 2;
        assert.equal(object.foo, 1);
    });
    it('should nest flattened objects', () =>
        assert.deepEqual(cloneAndNest({ a: 1, 'b.c': 2, 'd.e': 3, 'd.f.g': 4, 'd.f.h': 5 }),
                                      { a: 1, b: { c: 2 }, d: { e: 3, f: { g: 4, h: 5 } } })
    );
    it('should not error on null nested objects', () =>
        assert.deepEqual(cloneAndNest({ a: null, 'a.b': null }),
                                      { a: null })
    );
});
