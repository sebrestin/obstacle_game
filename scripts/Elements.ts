import { Position } from './Geometry';
import { Rigid, SimpleRectangleCollider, Gravity, CollisionArea } from './Physics';
import { GameObject, AnimatedGameObject, StaticGameObject } from './GameObjects';
import { Observable, Observer } from './Observatory';


export class Hero extends AnimatedGameObject implements Rigid {
    name: string = 'Bird';
    media_path: Array<string> = ['/media/hero/frame_0_delay-0.1s.png', '/media/hero/frame_1_delay-0.1s.png',
        '/media/hero/frame_2_delay-0.1s.png', '/media/hero/frame_3_delay-0.1s.png',
        '/media/hero/frame_4_delay-0.1s.png', '/media/hero/frame_5_delay-0.1s.png',
        '/media/hero/frame_6_delay-0.1s.png', '/media/hero/frame_7_delay-0.1s.png'];
    width: number = 100;
    height: number = 100;
    position: Position = new Position(0, 0);

    getCollisionArea() {
        let center = new Position(this.position.x + this.width / 2, this.position.y + this.height / 2);
        return new CollisionArea(center, 60, 60);
    }

}

export class Obstacle extends StaticGameObject implements Rigid {
    name: string = 'Wall';
    media_path: string = '/media/obstacle_one.png';
    width: number = 100;
    height: number = 100;
    position: Position = new Position(900, 300);

    private observer: Observer = null;

    getCollisionArea() {
        let center = new Position(this.position.x + this.width / 2, this.position.y + this.height / 2);
        return new CollisionArea(center, 50, 50);
    }

    registerObserver(observer: Observer) {
        this.observer = observer;
    }

    unregisterObserver(observer: Observer) {
        this.observer = null;
    }

    notify() {
        if (this.observer) {
            this.observer.update();
        }
    }
}


class Plane extends StaticGameObject implements Rigid, Observable {
    name: string = 'Plane';
    media_path: string = '/media/plane.png';
    width: number = 200;
    height: number = 150;

    position: Position = new Position(900, 100);

    private observer: Observer = null;

    getCollisionArea() {
        let center = new Position(this.position.x + this.width / 2, this.position.y + this.height / 2);
        return new CollisionArea(center, 160, 120);
    }

    registerObserver(observer: Observer) {
        this.observer = observer;
    }

    unregisterObserver(observer: Observer) {
        this.observer = null;
    }

    notify() {
        if (this.observer) {
            this.observer.update();
        }
    }
}

class Background extends StaticGameObject {
    name: string = 'Background';
    media_path: string = '/media/background.jpg';
    width: number = 800;
    height: number = 400;
    position: Position = new Position(0, 0);
}

class Score extends GameObject implements Observer {
    name: string = 'Background';
    media_path: string = '/media/background.jpg';
    width: number = 100;
    height: number = 40;
    position: Position = new Position(550, 50);

    points: number = 0;

    load() { }

    isLoaded() { return true }

    draw(context) {
        context.font = this.height + 'px Arial';
        context.strokeText("Points: " + this.points, this.position.x, this.position.y);
    }

    update() {
        this.points++;
    }
}

enum EventType { KEY_UP, GENERAL };
class EventRegistry {
    private events: Array<number> = new Array<number>();

    registerEvent(eventType: EventType, todo: any, interval?: number): void {
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
    background: Background;
    score: Score;
    hero: Hero;
    obstacles: Array<Obstacle | Plane> = new Array<Obstacle | Plane>();
    animationFrame: number = 0;

    public eventRegistry: EventRegistry = new EventRegistry();
    constructor(public context: CanvasRenderingContext2D) { }

    start() {
        this.spawnBackground();
        this.spawnScore();
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

        // move obstacles
        this.eventRegistry.registerEvent(EventType.GENERAL, () => this.slideObstacles(), 50);

        // garbage collect obstacles
        this.eventRegistry.registerEvent(EventType.GENERAL, () => this.garbageCollectObstacles(), 51);

        // redraw world
        this.animationFrame = window.requestAnimationFrame(() => this.draw());
    }

    arrowKeyUp(e: KeyboardEvent) {
        if (e.key === 'ArrowUp') {
            if (this.hero.position.y - 30 > 0) {
                let target = new Position(this.hero.position.x, this.hero.position.y - 30)
                this.hero.move(target);
            }
        }
    }

    spawnScore() {
        this.score = new Score();
    }

    spawnBackground() {
        this.background = new Background();
    }

    spawnHero() {
        this.hero = new Hero();
    }

    spawnObstacle() {
        if (Math.floor((Math.random() * 10) + 1) % 3 === 0) {
            let obstacle: Plane = new Plane();
            obstacle.draw(this.context);
            this.obstacles.push(obstacle);
            obstacle.registerObserver(this.score);
        } else {
            let obstacle: Obstacle = new Obstacle();
            obstacle.draw(this.context);
            this.obstacles.push(obstacle);
            obstacle.registerObserver(this.score);
        }
    }

    garbageCollectObstacles() {
        for (let idx = 0; idx < this.obstacles.length; idx++) {
            let obstacle = this.obstacles[idx];
            if (obstacle.position.x <= -obstacle.width) {
                this.obstacles.splice(idx, 1);
                obstacle.notify();
            }
        }
    }

    slideObstacles() {
        this.obstacles.slice().forEach(obstacle => {
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
        this.animationFrame = window.requestAnimationFrame(() => this.draw());

        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.background.draw(this.context);
        this.score.draw(this.context);
        this.hero.draw(this.context);
        for (let obstacle of this.obstacles) {
            obstacle.draw(this.context);
        }

    }

    stop() {
        this.obstacles = new Array<Obstacle | Plane>();
        this.hero = null;
        this.eventRegistry.unregisterAllEvents();
        window.cancelAnimationFrame(this.animationFrame);
        this.animationFrame = 0;
    }
}