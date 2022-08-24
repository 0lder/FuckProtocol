import { EnumBufferType } from "./EnumBufferType";

export class FPBuffer{

    public _buffers:number[] = [];


    public setBuffers(data:number[]):void{
        this._buffers = data;
    }
    public readInt():number{

    }

    public writeInt(num:number):void{

    }

    public readString():void{

    }


    public writeString(str:string):void{

    }

    public readBoolean():void{

    }

    public writeBoolean():void{

    }

    public getDataType():EnumBufferType {
        
        return this.readInt();
    }
}