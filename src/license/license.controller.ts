import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LicenseService } from './license.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { createLicenseDto } from './dtos/createLicense.dto';
import { createLicensePipe } from './dtos/createLicense.pipe';
import { getLicensesPipe } from './dtos/getLicenses.pipe';
import { GetLicensesDto } from './dtos/getLicensesDto';
import { UpdateLicenseDto } from './dtos/updateLicense.dto';
import { UpdateLicensePipe } from './dtos/updateLicense.pipe';

@ApiTags('License')
@Controller('license')
export class LicenseController {
  constructor(private service: LicenseService) {}

  @Get('')
  @ApiOperation({ summary: '라이센스 리스트' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async getLicensesList(
    @Req() req: any,
    @Query(new getLicensesPipe()) getLicensesDto: GetLicensesDto,
  ) {
    return await this.service.getLicensesList(req.user, getLicensesDto);
  }

  @Post('')
  @ApiOperation({ summary: '라이센스 등록' })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async createLicense(
    @Req() req: any,
    @Body(new createLicensePipe()) createLicenseDto: createLicenseDto,
  ) {
    return this.service.createLicense(req.user, createLicenseDto);
  }

  @Get(':licenseId')
  @ApiOperation({ summary: '라이센스 상세페이지' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async getLicense(@Param('licenseId') licenseId: number, @Req() req: any) {
    return this.service.getLicense(licenseId, req.user);
  }

  @Patch(':licenseId')
  @ApiOperation({ summary: '라이센스 수정' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async updateLicense(
    @Param('licenseId') licenseId: number,
    @Body(new UpdateLicensePipe()) updateLicenseDto: UpdateLicenseDto,
    @Req() req: any,
  ) {
    return this.service.updateLicense(licenseId, updateLicenseDto, req.user);
  }

  @Post(':licenseId')
  @ApiOperation({ summary: '라이센스 삭제' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async deleteLicense(@Param('licenseId') licenseId: number, @Req() req: any) {
    return this.service.deleteLicense(licenseId, req.user);
  }
}
