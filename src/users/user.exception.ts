export class UserException extends Error {

    static NICKNAME_EXIST_EXCEPTION : number = 1;
    
    constructor(public type : number) {
        super();
    }
}