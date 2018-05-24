import { Position } from './Geometry';
import { GameObject } from './GameObjects';

export interface Rigid {
    getCollisionArea(): CollisionArea;
}

export class CollisionArea {
    constructor(private center: Position, private width: number, private height: number) { }

    topLeft(): Position {
        return new Position(this.center.x - this.width / 2, this.center.y - this.height / 2);
    }

    topRight(): Position {
        return new Position(this.center.x + this.width / 2, this.center.y - this.height / 2);
    }
    bottomLeft(): Position {
        return new Position(this.center.x - this.width / 2, this.center.y + this.height / 2);
    }
    bottomRight(): Position {
        return new Position(this.center.x + this.width / 2, this.center.y + this.height / 2);
    }
}

export interface Collider {
    collide(): boolean;
}

export class SimpleRectangleCollider implements Collider {
    // This works when rectagles have no rotation

    constructor(private object1: CollisionArea, private object2: CollisionArea) { }

    collide() {
        let yDist = Math.min(this.object1.bottomLeft().y, this.object2.bottomLeft().y) - Math.max(this.object1.topLeft().y, this.object2.topLeft().y);
        let xDist = Math.min(this.object1.topRight().x, this.object2.topRight().x) - Math.max(this.object1.topLeft().x, this.object2.topLeft().x);
        return yDist > 0 && xDist > 0;
    }

}

export class Gravity {
    speed: number = 1;
    ground: Position = new Position(0, 300);
    constructor(private objects: Array<GameObject>) { }

    apply(): void {
        for (let object of this.objects) {
            if (object.position.y + this.speed <= this.ground.y) {
                let target = new Position(object.position.x, object.position.y + this.speed);
                object.move(target);
            }
        }
    }
}