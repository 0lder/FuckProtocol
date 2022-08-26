import { EnumBufferType } from "./EnumBufferType";

export class FPBuffer{

    public _buffers:number[] = [];


    public setBuffers(data:number[]):void{
        this._buffers = data;
    }

    public readInt():number{

        let bytes:number[] = [];
        const dataType:EnumBufferType = this._getDataType();
        let bytesLen:number = 0
        switch(dataType){
            case EnumBufferType.INT8:
                bytesLen = 1;
                break;
            case EnumBufferType.INT16:
                bytesLen = 2;
                break;
            case EnumBufferType.INT32:
                bytesLen = 4;
                break;
            case EnumBufferType.INT64:
                bytesLen = 8;
                break;
            default:
                console.error(`decode Int error dataType is ${dataType}`);
                break;
        }

        if(bytesLen > 0 && this._buffers.length >= bytesLen){
            bytes = this._buffers.splice(0,bytesLen);
            return this._bytesToIntBigEndian(bytes);
        }
        return 0;
    }


    /**
     * 字节转int
     *
     * @private
     * @param {*} bytes
     * @return {*}  {number}
     * @memberof FPBuffer
     */
    private _bytesToIntBigEndian(bytes):number {
        let val:number = 0;
        for (var i = 0; i < bytes.length; ++i) {
            val += bytes[i];
            if (i < bytes.length - 1) {
                val = val << 8;
            }
        }
        return val;


    }

    private  _intToBytesBigEndian(number: number, length: number) {
        const bytes: number[] = [];
        let i = length;
        do {
            bytes[--i] = number & (255);
            number = number >> 8;
        } while (i)
        return bytes;
    }
    public writeInt(num:number,dataType:EnumBufferType = EnumBufferType.INT32):void{

        // 先写入数据类型
        this._writeDataType(dataType);

        // 再写入data
        let bytesLen:number = 0
        switch(dataType){
            case EnumBufferType.INT8:
                bytesLen = 1;
                break;
            case EnumBufferType.INT16:
                bytesLen = 2;
                break;
            case EnumBufferType.INT32:
                bytesLen = 4;
                break;
            case EnumBufferType.INT64:
                bytesLen = 8;
                break;
            default:
                console.error(`decode Int error dataType is ${dataType}`);
                break;
        }

        this._buffers.concat(this._intToBytesBigEndian(num,bytesLen));
        
    }

    public readString():string{
        const dataType:EnumBufferType = this._getDataType();

        if(dataType !== EnumBufferType.STRING){

            console.error(`read string errro`);
            return "";
        }

        if(this._buffers.length < 4){
            console.error("string buffer length error");
            return ""
        }

        //**字符字节长度 */
        const bytesLen = this._bytesToIntBigEndian(this._buffers.splice(0,4));
        const strBuffer:number[] = this._buffers.splice(0,bytesLen);

        let result = '';
        for (var i = 0; i < strBuffer.length; ++i) {
              const byte = strBuffer[i];
              const text = byte.toString(16);
            result += (byte < 16 ? '%0' : '%') + text;
        }
        return decodeURIComponent(result);
    }



    private _writeDataType(dataType:EnumBufferType):void{
        this._buffers.concat(this._intToBytesBigEndian(dataType,1));
    }
    public writeString(str:string):void{


        //先写数据类型
        this._writeDataType(EnumBufferType.STRING);
        const surrogate:string = encodeURIComponent(str);
        const result:number[] = [];
        for (let i = 0; i < surrogate.length;) {
            const character = surrogate[i];
            i += 1;
            if (character == '%') {
                const hex = surrogate.substring(i, i += 2);
                if (hex) {
                    result.push(parseInt(hex, 16));
                }
            } else {
                result.push(character.charCodeAt(0));
            }
        }

        // 在写数据长度
        this._buffers.concat(this._intToBytesBigEndian(result.length,4));

        //最后写数据
        this._buffers.concat(result);
        
    }

    public writeArray(arr:any[]):void{
        // 先写入数组长度
        this.writeInt(arr.length,EnumBufferType.INT32);
        for (const it of arr) {
            this._buffers.concat(it.encode());
        }
    }

    public readBoolean():boolean{
        const dataType:EnumBufferType = this._getDataType();

        if(dataType != EnumBufferType.BOOLEAN){

            console.log(`read boolean failed`);
            return false;
        }
        const data:number = this._bytesToIntBigEndian(this._buffers.splice(0,1));
        return data === 1;
    }

    public writeBoolean(bool:boolean):void{

        // 先写数据类型
        this._writeDataType(EnumBufferType.BOOLEAN);
        // 再写数据
        this._buffers.concat(this._intToBytesBigEndian(bool ? 1 : 0,1));
    }


    /**
     * 获取数据类型
     *
     * @return {*}  {EnumBufferType}
     * @memberof FPBuffer
     */
    private _getDataType():EnumBufferType {
        const bytes:number[] = this._buffers.splice(0,1);
        return this._bytesToIntBigEndian(bytes);
    }
}