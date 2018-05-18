import { Position } from './Geometry';

export interface GameObject {
    name: string; // name of the object
    width: number;
    height: number;
    position: Position;

    draw(context): void;
}

export class StaticGameObject implements GameObject {
    name: string; // name of the object
    media_path:string; // path to the png
    width: number;
    height: number;
    position: Position;

    draw(context): void {
        let image:HTMLImageElement = new Image();
        image.src = this.media_path;

        console.log('Loaded obstacle');
        context.drawImage(image, this.position.x, this.position.y, this.width, this.height);
    }
}

export class AnimatedGameObject implements GameObject {
    name: string; // name of the object
    media_path:Array<string>; // path to the png
    width: number;
    height: number;
    position: Position;

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
}