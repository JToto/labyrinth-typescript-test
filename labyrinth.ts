'use strict';

/// <reference path="wall.ts" />
///<reference path="point.ts" />

const WIDTH = 50;
const HEIGHT = 30;

const OFFSET = 10;

const FIELD_SIZE = 20;

class Labyrinth {
    walls: Wall[];
    points: string[];

    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    isPointFree(point: Point) {
        if (point.x > 0 && point.y > 0
            && point.x <= WIDTH && point.y <= HEIGHT) {
            for (let wall of this.walls) {
                if (wall.start.equals(point) || wall.end.equals(point)) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }


    generate() {
        this.walls = [];
        this.points = [];
        // Generate static borders

        // upper wall
        for (let x = 1; x <= WIDTH; x++) {
            this.addWall(new Wall(new Point(x - 1, 0), new Point(x, 0)));
        }

        // lower wall
        for (let x = 1; x <= WIDTH; x++) {
            this.addWall(new Wall(new Point(x - 1, HEIGHT), new Point(x, HEIGHT)));

        }

        // left wall
        for (let y = 1; y <= HEIGHT; y++) {
            if (y !== Math.floor(HEIGHT / 2)) {
                this.addWall(new Wall(new Point(0, y - 1), new Point(0, y)));
            }
        }

        // right wall
        for (let y = 1; y <= HEIGHT; y++) {
            if (y !== Math.floor(HEIGHT / 2)) {
                this.addWall(new Wall(new Point(WIDTH, y - 1), new Point(WIDTH, y)));
            }
        }



        let done = false;
        let newPoint = null;
        let doNotCheck: string[] = [];
        while (!done) {
            let pointFound = false;

            let round = 0;

            let pointsToCheck: string[] = this.points.slice(0);

            while (pointsToCheck.length > 0 && !pointFound) {

                let pointToCheck: Point

                if (newPoint === null || round !== 0) {
                    // No path left to extend. Starting a new one!
                    let randomPointKey = Math.floor(Math.random() * (pointsToCheck.length - 1)) + 0;
                    pointToCheck = new Point(Number(pointsToCheck[randomPointKey].split("/")[0]),
                        Number(pointsToCheck[randomPointKey].split("/")[1]));
                    pointsToCheck.splice(randomPointKey, 1);
                } else {

                    // Try to extend current path.
                    pointToCheck = newPoint;
                }
                let directions = [1, 2, 3, 4];
                Labyrinth.shuffle(directions);
                while (directions.length > 0 && !pointFound) {
                    let randomDirection = directions[0];
                    directions.splice(0, 1);

                    if (randomDirection === 1) {
                        // Upper
                        if (this.isPointFree(pointToCheck.getUpperPoint())) {
                            pointFound = true;
                            newPoint = pointToCheck.getUpperPoint();
                            this.addWall(new Wall(pointToCheck, pointToCheck.getUpperPoint()));
                        }

                    } else if (randomDirection === 2) {
                        // Lower
                        if (this.isPointFree(pointToCheck.getLowerPoint())) {
                            pointFound = true;
                            newPoint = pointToCheck.getLowerPoint();
                            this.addWall(new Wall(pointToCheck, pointToCheck.getLowerPoint()));
                        }
                    } else if (randomDirection === 3) {
                        // Right
                        if (this.isPointFree(pointToCheck.getRightPoint())) {
                            pointFound = true;
                            newPoint = pointToCheck.getRightPoint();
                            this.addWall(new Wall(pointToCheck, pointToCheck.getRightPoint()));
                        }
                    } else if (randomDirection === 4) {
                        // Left
                        if (this.isPointFree(pointToCheck.getLeftPoint())) {
                            pointFound = true;
                            newPoint = pointToCheck.getLeftPoint();
                            this.addWall(new Wall(pointToCheck, pointToCheck.getLeftPoint()));
                        }

                    }
                }
                if (!pointFound) {
                    // Path ends, no possible ways left.
                    round++;
                }
            }

            if (!pointFound) {
                done = true;
            }

        }

        console.log(this.walls);
    }

    addWall(wall: Wall) {
        let that = this;
        this.walls.push(wall);
        let pointStr1: string = wall.start.x + "/" + wall.start.y
        let pointStr2: string = wall.end.x + "/" + wall.end.y
        if (this.points.indexOf(pointStr1) === -1) {
            this.points.push(pointStr1);
        }
        if (this.points.indexOf(pointStr2) === -1) {
            this.points.push(pointStr2);
        }

        setTimeout(function () {
            that.draw();
        }, 0);
    }

    draw() {
        let ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.strokeStyle = "white";
        for (let wall of this.walls) {
            this.drawLine(ctx, wall.start, wall.end);
        }
    }

    drawLine(ctx: any, start: Point, end: Point) {
        ctx.beginPath();
        ctx.moveTo(OFFSET + start.x * FIELD_SIZE, OFFSET + start.y * FIELD_SIZE);
        ctx.lineTo(OFFSET + end.x * FIELD_SIZE, OFFSET + end.y * FIELD_SIZE);
        ctx.stroke();
    }

    static shuffle(a) {
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
    }
}