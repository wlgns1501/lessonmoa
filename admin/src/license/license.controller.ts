import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LicenseService } from './license.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { getLicensesPipe } from './dtos/getLicenses.pipe';
import { GetLicensesDto } from './dtos/getLicensesDto';

@ApiTags('License')
@Controller('license')
export class LicenseController {
  constructor(private readonly service: LicenseService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '라이센스 리스트 불러오기' })
  @UseGuards(AdminGuard)
  async getLicenseList(
    @Query(new getLicensesPipe()) getLicensesDto: GetLicensesDto,
  ) {
    return this.service.getLicenseList(getLicensesDto);
  }

  @Get(':licenseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '라이센스 상세페이지' })
  @UseGuards(AdminGuard)
  async getLicense(@Param('licenseId') licenseId: number) {
    return this.service.getLicense(licenseId);
  }

  @Post(':licenseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '라이센스 인증하기' })
  @UseGuards(AdminGuard)
  async changeActiveLicense(@Param('licenseId') licenseId: number) {
    return this.service.changeActiveLicense(licenseId);
  }

  @Post(':licenseId/refused')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '라이센스 인증 거절하기' })
  @UseGuards(AdminGuard)
  async changeRefusedLicense(@Param('licenseId') licenseId: number) {
    return this.service.changeRefusedLicense(licenseId);
  }
}
