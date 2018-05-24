export interface Observer {
    update(): void;
}

export interface Observable {
    registerObserver(observer: Observer): void;
    unregisterObserver(observer: Observer): void;
    notify(): void;
}