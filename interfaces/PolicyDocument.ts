export interface BaseDocument {
    Version: string;
    Statement: object[];
}

export interface ActionDocument {
    Effect: string;
    Action: string | string[],
    Resource: string | string[]
}