class opponent{
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private color: string;
    private score: number;

    constructor(){
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.color = 'white';
        this.score = 0;
    }
    setX(x){
        this.x = x;
    }
    setY(y){
        this.y = y;
    }
    setWidth(width){
        this.width = width;
    }
    setHeight(height){
        this.height = height;
    }
    setColor(color){
        this.color = color;
    }
    setScore(score){
        this.score = score;
    }
    getX(){
        return this.x;
    }
    getY(){
        return this.y;
    }
    getWidth(){
        return this.width;
    }
    getHeight(){
        return this.height;
    }
    getColor(){
        return this.color;
    }
    getScore(){
        return this.score;
    }
}

export default opponent;