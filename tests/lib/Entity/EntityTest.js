var assert = require('chai').assert;

import Entity from '../../../lib/Entity/Entity';
import Field from '../../../lib/Field/Field';

describe('Entity', function() {
    describe('views', function() {
        it('should create all views when creating new entity', function() {
            var entity = new Entity('post');
            assert.deepEqual([
                'DashboardView',
                'MenuView',
                'ListView',
                'CreateView',
                'EditView',
                'DeleteView',
                'BatchDeleteView',
                'ExportView',
                'ShowView'
            ], Object.keys(entity.views));
        });
    });

    describe('label', function() {
        it('should return given label if already set', function() {
            var post = new Entity('post').label('Article');
            assert.equal('Article', post.label());
        });

        it('should return entity name if no label has been set', function() {
            var post = new Entity('post');
            assert.equal('Post', post.label());
        });
    });

    describe('readOnly()', function() {
        var entity;

        beforeEach(function() {
            entity = new Entity('post');
        });

        it('should not be read-only by default', function() {
            assert.equal(false, entity.isReadOnly);
        });

        it('should set read-only attribute', function() {
            entity.readOnly();
            assert.equal(true, entity.isReadOnly);
        });

        it('should disable all edition views', function() {
            entity.readOnly();
            entity.views.ListView.enable();
            entity.views.DashboardView.enable();

            assert.equal(true, entity.menuView().enabled);
            assert.equal(true, entity.dashboardView().enabled);
            assert.equal(true, entity.listView().enabled);
            assert.equal(false, entity.creationView().enabled);
            assert.equal(false, entity.editionView().enabled);
            assert.equal(false, entity.deletionView().enabled);
        });
    });
    
    describe('createMethod', function() {
        it('should return given createMethod if already set', function() {
            var post = new Entity('post').createMethod('put');
            assert.equal('put', post.createMethod());
        });

        it('should return null if no createMethod has been set', function() {
            var post = new Entity('post');
            assert.equal(null, post.createMethod());
        });
    });
    
    describe('updateMethod', function() {
        it('should return given updateMethod if already set', function() {
            var post = new Entity('post').updateMethod('post');
            assert.equal('post', post.updateMethod());
        });

        it('should return null if no updateMethod has been set', function() {
            var post = new Entity('post');
            assert.equal(null, post.updateMethod());
        });
    });

    describe('retrieveMethod', function() {
        it('should return given retrieveMethod if already set', function() {
            var post = new Entity('post').retrieveMethod('post');
            assert.equal('post', post.retrieveMethod());
        });

        it('should return null if no retrieveMethod has been set', function() {
            var post = new Entity('post');
            assert.equal(null, post.retrieveMethod());
        });
    });

    describe('deleteMethod', function() {
        it('should return given deleteMethod if already set', function() {
            var post = new Entity('post').deleteMethod('post');
            assert.equal('post', post.deleteMethod());
        });

        it('should return null if no deleteMethod has been set', function() {
            var post = new Entity('post');
            assert.equal(null, post.deleteMethod());
        });
    });

    describe('identifier', function() {
        it('should set default identifier', function() {
            var post = new Entity('post');
            assert.equal('id', post.identifier().name());
        });

        it('should set custom identifier', function() {
            var post = new Entity('post').identifier(new Field('my_id'));
            assert.equal('my_id', post.identifier().name());
        });

        it('should throw error on wrong argument', function() {
            assert.throw(function () { new Entity('post').identifier('my_id'); }, Error, 'Entity post: identifier must be an instance of Field');
        });
    });
});
