export class Object3D
{
    position = {
        x:0,
        y:0,
        z:0
    };

    randomPos()
    {
        this.position.x = Math.floor(Math.random() * 21) - 10;
        this.position.z = Math.floor(Math.random() * 21) - 10;
    }
}