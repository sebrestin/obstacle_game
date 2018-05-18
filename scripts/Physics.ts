import { Position } from './Geometry';
import { GameObject } from './GameObjects';

export interface Movable extends GameObject {
    move(target: Position): void;
}

export interface Rigid {
    topLeft(): Position;
    bottomLeft(): Position;
    topRight(): Position;
    bottomRight(): Position;
}

export interface Collider {
    collide(): boolean;
}

export class SimpleRectangleCollider implements Collider {
    // This works when rectagles have no rotation

    constructor(private object1: Rigid, private object2: Rigid) { }

    collide() {
        if (
            (
                this.object1.topLeft().x >= this.object2.topLeft().x && this.object1.topRight().x <= this.object2.topRight().x || // object 1 top line inside object 2 top line
                this.object1.topLeft().x <= this.object2.topLeft().x && this.object1.topRight().x >= this.object2.topRight().x || // object 2 top line inside object 1 top line
                this.object1.topLeft().x <= this.object2.topLeft().x && this.object1.topRight().x >= this.object2.topLeft().x ||  // object 1 top line has the right side inside object 2 top line
                this.object1.topLeft().x >= this.object2.topLeft().x && this.object1.topLeft().x <= this.object2.topRight().x     // object 1 top line has the left side inside object 2 top line
            )
            &&
            (
                this.object1.bottomLeft().y >= this.object2.bottomLeft().y && this.object1.bottomRight().y <= this.object2.bottomRight().y || // object 1 bottom line inside object 2 bottom line
                this.object1.bottomLeft().y <= this.object2.bottomLeft().y && this.object1.bottomRight().y >= this.object2.bottomRight().y || // object 2 bottom line inside object 1 bottom line
                this.object1.bottomLeft().y <= this.object2.bottomLeft().y && this.object1.bottomRight().y >= this.object2.bottomLeft().y ||  // object 1 bottom line has the right side inside object 2 bottom line
                this.object1.bottomLeft().y >= this.object2.bottomLeft().y && this.object1.bottomLeft().y <= this.object2.bottomRight().y     // object 1 bottom line has the left side inside object 2 bottom line
            )
        ) {
            return true;
        } else {
            return false;
        }

    }

}

export class Gravity {
    speed:number = 1;
    ground: Position = new Position(0, 300);
    constructor(private objects: Array<Movable>) { }

    apply(): void {
        for (let object of this.objects) {
            if (object.position.y + this.speed <= this.ground.y) {
                let target = new Position(object.position.x, object.position.y + this.speed);
                object.move(target);
            }
        }
    }
}