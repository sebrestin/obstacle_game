import { Position } from './Geometry';
import { Rigid, SimpleRectangleCollider, Gravity, CollisionArea } from './Physics';
import { GameObject, AnimatedGameObject, StaticGameObject } from './GameObjects';  


export class Hero extends AnimatedGameObject implements Rigid {
    name:string = 'Bird';
    media_path:Array<string> = ['/media/hero/frame_0_delay-0.1s.gif', '/media/hero/frame_1_delay-0.1s.gif',
                                '/media/hero/frame_2_delay-0.1s.gif', '/media/hero/frame_3_delay-0.1s.gif',
                                '/media/hero/frame_4_delay-0.1s.gif', '/media/hero/frame_5_delay-0.1s.gif',
                                '/media/hero/frame_6_delay-0.1s.gif', '/media/hero/frame_7_delay-0.1s.gif'];
    width:number = 100;
    height:number = 100;
    position:Position = new Position(0, 0);

    getCollisionArea() {
        let center = new Position(this.position.x + this.width / 2, this.position.y + this.height / 2);
        return new CollisionArea(center, 60, 60);
    }

}

export class Obstacle extends StaticGameObject implements Rigid {
    name:string = 'Wall';
    media_path:string = '/media/obstacle_one.png';
    width:number = 100;
    height:number = 100;
    position:Position = new Position(900, 300);

    getCollisionArea() {
        let center = new Position(this.position.x + this.width / 2, this.position.y + this.height / 2);
        return new CollisionArea(center, 50, 50);
    }
}


class Plane extends StaticGameObject implements Rigid {
    name:string = 'Plane';
    media_path:string = '/media/plane.png';
    width:number = 200;
    height:number = 150;

    position:Position = new Position(900, 100);

    getCollisionArea() {
        let center = new Position(this.position.x + this.width / 2, this.position.y + this.height / 2);
        return new CollisionArea(center, 160, 120);
    }
}


enum EventType {KEY_UP, GENERAL};
class EventRegistry {
    private events:Array<number> = new Array<number>();

    registerEvent(eventType:EventType, todo:any, interval?:number): void {
        if (eventType === EventType.KEY_UP) {
            window.onkeyup = todo;
        }
        if (eventType === EventType.GENERAL) {
            this.events.push(setInterval(todo, interval));
        }
    }

    unregisterAllEvents(): void {
        for (let event of this.events) {
            clearInterval(event);
        }
        this.events = new Array<number>();
    }

    size() {
        return this.events.length;
    }
}


export class GameEngine {
    hero:Hero;
    obstacles:Array<Obstacle|Plane> = new Array<Obstacle|Plane>();
    animationFrame:number = 0;

    public eventRegistry:EventRegistry = new EventRegistry();
    constructor(private context: CanvasRenderingContext2D) {}

    start() {
        this.spawnHero();
        this.spawnObstacle();

        let gravity = new Gravity([this.hero]);
       
        // register event
        this.eventRegistry.registerEvent(EventType.KEY_UP, (e: KeyboardEvent) => this.arrowKeyUp(e));

        // game over / detect collision
        this.eventRegistry.registerEvent(EventType.GENERAL,
            () => {
                if (this.detectCollision()) {
                    this.stop();
                    window.alert('Game Over!');
                    this.start();
                }
            },
            100
        );

        // gravity event
        this.eventRegistry.registerEvent(EventType.GENERAL, () => gravity.apply(), 10);

        // spawn new obstacle
        this.eventRegistry.registerEvent(EventType.GENERAL, () => this.spawnObstacle(), 2000)
        
        // check if obstacles are alive
        this.eventRegistry.registerEvent(EventType.GENERAL, () => this.slideObstacles(), 50);        

        // garbage collect obstacles
        this.eventRegistry.registerEvent(EventType.GENERAL, () => this.garbageCollectObstacles(), 51);

        // redraw world
        this.animationFrame = window.requestAnimationFrame(() => this.draw());
    }

    arrowKeyUp(e: KeyboardEvent) {
        if (e.key === 'ArrowUp') {
            let target = new Position(this.hero.position.x, this.hero.position.y - 30)
            this.hero.move(target);
        }
    }

    spawnHero() {
        this.hero = new Hero();
    }

    spawnObstacle() {
        if (Math.floor((Math.random() * 10) + 1) % 3 === 0) {
            let obstacle: Plane = new Plane();
            obstacle.draw(this.context);
            this.obstacles.push(obstacle);
        } else {
            let obstacle: Obstacle = new Obstacle();
            obstacle.draw(this.context);
            this.obstacles.push(obstacle);
        }
    }

    garbageCollectObstacles() {
        for (let idx=0; idx < this.obstacles.length; idx++) {
            let obstacle = this.obstacles[idx];
            if (obstacle.position.x <= -obstacle.width) {
                this.obstacles.splice(idx, 1);
            }
        }
    }

    slideObstacles() {
        this.obstacles.slice().forEach( obstacle => {
            let position: Position = new Position(obstacle.position.x - 10, obstacle.position.y);
            obstacle.move(position);
        })
    }

    detectCollision() {
        let firstObstacle = this.obstacles[0];
        let collider = new SimpleRectangleCollider(this.hero.getCollisionArea(), firstObstacle.getCollisionArea());
        return collider.collide();
    }

    draw() {
        console.log('Redraw world');
        this.animationFrame = window.requestAnimationFrame(() => this.draw());

        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.hero.draw(this.context);
        for (let obstacle of this.obstacles) {
            obstacle.draw(this.context);
        }

    }

    stop() {
        this.obstacles = new Array<Obstacle|Plane>();
        this.hero = null;
        this.eventRegistry.unregisterAllEvents();
        window.cancelAnimationFrame(this.animationFrame);
        this.animationFrame = 0;
    }
}