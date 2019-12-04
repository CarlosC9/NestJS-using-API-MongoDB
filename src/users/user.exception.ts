export class UserException extends Error {

    static USERNAME_EXIST_EXCEPTION : number = 1;
    
    constructor(public type : number) {
        super();
    }
}