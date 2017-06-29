class Point {
    x:number;
    y:number;

    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    equals(other:Point) {
        return (this.x === other.x && this.y === other.y);
    }

    getLowerPoint() : Point {
        return new Point(this.x, this.y + 1);
    }
    getUpperPoint() : Point {
        return new Point(this.x, this.y - 1);
    }
    getRightPoint() : Point {
        return new Point(this.x + 1, this.y);
    }
    getLeftPoint() : Point {
        return new Point(this.x - 1, this.y);
    }
}