import { GameEngine } from '../scripts/Elements';
import { StaticGameObject, AnimatedGameObject } from '../scripts/GameObjects';
import { wait } from './utils';
import { GameObject } from '../scripts/GameObjects';
import { Position } from '../scripts/Geometry';

declare var karmaHTML: any;

describe('Test Engine behaviour', () => {
    var engine: GameEngine;

    beforeAll((done) => {
        karmaHTML.index.open();
        wait(done);
    });

    beforeEach(() => {
        let world: HTMLCanvasElement = <HTMLCanvasElement>karmaHTML.index.document.getElementById('world');
        let ctx = world.getContext('2d', { alpha: false });
        engine = new GameEngine(ctx);
        engine.context.clearRect(0, 0, engine.context.canvas.width, engine.context.canvas.height);
    });

    it('Test draw static object', (done) => {
        let staticObject = new StaticGameObject();
        staticObject.media_path = '/media/plane.png';
        staticObject.width = 100;
        staticObject.height = 100;
        staticObject.position = new Position(0, 0);

        staticObject.draw(engine.context);
        let imgData: Uint8ClampedArray = engine.context.getImageData(staticObject.position.x, staticObject.position.y, staticObject.width, staticObject.height).data;
        for (let i = 0; i < imgData.length; i += 4) {
            expect(imgData[i]).toBe(0);
            expect(imgData[i + 1]).toBe(0);
            expect(imgData[i + 2]).toBe(0);
            expect(imgData[i + 3]).toBe(255);
        }

        setTimeout(() => {
            staticObject.draw(engine.context);

            imgData = engine.context.getImageData(staticObject.position.x, staticObject.position.y, staticObject.width, staticObject.height).data;

            let sum = 0;
            for (let i = 0; i < imgData.length; i += 4) {
                sum += imgData[i] + imgData[i + 1] + imgData[i + 2];
            }
            expect(sum).not.toBe(0);

            done();
        }, 50);
    });

    it('Test draw animated object', (done) => {
        let animatedObject = new AnimatedGameObject();
        animatedObject.media_path = ['/media/hero/frame_0_delay-0.1s.gif', '/media/hero/frame_1_delay-0.1s.gif',
            '/media/hero/frame_2_delay-0.1s.gif', '/media/hero/frame_3_delay-0.1s.gif',
            '/media/hero/frame_4_delay-0.1s.gif', '/media/hero/frame_5_delay-0.1s.gif',
            '/media/hero/frame_6_delay-0.1s.gif', '/media/hero/frame_7_delay-0.1s.gif'];
        animatedObject.width = 100;
        animatedObject.height = 100;
        animatedObject.animationSpeed = 1
        animatedObject.position = new Position(0, 0);

        animatedObject.draw(engine.context);
        let imgData: Uint8ClampedArray = engine.context.getImageData(animatedObject.position.x, animatedObject.position.y, animatedObject.width, animatedObject.height).data;
        for (let i = 0; i < imgData.length; i += 4) {
            expect(imgData[i]).toBe(0);
            expect(imgData[i + 1]).toBe(0);
            expect(imgData[i + 2]).toBe(0);
            expect(imgData[i + 3]).toBe(255);
        }

        setTimeout(() => {
            let previous_image = 0;
            for (let i = 0; i < imgData.length; i += 4) {
                previous_image += imgData[i] + imgData[i + 1] + imgData[i + 2];
            }

            for (let i = 0; i < animatedObject.media_path.length; i++) {
                animatedObject.draw(engine.context);
                imgData = engine.context.getImageData(animatedObject.position.x, animatedObject.position.y, animatedObject.width, animatedObject.height).data;

                let image = 0;
                for (let i = 0; i < imgData.length; i += 4) {
                    image += imgData[i] + imgData[i + 1] + imgData[i + 2];
                }
                expect(image).not.toBe(previous_image);
                previous_image = image;
            }

            done();
        }, 600);
    });
});