var assert = require('chai').assert;

import Entity from "../../../lib/Entity/Entity";
import MenuView from "../../../lib/View/MenuView";

describe('MenuView', function() {

    describe('disable()', () => {
        it('should be disabled by default', () => {
            const view = new MenuView();
            view.setEntity(new Entity('post'));
            assert.isFalse(view.enabled);
        });

        it('should be enabled if there\'s an enabled list view within the entity', () => {
            const entity = new Entity('post');
            entity.listView().enable();
            var view = new MenuView();
            view.setEntity(entity);
            assert.isTrue(view.enabled);
        });

        it('should be disabled if there\'s a disabled list view within the entity', () => {
            const entity = new Entity('post');
            entity.listView().disable();
            var view = new MenuView();
            view.setEntity(entity);
            assert.isFalse(view.enabled);
        });

        it('should be disabled if we disable it, even if there\'s an enabled list view within the entity', () => {
            const entity = new Entity('post');
            entity.listView().enable();
            var view = new MenuView()
            view.setEntity(entity);
            view.disable();
            assert.isFalse(view.enabled);
        });
    })

    describe('icon', function() {
        it('should default to list glyphicon', function() {
            var view = new MenuView(new Entity('post'));
            assert.equal('<span class="glyphicon glyphicon-list"></span>', view.icon());
        });

        it('should be given icon otherwise', function() {
            var view = new MenuView(new Entity('post')).icon('<span class="glyphicon glyphicon-globe"></span>');
            assert.equal('<span class="glyphicon glyphicon-globe"></span>', view.icon());
        });
    });
});
