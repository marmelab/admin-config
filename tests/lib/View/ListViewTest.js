/* global describe,it */

var assert = require('chai').assert;

import Entity from '../../../lib/Entity/Entity';
import Field from '../../../lib/Field/Field';
import ReferenceField from '../../../lib/Field/ReferenceField';
import ReferenceManyField from '../../../lib/Field/ReferenceManyField';
import ListView from '../../../lib/View/ListView';

describe('ListView', function() {
    describe('getFilterReferences()', function() {
        it('should return only reference and reference_many fields', function() {
            var post = new Entity('post');
            var category = new ReferenceField('category');
            var tags = new ReferenceManyField('tags');
            var view = new ListView(post)
                .fields([
                    new Field('title'),
                    tags
                ])
                .filters([
                    category
                ]);

            assert.deepEqual({category: category}, view.getFilterReferences());
        });
    });

    describe('filters()', function() {
        it('should return ordered filters field without any field required validation', function() {
            var post = new Entity('post');
            var category = new ReferenceField('category');
            var title = (new Field('title')).validation({ required: true });
            var view = new ListView(post)
                .fields([
                    title
                ])
                .filters([
                    title.order(2),
                    category.order(1)
                ]);

            assert.deepEqual([ category, title ], view.filters());
            assert.equal(view.filters()[0].validation().required, false);
        });
    });
});
