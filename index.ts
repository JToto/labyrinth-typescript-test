'use strict';
///<reference path="labyrinth.ts" />

let labyrinth = new Labyrinth(<HTMLCanvasElement> document.getElementById("canvas"));
labyrinth.generate();
