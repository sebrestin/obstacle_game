import { Position } from './Geometry';
import { Movable, Rigid, SimpleRectangleCollider, Gravity } from './Physics';
import { GameObject, AnimatedGameObject, StaticGameObject } from './GameObjects';  


export class Hero extends AnimatedGameObject implements Movable, Rigid {
    name:string = 'Bird';
    media_path:Array<string> = ['/media/hero/frame_0_delay-0.1s.gif', '/media/hero/frame_1_delay-0.1s.gif',
                                '/media/hero/frame_2_delay-0.1s.gif', '/media/hero/frame_3_delay-0.1s.gif',
                                '/media/hero/frame_4_delay-0.1s.gif', '/media/hero/frame_5_delay-0.1s.gif',
                                '/media/hero/frame_6_delay-0.1s.gif', '/media/hero/frame_7_delay-0.1s.gif'];
    width:number = 100;
    height:number = 100;
    position:Position = new Position(0, 300);

    topLeft():Position {
        return new Position(this.position.x, this.position.y);
    }

    topRight():Position {
        return new Position(this.position.x + 50, this.position.y);
    }
    bottomLeft():Position {
        return new Position(this.position.x, this.position.y + 50);
    }
    bottomRight():Position {
        return new Position(this.position.x + 50, this.position.y + 50);
    }

    move(target: Position): void {
        this.position = target;
    }

}

class Obstacle extends StaticGameObject implements Movable, Rigid {
    name:string = 'Wall';
    media_path:string = '/media/obstacle_one.png';
    width:number = 100;
    height:number = 100;
    position:Position = new Position(900, 300);

    topLeft():Position {
        return new Position(this.position.x, this.position.y);
    }

    topRight():Position {
        return new Position(this.position.x + 50, this.position.y);
    }
    bottomLeft():Position {
        return new Position(this.position.x, this.position.y + 50);
    }
    bottomRight():Position {
        return new Position(this.position.x + 50, this.position.y + 50);
    }

    move(target: Position): void {
        this.position = target;
    }
}


class Plane extends StaticGameObject implements Movable, Rigid {
    name:string = 'Plane';
    media_path:string = '/media/plane.png';
    width:number = 200;
    height:number = 150;
    position:Position = new Position(900, 100);

    topLeft():Position {
        return new Position(this.position.x, this.position.y);
    }

    topRight():Position {
        return new Position(this.position.x + 180, this.position.y);
    }
    bottomLeft():Position {
        return new Position(this.position.x, this.position.y + 150);
    }
    bottomRight():Position {
        return new Position(this.position.x + 180, this.position.y + 150);
    }

    move(target: Position): void {
        this.position = target;
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
    }
}


export class GameEngine {
    hero:Hero;
    obstacles:Array<Obstacle|Plane>;
    events:Array<number> = new Array<number>();
    animationFrame:number;

    private eventRegistry:EventRegistry = new EventRegistry();
    constructor(private context: CanvasRenderingContext2D) {}

    start() {
        this.hero = new Hero();
        this.obstacles = [new Obstacle()];
       
        // register event
        this.eventRegistry.registerEvent(EventType.KEY_UP,
            (e: KeyboardEvent) => {
                if (e.key === 'ArrowUp') {
                    let target = new Position(this.hero.position.x, this.hero.position.y - 50)
                    this.hero.move(target);
                }
            }
        );

        // game over / detect collision
        this.eventRegistry.registerEvent(EventType.GENERAL,
            () => {
                let firstObstacle = this.obstacles[0];
                let collider = new SimpleRectangleCollider(this.hero, firstObstacle);
                if (collider.collide()) {
                        this.stop();
                        window.alert('Game Over!');
                        this.start();
                    }
            },
            100
        );

        // gravity event
        let gravity = new Gravity([this.hero]);
        this.eventRegistry.registerEvent(
            EventType.GENERAL,
            () => {
                gravity.apply();
            },
            10
        );

        // spawn new obstacle
        this.eventRegistry.registerEvent(EventType.GENERAL,
            () => {
                if (Math.floor((Math.random() * 10) + 1) % 3 === 0) {
                    let obstacle: Plane = new Plane();
                    obstacle.draw(this.context);
                    this.obstacles.push(obstacle);
                } else {
                    let obstacle: Obstacle = new Obstacle();
                    obstacle.draw(this.context);
                    this.obstacles.push(obstacle);
                }
            },
            2000
        )

        // check if obstacles are alive
        this.eventRegistry.registerEvent(EventType.GENERAL,
            () => {
                let alive_obstacles: Array<Obstacle|Plane> = new Array<Obstacle|Plane>();
                for (let obstacle of this.obstacles) {
                    let position: Position = new Position(obstacle.position.x - 10, obstacle.position.y);
                    obstacle.move(position);

                    if (obstacle.position.x > -obstacle.width) {
                        alive_obstacles.push(obstacle);
                    }
                }
                this.obstacles = alive_obstacles;
            },
            50
        );        

        // redraw world
        this.animationFrame = window.requestAnimationFrame(() => this.draw());
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
        this.eventRegistry.unregisterAllEvents();
        window.cancelAnimationFrame(this.animationFrame);
    }
}