'use strict';
///<reference path="labyrinth.ts" />

setTimeout(() => {
    let labyrinth = new Labyrinth(<HTMLCanvasElement>document.getElementById("canvas"));
    labyrinth.generate();
}, 1);

