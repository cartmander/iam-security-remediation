export interface BasePolicy {
    Version: string;
    Statement: Statement[];
}

export interface Statement {
    Effect: string;
    Action: string[];
    Resource: string;
}

export interface ServiceDictionary {
    [ServiceName: string]: string[];
}