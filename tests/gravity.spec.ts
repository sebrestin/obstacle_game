import { Gravity } from '../scripts/Physics';
import { Position } from '../scripts/Geometry';
import { StaticGameObject } from '../scripts/GameObjects';

describe('Test Gravity behaviour', function () {

    it('Test that object falls until it hits the ground', function () {
        let testObject = new StaticGameObject();
        testObject.position = new Position(0, 0);
        let gravity: Gravity = new Gravity([testObject]);

        let previous = testObject.position;
        gravity.apply();

        while (previous.y !== testObject.position.y) {
            previous = testObject.position;
            gravity.apply();
        }

        expect(testObject.position.y).toBe(gravity.ground.y);
    });

});