var assert = require('chai').assert;

import Dashboard from "../../lib/Dashboard";

describe('Dashboard', () => {
    describe('collections()', () => {
        it('should be an empty object by default', () => {
            assert.deepEqual(new Dashboard().collections(), {})
        });
    });
    describe('addCollection()', () => {
        it('should add a collection', () => {
            let dashboard = new Dashboard();
            const collection = { IAmAFakeCollection: true, name: () => 'foo' }; 
            dashboard.addCollection(collection);
            assert.deepEqual(dashboard.collections(), { foo: collection })
        });
    });
    describe('hasCollections()', () => {
        it('should return false for empty dashboards', () => {
            let dashboard = new Dashboard();
            assert.notOk(dashboard.hasCollections());
        });
        it('should return true for non-empty dashboards', () => {
            let dashboard = new Dashboard();
            dashboard.addCollection({ name: () => 'bar' });
            assert.ok(dashboard.hasCollections());
        });
    });
    describe('template()', () => {
        it('should return null by default', () => {
            let dashboard = new Dashboard();
            assert.isNull(dashboard.template());
        });
        it('should return the template when called with no argument', () => {
            let dashboard = new Dashboard();
            dashboard._template = 'foo';
            assert.equal('foo', dashboard.template());
        });
        it('should set the template when called with an argument', () => {
            let dashboard = new Dashboard();
            dashboard.template('foo');
            assert.equal('foo', dashboard.template());
        });
        it('should return the dashboard when called with an argument', () => {
            let dashboard = new Dashboard();
            assert.strictEqual(dashboard, dashboard.template('bar'));
        });
    });
});
