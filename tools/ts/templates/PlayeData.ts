import { EnumBufferType } from "./EnumBufferType";
import { FPBuffer } from "./FPBuffer";
import { ItemInfo } from "./ItemInfo";

export class PlayerData extends FPBuffer{

    public id:number = 0;

    public name:string = "";

    public isNew:boolean = false;

    public items:ItemInfo[] = [];

    public encode():number[]{

        this._buffers =  [];
        this.writeInt(this.id,EnumBufferType.INT32);
        this.writeString(this.name);
        this.writeBoolean(this.isNew);
        this.writeArray(this.items);
        return this._buffers;
    }

    public decode(buffs:number[]){
        this._buffers = buffs;
        this.id = this.readInt();
        this.name = this.readString();
        this.isNew = this.readBoolean();
        for (let index = 0; index < this.readInt(); index++) {
            const item:ItemInfo = new ItemInfo();
            item.decode(this._buffers);
            this.items.push(item);
        }
    }
}