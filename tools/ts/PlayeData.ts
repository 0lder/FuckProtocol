import { BufferUtills } from "./BufferUtils";

export class PlayerData{

    public id:number = 0;

    public name:string = "";

    public isNew:boolean = false;

    public _buffer:any = null;

    public encode():any{
        const array = new Array();
        array.concat(BufferUtills.INT8_Encode(this.id));
        array.concat(BufferUtills.STRING_Encode(this.name));
        array.concat(BufferUtills.INT8_Encode(this.id));
        


        this._buffer = array;

        return this._buffer;
    }

    public decode(buffs:number[]){
        
        
    }
}