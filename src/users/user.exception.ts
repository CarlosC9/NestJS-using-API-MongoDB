export class UserException extends Error {

    static NICKNAME_EXIST_EXCEPTION : number = 1;
    static CANT_CAST_ID : number = 2;
    
    constructor(public type : number) {
        super();
    }
}