import { Hero, GameEngine } from '../scripts/Elements';
import { wait } from './utils';
import { ENGINE_METHOD_ALL } from 'constants';

declare var karmaHTML:any;

describe('Test Engine behaviour', () => {
    var engine:GameEngine;

    beforeAll((done) => {
        karmaHTML.index.open();
        wait(done);
      });

    beforeEach(()=>{
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
        let initialPosition = engine.obstacles[0].position
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

        let hero = engine.hero;
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

    it('Test arrow key up', () => {
        engine.spawnHero();
        let event = new KeyboardEvent('keyup', {key: 'ArrowUp'});
        engine.arrowKeyUp(event);
        expect(engine.hero.position.y).toBe(-30);
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
