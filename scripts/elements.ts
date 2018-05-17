export class Position {
    constructor(public x:number = 0, public y:number = 0) {}
}

export interface Object {
    name: string; // name of the object
    media_path:Array<string>; // path to the png or gif
    width: number;
    height: number;
    position: Position;

    draw(context): void;
}

export interface Movable {
    collission:number;
    move(position: Position): void;
    jump(y: number): void
}

export class Hero implements Object, Movable {
    name:string = 'Bird';
    media_path:Array<string> = ['/media/hero/frame_0_delay-0.1s.gif', '/media/hero/frame_1_delay-0.1s.gif',
                                '/media/hero/frame_2_delay-0.1s.gif', '/media/hero/frame_3_delay-0.1s.gif',
                                '/media/hero/frame_4_delay-0.1s.gif', '/media/hero/frame_5_delay-0.1s.gif',
                                '/media/hero/frame_6_delay-0.1s.gif', '/media/hero/frame_7_delay-0.1s.gif'];
    width:number = 100;
    height:number = 100;
    position:Position = new Position(0, 300);
    collission:number = 50;

    private animation:number = 0;
    private animationVelocity:number = 0;

    draw(context): void {
        let image:HTMLImageElement = new Image();
        image.src = this.media_path[this.animation % 8];
        console.log('Loaded hero');
        context.drawImage(image, this.position.x, this.position.y, this.width, this.height);

        if (this.animationVelocity % 4 === 0) {
            this.animation++;
        }
        this.animationVelocity++;
    }

    move(position: Position): void {
        this.position = position;
    }

    jump(y: number) {
        this.position.y -= y;
        setTimeout(
            () => {
                this.position.y += y;
                console.log('Fall');
            },
            800);
    }
}

export class Obstacle implements Object, Movable {
    name:string = 'Wall';
    media_path:Array<string> = ['/media/obstacle_one.png'];
    width:number = 100;
    height:number = 100;
    position:Position = new Position(900, 300);
    collission:number = 70;

    draw(context): void {
        let image:HTMLImageElement = new Image();
        image.src = this.media_path[0];

        console.log('Loaded obstacle');
        context.drawImage(image, this.position.x, this.position.y, this.width, this.height);
    }

    jump(y: number): void {}
    move(position: Position): void {
        this.position = position;
    }
}

export enum GAME_ACTION {MOVE, JUMP, IDLE};

export class GameEngine {
    hero:Hero;
    obstacles:Array<Obstacle>;
    events:Array<number> = new Array<number>();
    animationFrame:number;
    constructor(private context: CanvasRenderingContext2D) {}

    start() {
        this.hero = new Hero();
        this.obstacles = [new Obstacle()];
       
        for (let obstacle of this.obstacles) {
            obstacle.draw(this.context);
        }
        this.hero.draw(this.context);

        // register event
        window.onkeyup = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp') {
                this.hero.jump(100);
            }
        }

        // game over / detect collision
        this.events.push(
            setInterval(
                () => {
                    let firstObstacle = this.obstacles[0];
                    if (
                        (
                            this.hero.position.x >= firstObstacle.position.x && this.hero.position.x + this.hero.collission <= firstObstacle.position.x + firstObstacle.collission ||
                            this.hero.position.x <= firstObstacle.position.x && this.hero.position.x + this.hero.collission >= firstObstacle.position.x + firstObstacle.collission ||
                            this.hero.position.x <= firstObstacle.position.x && this.hero.position.x + this.hero.collission >= firstObstacle.position.x ||
                            this.hero.position.x >= firstObstacle.position.x && this.hero.position.x <= firstObstacle.position.x + firstObstacle.collission) &&
                        (
                            this.hero.position.y >= firstObstacle.position.y && this.hero.position.y + this.hero.collission <= firstObstacle.position.y + firstObstacle.collission ||
                            this.hero.position.y <= firstObstacle.position.y && this.hero.position.y + this.hero.collission >= firstObstacle.position.y + firstObstacle.collission ||
                            this.hero.position.y <= firstObstacle.position.y && this.hero.position.y + this.hero.collission >= firstObstacle.position.y ||
                            this.hero.position.y >= firstObstacle.position.y && this.hero.position.y <= firstObstacle.position.y + firstObstacle.collission
                        )
                    ) {
                            this.stop();
                            window.alert('Game Over!');
                            this.start();
                        }
                },
                100)
        );

        // spawn new obstacle
        this.events.push(
            setInterval(
                () => {
                    let obstacle: Obstacle = new Obstacle();
                    obstacle.draw(this.context);
                    this.obstacles.push(obstacle);
                },
                2000
            )
        );

        // check obstacles
        this.events.push(
            setInterval(
                () => {
                    let alive_obstacles: Array<Obstacle> = new Array<Obstacle>();
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
            )
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
        for (let event of this.events) {
            clearInterval(event);
        }
        window.cancelAnimationFrame(this.animationFrame);
    }
}