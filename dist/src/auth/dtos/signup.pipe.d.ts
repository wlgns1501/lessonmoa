import { PipeTransform } from '@nestjs/common';
import { SignUpDto } from './signup.dto';
export declare class SignUpPipe implements PipeTransform<SignUpDto> {
    transform(value: SignUpDto): any;
}
