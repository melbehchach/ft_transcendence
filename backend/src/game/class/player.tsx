class player{
    private y: number;
    private x: number;
    private width: number;
    private height: number;
    private color: string;
    constructor(y: number, x: number, width: number, height: number, color: string){
        this.y = y;
        this.x = x;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    public getY(): number{
        return this.y;
    }
    public getX(): number{
        return this.x;
    }
    public getWidth(): number{
        return this.width;
    }
    public getHeight(): number{
        return this.height;
    }
    public getColor(): string{
        return this.color;
    }
    public setY(y: number): void{
        this.y = y;
    }
    public setX(x: number): void{
        this.x = x;
    }
    public setWidth(width: number): void{
        this.width = width;
    }
    public setHeight(height: number): void{
        this.height = height;
    }
    public setColor(color: string): void{
        this.color = color;
    }
    public drawRect(context: any): void{
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }
}

export default player;