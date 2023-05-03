import { HttpStatus } from '@nestjs/common';
export declare type ErrorDomain = 'users' | 'orders' | 'generic';
export declare class BusinessException extends Error {
    readonly domain: ErrorDomain;
    readonly message: string;
    readonly apiMessage: string | object;
    readonly status: HttpStatus;
    readonly id: string;
    readonly timestamp: Date;
    constructor(domain: ErrorDomain, message: string, apiMessage: string | object, status: HttpStatus);
    private static genId;
}
