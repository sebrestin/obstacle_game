import { Hero, GameEngine } from '../scripts/Elements';
import { wait } from './utils';
import { Position } from '../scripts/Geometry';

declare var karmaHTML: any;

describe('Test Engine behaviour', () => {
    var engine: GameEngine = null;

    beforeAll((done) => {
        karmaHTML.index.open();
        wait(done);
    });

    beforeEach(() => {
        let world: HTMLCanvasElement = <HTMLCanvasElement>karmaHTML.index.document.getElementById('world');
        let ctx = world.getContext('2d');
        engine = new GameEngine(ctx);
    });

    it('Test obstacle spawn', () => {
        engine.spawnObstacle();
        expect(engine.obstacles.length).toBe(1);

    });

    it('Test hero spawn', () => {
        engine.spawnHero()
        expect(engine.hero).not.toBe(null);
        expect(engine.hero).not.toBe(undefined);
    });

    it('Test slide obstacle', () => {
        engine.spawnObstacle();
        let initialPosition: Position = engine.obstacles[0].position
        engine.slideObstacles();
        expect(engine.obstacles[0].position.x).toBe(initialPosition.x - 10);
        expect(engine.obstacles[0].position.y).toBe(initialPosition.y);
    });

    it('Test detect collision at spawn time', () => {
        engine.spawnHero();
        engine.spawnObstacle();
        expect(engine.detectCollision()).toBe(false);
    });

    it('Test detect collision after spawn', () => {
        engine.spawnHero();
        engine.spawnObstacle();

        let hero: Hero = engine.hero;
        hero.position.y = engine.obstacles[0].position.y;

        for (let i = 0; i < 90; i++) {
            engine.slideObstacles();
        }

        expect(engine.detectCollision()).toBe(true);
    });

    it('Test garbage collect', () => {
        engine.spawnObstacle();
        for (let i = 0; i < 110; i++) {
            engine.slideObstacles();
        }
        engine.garbageCollectObstacles();
        expect(engine.obstacles.length).toBe(0);
    });

    it('Test score inscreases', () => {
        engine.spawnScore();
        engine.spawnObstacle();
        for (let i = 0; i < 110; i++) {
            engine.slideObstacles();
        }
        engine.garbageCollectObstacles();
        expect(engine.obstacles.length).toBe(0);
        expect(engine.score.points).toBe(1);
    });

    it('Test arrow key up cannot move hero out of canvas', () => {
        engine.spawnHero();
        let event = new KeyboardEvent('keyup', { key: 'ArrowUp' });
        engine.arrowKeyUp(event);
        expect(engine.hero.position.y).toBe(0);
    });

    it('Test arrow key up', () => {
        engine.spawnHero();
        engine.hero.move(new Position(0, 60))
        let event = new KeyboardEvent('keyup', { key: 'ArrowUp' });
        engine.arrowKeyUp(event);
        expect(engine.hero.position.y).toBe(30);
    });

    it('Test engine start', () => {
        engine.start();

        expect(engine.hero).not.toBe(null);
        expect(engine.hero).not.toBe(undefined);
        expect(engine.hero.position.x).toBe(0);
        expect(engine.hero.position.y).toBe(0);

        expect(engine.obstacles.length).toBe(1);
        expect(engine.obstacles[0].position.x).toBeGreaterThan(800);

        expect(engine.animationFrame).not.toBe(0);

        expect(engine.eventRegistry.size()).toBe(5);

    });

    it('Test engine stop', () => {
        engine.start();
        engine.stop();

        expect(engine.hero).toBe(null);
        expect(engine.obstacles.length).toBe(0);
        expect(engine.eventRegistry.size()).toBe(0);
        expect(engine.animationFrame).toBe(0);
    });
});
