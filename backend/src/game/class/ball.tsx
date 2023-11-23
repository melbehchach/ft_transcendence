const canvasWidth = 1080;
const canvasHeight = 720;

class ball{
    private x: number;
    private y: number;
    private color: string;
    private speed: number;
    private dx: number;
    private dy: number;
    constructor(x: number, y: number, color: string){
        this.x = x;
        this.y = y;
        this.color = color;
    }
    public getX(): number{
        return this.x;
    }
    public getY(): number{
        return this.y;
    }
    public getColor(): string{
        return this.color;
    }
    public setX(x: number): void{
        this.x = x;
    }
    public setY(y: number): void{
        this.y = y;
    }
    public setColor(color: string): void{
        this.color = color;
    }
    public drawBall(context: any): void{
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, 20, 0, 2 * Math.PI, false);
        context.closePath();
        context.fill();
    }
    public setSpeed(speed: number): void{
        this.speed = speed;
    }
    public getSpeed(): number{
        return this.speed;
    }
    public setDx(dx: number): void{
        this.dx = dx;
    }
    public getDx(): number{
        return this.dx;
    }
    public setDy(dy: number): void{
        this.dy = dy;
    }
    public getDy(): number{
        return this.dy;
    }
    public move(): void{
        this.x += this.dx;
        this.y += this.dy;
    }
    public reset(): void{
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.dx = -this.dx;
    }   
}

export default ball;