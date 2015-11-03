/* global describe,it */

var assert = require('chai').assert;

import Entity from '../../../lib/Entity/Entity';
import Field from '../../../lib/Field/Field';
import ReferenceField from '../../../lib/Field/ReferenceField';
import ReferenceManyField from '../../../lib/Field/ReferenceManyField';
import ListView from '../../../lib/View/ListView';

describe('ListView', function() {
    describe('listActions()', function () {
        it('should return the view', function () {
            var view = new ListView();
            assert.equal(view.listActions(['edit']), view);
        });

        it('should store the listActions for the Datagrid', function () {
            var view = new ListView();
            assert.deepEqual(view.listActions(['edit']).listActions(), ['edit']);
        });
    });

    describe('map()', function () {
        it('should apply the function argument to all list values', function () {
            var list = new ListView('allCats');
            list
                .setEntity(new Entity('cats').identifier(new Field('id')))
                .addField(new Field('name').map(function (value) {
                    return value.substr(0, 5) + '...';
                }));

            var entries = list.mapEntries([
                { id: 1, human_id: 1, name: 'Suna'},
                { id: 2, human_id: 2, name: 'Boby'},
                { id: 3, human_id: 1, name: 'Mizute'}
            ]);

            assert.equal(entries[0].values.id, 1);
            assert.equal(entries[0].values.name, 'Suna...');
            assert.equal(entries[2].values.id, 3);
            assert.equal(entries[2].values.name, 'Mizut...');
        });
    });

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

        it('should return only filter reference with refresh complete if withRemoteComplete is true', function() {
            var post = new Entity('post');
            var category = new ReferenceField('category').remoteComplete(true);
            var tags = new ReferenceManyField('tags').remoteComplete(false);

            var view = new ListView(post)
                .fields([
                    new Field('title'),
                    tags
                ])
                .filters([
                    category
                ]);

            assert.deepEqual({category: category}, view.getFilterReferences(true));
        });

        it('should return only filter reference with no remote complete if withRemoteComplete is set to false', function() {
            var post = new Entity('post');
            var category = new ReferenceField('category').remoteComplete(true);
            var tags = new ReferenceManyField('tags').remoteComplete(false);
            var view = new ListView(post)
                .fields([
                    new Field('title'),
                    tags
                ])
                .filters([
                    category
                ]);

            assert.deepEqual({ tags: tags }, view.getReferences(false));
        });
    });
});
