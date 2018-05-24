import { Position } from './Geometry';

export abstract class GameObject {
    name: string; // name of the object
    width: number;
    height: number;
    position: Position;

    abstract draw(context): void;
    abstract load(): void;
    abstract isLoaded(): boolean;

    move(target: Position): void {
        this.position = target;
    }
}

export class StaticGameObject extends GameObject {
    name: string; // name of the object
    media_path: string; // path to the png
    width: number;
    height: number;
    position: Position;

    private image: HTMLImageElement = null;
    private imageLoaded: boolean = false;

    load() {
        if (this.image === null)
            this.image = new Image();
        this.image.src = this.media_path;
        this.image.onload = () => {
            this.imageLoaded = true;
        }
    }

    isLoaded(): boolean {
        return this.imageLoaded;
    }

    draw(context): void {
        if (this.isLoaded()) {
            context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        } else {
            this.load();
            context.fillStyle = 'black';
            context.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }
}

export class AnimatedGameObject extends GameObject {
    name: string; // name of the object
    media_path: Array<string>; // path to the png
    width: number;
    height: number;
    position: Position;

    public animationSpeed: number = 3;
    private animation: number = 0;
    private animationFrames: number = 0;
    private images: Array<HTMLImageElement> = new Array<HTMLImageElement>();
    private loadedImages: Array<boolean> = new Array<boolean>();

    load() {
        this.media_path.slice().forEach(
            (path, idx) => {
                let image: HTMLImageElement = null;
                if (this.loadedImages.length <= idx) {
                    image = new Image();
                    this.images.push(image);
                    this.loadedImages.push(false);
                } else {
                    image = this.images[idx];
                }
                image.src = path;
                image.onload = () => this.loadedImages[idx] = true;
            }
        )
    }

    isLoaded(): boolean {
        return this.loadedImages.length !== 0 && this.loadedImages.reduce((a, b) => a && b);
    }

    draw(context): void {
        if (this.isLoaded()) {
            let image = this.images[this.animation];
            context.drawImage(image, this.position.x, this.position.y, this.width, this.height);
            if (this.animationFrames % this.animationSpeed === 0) {
                this.animation = (this.animation + 1) % this.loadedImages.length;
            }
            this.animationFrames++;
        } else {
            this.load();
            context.fillStyle = 'black';
            context.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }
}
