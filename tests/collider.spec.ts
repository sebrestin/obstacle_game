import { SimpleRectangleCollider, CollisionArea } from '../scripts/Physics';
import { Position } from '../scripts/Geometry';

describe("Test SimpleRectangleCollider behaviour", function() {
 
    // y axis
    it("Test dont collide when top edge = below edge", function() {
        let collisionArea1 = new CollisionArea(new Position(50, 50), 100, 100);
        let collisionArea2 = new CollisionArea(new Position(50, 150), 100, 100);
        let collider = new SimpleRectangleCollider(collisionArea1, collisionArea2);
        expect(collider.collide()).toBe(false);
    });

    it("Test dont collide top below edge < top edge", function() {
        let collisionArea1 = new CollisionArea(new Position(50, 50), 100, 100);
        let collisionArea2 = new CollisionArea(new Position(50, 150), 99, 99);
        let collider = new SimpleRectangleCollider(collisionArea1, collisionArea2);
        expect(collider.collide()).toBe(false);
    });

    it("Test collide when below edge > top edge", function() {
        let collisionArea1 = new CollisionArea(new Position(50, 50), 101, 101);
        let collisionArea2 = new CollisionArea(new Position(50, 150), 100, 100);
        let collider = new SimpleRectangleCollider(collisionArea1, collisionArea2);
        expect(collider.collide()).toBe(true);
    });

    // x axis
    it("Test dont collide when left edge = right edge", function() {
        let collisionArea1 = new CollisionArea(new Position(50, 50), 100, 100);
        let collisionArea2 = new CollisionArea(new Position(150, 50), 100, 100);
        let collider = new SimpleRectangleCollider(collisionArea1, collisionArea2);
        expect(collider.collide()).toBe(false);
    });

    it("Test dont collide top left edge < right edge", function() {
        let collisionArea1 = new CollisionArea(new Position(50, 50), 100, 100);
        let collisionArea2 = new CollisionArea(new Position(150, 50), 99, 99);
        let collider = new SimpleRectangleCollider(collisionArea1, collisionArea2);
        expect(collider.collide()).toBe(false);
    });

    it("Test collide when left edge > right edge", function() {
        let collisionArea1 = new CollisionArea(new Position(50, 50), 101, 101);
        let collisionArea2 = new CollisionArea(new Position(150, 50), 100, 100);
        let collider = new SimpleRectangleCollider(collisionArea1, collisionArea2);
        expect(collider.collide()).toBe(true);
    });

    // xy axis

    it("Test dont collide when bottom-right point = top-left point", function() {
        let collisionArea1 = new CollisionArea(new Position(150, 150), 100, 100);
        let collisionArea2 = new CollisionArea(new Position(50, 50), 100, 100);
        let collider = new SimpleRectangleCollider(collisionArea1, collisionArea2);
        expect(collider.collide()).toBe(false);
    });

    it("Test collide when bottom-right point > top-left point", function() {
        let collisionArea1 = new CollisionArea(new Position(150, 150), 100, 100);
        let collisionArea2 = new CollisionArea(new Position(50, 50), 101, 101);
        let collider = new SimpleRectangleCollider(collisionArea1, collisionArea2);
        expect(collider.collide()).toBe(true);
    });

    it("Test dont collide when bottom-right point < top-left point", function() {
        let collisionArea1 = new CollisionArea(new Position(150, 150), 99, 99);
        let collisionArea2 = new CollisionArea(new Position(50, 50), 100, 100);
        let collider = new SimpleRectangleCollider(collisionArea1, collisionArea2);
        expect(collider.collide()).toBe(false);
    });

    it("Test dont collide when bottom-left point = top-right point", function() {
        let collisionArea1 = new CollisionArea(new Position(150, 150), 100, 100);
        let collisionArea2 = new CollisionArea(new Position(250, 250), 100, 100);
        let collider = new SimpleRectangleCollider(collisionArea1, collisionArea2);
        expect(collider.collide()).toBe(false);
    });

    it("Test collide when bottom-left point > top-right point", function() {
        let collisionArea1 = new CollisionArea(new Position(150, 150), 101, 101);
        let collisionArea2 = new CollisionArea(new Position(250, 250), 100, 100);
        let collider = new SimpleRectangleCollider(collisionArea1, collisionArea2);
        expect(collider.collide()).toBe(true);
    });

    it("Test dont collide when bottom-left point < top-right point", function() {
        let collisionArea1 = new CollisionArea(new Position(150, 150), 99, 99);
        let collisionArea2 = new CollisionArea(new Position(250, 250), 100, 100);
        let collider = new SimpleRectangleCollider(collisionArea1, collisionArea2);
        expect(collider.collide()).toBe(false);
    });

});