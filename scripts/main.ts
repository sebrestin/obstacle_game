import { GameEngine } from './Elements';

function startGame() {
    window.alert('Start Game');
    var world: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('world');
    var ctx = world.getContext("2d");
    if (ctx) {
        var gameEngine = new GameEngine(ctx);
        gameEngine.start();
        console.log('Game Started');
    } else {
        console.log('Context is ' + ctx);
    }
}

window.onload = () => {
    startGame();
};
