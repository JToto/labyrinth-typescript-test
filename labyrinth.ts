'use strict';

/// <reference path="wall.ts" />
///<reference path="point.ts" />

const WIDTH = 15;
const HEIGHT = 15;

const OFFSET = 10;

const FIELD_SIZE = 20;

class Labyrinth {
    walls:Wall[];

    isPointFree(point:Point) {
        for (let wall of this.walls) {
            if (wall.start.equals(point) || wall.end.equals(point)) {
                return false;
            }
        }
        return true;
    }

 
    generate() {
        this.walls = [];
        // Generate static borders

        // upper wall
        for (let x = 1; x <= WIDTH; x++) {
            this.walls.push(new Wall(new Point(x - 1, 0), new Point(x, 0)));
        }

        // lower wall
        for (let x = 1; x <= WIDTH; x++) {
            this.walls.push(new Wall(new Point(x - 1, HEIGHT), new Point(x, HEIGHT)));
        }

        // left wall
        for (let y = 1; y <= HEIGHT; y++) {
            this.walls.push(new Wall(new Point(0, y - 1), new Point(0, y)));
        }

        // right wall
        for (let y = 1; y <= HEIGHT; y++) {
            this.walls.push(new Wall(new Point(WIDTH, y - 1), new Point(WIDTH, y)));
        }


    }

    draw(canvas:HTMLCanvasElement) {
        let ctx = canvas.getContext("2d");
        for (let wall of this.walls) {
            this.drawLine(ctx, wall.start, wall.end);
        }
    }

    drawLine(ctx:any, start:Point, end:Point) {
        ctx.beginPath();
        ctx.moveTo(OFFSET + start.x * FIELD_SIZE, OFFSET + start.y * FIELD_SIZE);
        ctx.lineTo(OFFSET + end.x * FIELD_SIZE, OFFSET + end.y * FIELD_SIZE);
        ctx.stroke();
    }
}