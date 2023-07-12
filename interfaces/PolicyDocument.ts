export interface BaseIAMDocument {
    Version: string;
    Statement: IAMStatement[];
}

export interface IAMStatement {
    Effect: string;
    Action: string[];
    Resource: string;
}