///<reference path="point.ts" />

class Wall {
    start:Point;
    end:Point;

    constructor(start:Point, end:Point) {
        this.start = start;
        this.end = end;
    }
}