'use strict';

/// <reference path="wall.ts" />
///<reference path="point.ts" />

let WIDTH = 20;
let HEIGHT = 10;

const OFFSET = 20;

const FIELD_SIZE = 30;

class Labyrinth {
    walls: Wall[];
    points: string[];

    round: number;

    playerPosition: Point;

    canvas: HTMLCanvasElement;



    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        document.addEventListener('keydown', this.keyboardInput);
        this.round = 0;
        document.getElementById("level").innerHTML = (this.round + 1).toString();
    }

    keyboardInput = (event: KeyboardEvent) => {
        console.log(event);
        // PRESS LEFT ARROW
        if (event.keyCode == 37) {
            if (this.playerPosition.x - 1 >= 0 && this.playerCanGoLeft()) {
                this.playerPosition.x--;
            }
        }
        // PRESS UP ARROW
        else if (event.keyCode == 38) {
            if (this.playerPosition.y - 1 >= 0 && this.playerCanGoUp()) {
                this.playerPosition.y--;
            }
        }
        // PRESS RIGHT ARROW
        else if (event.keyCode == 39) {
            if (this.playerPosition.x + 1 < WIDTH && this.playerCanGoRight()) {
                this.playerPosition.x++;
            }
        }
        // PRESS DOWN ARROW
        else if (event.keyCode == 40) {
            if (this.playerPosition.y + 1 < HEIGHT && this.playerCanGoDown()) {
                this.playerPosition.y++;
            }
        }

        // PRESS SPACE
        else if (event.keyCode == 32) {
            this.playerPosition = new Point(2, 2);
        }

        this.draw();

        if (this.playerPosition.equals(new Point(WIDTH - 1, Math.ceil(HEIGHT / 2) - 1))) {
            this.round++;
            document.getElementById("level").innerHTML = (this.round + 1).toString();
            WIDTH++;
            HEIGHT++;
            this.generate();
        }
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

        this.playerPosition = new Point(0, Math.ceil(HEIGHT / 2) - 1);

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
            if (y !== Math.ceil(HEIGHT / 2)) {
                this.addWall(new Wall(new Point(0, y - 1), new Point(0, y)));
            }
        }

        // right wall
        for (let y = 1; y <= HEIGHT; y++) {
            if (y !== Math.ceil(HEIGHT / 2)) {
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

        this.draw();
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
    }

    draw() {
        let ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.strokeStyle = "white";
        for (let wall of this.walls) {
            this.drawLine(ctx, wall.start, wall.end);
        }
        this.drawPlayer(ctx);
    }

    drawLine(ctx: any, start: Point, end: Point) {
        ctx.lineWidth=2;
        ctx.beginPath();
        ctx.moveTo(OFFSET + start.x * FIELD_SIZE, OFFSET + start.y * FIELD_SIZE);
        ctx.lineTo(OFFSET + end.x * FIELD_SIZE, OFFSET + end.y * FIELD_SIZE);
        ctx.stroke();
        
    }

    drawPlayer(ctx: any) {
        ctx.fillStyle = "yellow";
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.arc(OFFSET + (FIELD_SIZE / 2) + (this.playerPosition.x * FIELD_SIZE),
            OFFSET + (FIELD_SIZE / 2) + (this.playerPosition.y * FIELD_SIZE), FIELD_SIZE / 3, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }

    playerCanGoDown() {
        let lowerWall = new Wall(new Point(this.playerPosition.x, this.playerPosition.y + 1),
                                        new Point(this.playerPosition.x + 1, this.playerPosition.y + 1));
        return !this.hasWall(lowerWall);
    }

    playerCanGoUp() {
        let upperWall = new Wall(new Point(this.playerPosition.x, this.playerPosition.y),
                                        new Point(this.playerPosition.x + 1, this.playerPosition.y));
        return !this.hasWall(upperWall);
    }

    playerCanGoRight() {
        let rightWall = new Wall(new Point(this.playerPosition.x + 1, this.playerPosition.y),
                                        new Point(this.playerPosition.x + 1, this.playerPosition.y + 1));
        return !this.hasWall(rightWall);
    }

    playerCanGoLeft() {
        let leftWall = new Wall(new Point(this.playerPosition.x, this.playerPosition.y),
                                        new Point(this.playerPosition.x, this.playerPosition.y + 1));
        return !this.hasWall(leftWall);
    }

    hasWall(wall: Wall) {
        for (let walli of this.walls) {
            if (walli.start.equals(wall.start) && walli.end.equals(wall.end)
             || walli.start.equals(wall.end) && walli.end.equals(wall.start)) {
                return true;
            }
        }
        return false;
    }


    static shuffle(a) {
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
    }
}

