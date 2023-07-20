export interface BaseDocument {
    Version: string;
    Statement: Statement[];
}

export interface Statement {
    Effect: string;
    Action: string[];
    Resource: string;
}