export class DiagramException extends Error {

    static CANT_CAST_ID : number = 1;
    
    constructor(public type : number) {
        super();
    }
}