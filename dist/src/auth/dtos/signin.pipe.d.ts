import { PipeTransform } from '@nestjs/common';
import { SignInDto } from './signin.dto';
export declare class SignInPipe implements PipeTransform<SignInDto> {
    transform(value: SignInDto): any;
}
