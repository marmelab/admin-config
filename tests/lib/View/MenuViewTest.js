var assert = require('chai').assert;

import Entity from "../../../lib/Entity/Entity";
import MenuView from "../../../lib/View/MenuView";

describe('MenuView', function() {
    describe('enabled', function() {
        var entity, menuView;
        beforeEach(function() {
            entity = new Entity('post');
            entity.listView().enable();

            menuView = entity.menuView().enable();
        });

        it('should be considered as enable if enabled AND if related list view is enabled', function() {
            assert.equal(menuView.enabled, true);
        });

        it('should not be enabled if no related list view is enabled', function() {
            entity.listView().disable();
            assert.equal(menuView.enabled, false);
        });

        it('should not be enabled if disabled', function() {
            menuView.disable();
            assert.equal(menuView.enabled, false);
        });
    });

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
