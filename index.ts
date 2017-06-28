'use strict';
///<reference path="labyrinth.ts" />

let labyrinth = new Labyrinth();
labyrinth.generate();
labyrinth.draw(<HTMLCanvasElement> document.getElementById("canvas"));