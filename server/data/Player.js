import { Object3D } from "./Object.js";

export class Player extends Object3D{
    constructor() {
        super();
    }

    attributes = {
        str:5,
        int:5,
        agi:5,

        armor:1,
        sparkResistance: 5
    };
    name = null;
    setName(nameParam){
        this.name = nameParam;
    }
}