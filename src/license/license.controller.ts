import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LicenseService } from './license.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { LicenseDto } from './dtos/license.dto';
import { LicensePipe } from './dtos/license.pipe';

@ApiTags('License')
@Controller('license')
export class LicenseController {
  private service: LicenseService;

  @Post('')
  @ApiOperation({ summary: '라이센스 등록' })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async license(
    @Body(new LicensePipe()) licenseDto: LicenseDto,
    @Req() req: any,
  ) {
    return this.service.createLicense(req.user, licenseDto);
  }
}
