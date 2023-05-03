import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { ErrorDomain } from './business-exception-filter';
export interface ApiError {
    id: string;
    domain: ErrorDomain;
    message: string | object;
    timestamp: Date;
}
export declare class CustomExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: Error, host: ArgumentsHost): void;
}
