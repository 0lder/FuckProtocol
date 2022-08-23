export class BufferUtills {


    private static bytesToIntLittleEndian(bytes) {
        var val = 0;
        for (var i = bytes.length - 1; i >= 0; i--) {
            val += bytes[i];
            if (i != 0) {
                val = val << 8;
            }
        }
        return val;
    }

    // 小端
    private static intToBytesLittleEndian(num, length: number) {
        const bytes: number[] = [];
        let i = 0;
        do {
            bytes[i++] = num & (255);
            num = num >> 8;
        } while (i < length)
        return bytes;
    }



    // 大端

    private static intToBytesBigEndian(number: number, length: number) {
        const bytes: number[] = [];
        let i = length;
        do {
            bytes[--i] = number & (255);
            number = number >> 8;
        } while (i)
        return bytes;
    }



    private static bytesToIntBigEndian(bytes) {
        var val = 0;
        for (var i = 0; i < bytes.length; ++i) {
            val += bytes[i];
            if (i < bytes.length - 1) {
                val = val << 8;
            }
        }
        return val;


    }


    public static INT8_Encode(num: number, isBigEnd: boolean = false): number[] {
        if (isBigEnd) {
            return this.intToBytesBigEndian(num, 1);
        }
        else {
            return this.intToBytesLittleEndian(num, 1);
        }
    }


    public static INT16_Encode(num: number, isBigEnd: boolean = false): number[] {
        if (isBigEnd) {
            return this.intToBytesBigEndian(num, 2);
        }
        else {
            return this.intToBytesLittleEndian(num, 2);
        }
    }


    public static INT32_Encode(num: number, isBigEnd: boolean = false): number[] {
        if (isBigEnd) {
            return this.intToBytesBigEndian(num, 4);
        }
        else {
            return this.intToBytesLittleEndian(num, 4);
        }
    }


    public static INT64_Encode(num: number, isBigEnd: boolean = false): number[] {
        if (isBigEnd) {
            return this.intToBytesBigEndian(num, 8);
        }
        else {
            return this.intToBytesLittleEndian(num, 8);
        }
    }
    public static NUMBER_Decode(bytes: number[], isBigEnd: boolean = false): number {
        if (isBigEnd) {
            return this.bytesToIntBigEndian(bytes);
        }
        else {
            return this.bytesToIntLittleEndian(bytes);
        }
    }


    public static BOOLEAN_Decode(bytes: number[], isBigEnd: boolean): boolean {

        if (isBigEnd) {
            return this.bytesToIntBigEndian(bytes) == 1;
        }
        else {
            return this.bytesToIntLittleEndian(bytes) == 1;
        }
    }


    public static STRING_Encode(str: string): number[] {
        const bytes = new Array();
        let len, c;
        len = str.length;
        for (var i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            } else {
                bytes.push(c & 0xFF);
            }
        }
        // 计算字符长度
        const strLen: number = bytes.length;
        const lenBuffer: number[] = this.intToBytesBigEndian(strLen, 8);
        return lenBuffer.concat(bytes);
    }

    public static STRING_DECODE(bytes: number[]): string {
        if (typeof bytes === 'string') {
            return bytes;
        }
        
        // 先获取字符长度
        const strLenBuffer: number[] = bytes.splice(0, 8);
        const strLen: number = this.bytesToIntBigEndian(strLenBuffer);
        const strBuffer: number[] = bytes.splice(0, strLen);
        let str = '';
        for (let i = 0; i < strBuffer.length; i++) {
            let one = strBuffer[i].toString(2),
                v = one.match(/^1+?(?=0)/);
            if (v && one.length == 8) {
                let bytesLength = v[0].length;
                let store = strBuffer[i].toString(2).slice(7 - bytesLength);
                for (let st = 1; st < bytesLength; st++) {
                    store += strBuffer[st + i].toString(2).slice(2);
                }
                str += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            } else {
                str += String.fromCharCode(strBuffer[i]);
            }
        }
        return str;
    }
}

console.log(BufferUtills.INT8_Encode(2, true));