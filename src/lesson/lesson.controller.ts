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
import { LessonService } from './lesson.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetLessonsPipe } from './dtos/get_lessons.pipe';
import { GetLessonsDto } from './dtos/get_lessons.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateLessonDto } from './dtos/create_lesson.dto';
import { CreateLessonPipe } from './dtos/create_lesson.pipe';
import { UpdateLessonPipe } from './dtos/update_lesson.pipe';
import { UpdateLessonDto } from './dtos/update_lesson.dto';

@ApiTags('lesson')
@Controller('lesson')
export class LessonController {
  constructor(private readonly service: LessonService) {}

  @Get('')
  @ApiOperation({ summary: '레슨 리스트' })
  @HttpCode(HttpStatus.OK)
  getLessonsList(@Query(new GetLessonsPipe()) getLessonsDto: GetLessonsDto) {
    return this.service.getLessonsList(getLessonsDto);
  }

  @Post('')
  @ApiOperation({ summary: '레슨 등록' })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  createLesson(
    @Body(new CreateLessonPipe()) createLessonDto: CreateLessonDto,
    @Req() req: any,
  ) {
    return this.service.createLesson(req.user, createLessonDto);
  }

  @Get(':lessonId')
  @ApiOperation({ summary: '레슨 상세페이지' })
  @HttpCode(HttpStatus.OK)
  getLesson(@Param('lessonId') lessonId: number) {
    return this.service.getLesson(lessonId);
  }

  @Patch(':lessonId')
  @ApiOperation({ summary: '레슨 수정' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  updateLesson(
    @Param('lessonId') lessonId: number,
    @Body(new UpdateLessonPipe()) updateLessonDto: UpdateLessonDto,
  ) {
    return this.service.updateLesson(lessonId, updateLessonDto);
  }

  @Post(':lessonId/apply')
  @ApiOperation({ summary: '레슨 등록' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  applyLesson(@Param('lessonId') lessonId: number, @Req() req: any) {
    return this.service.applyLesson(req.user, lessonId);
  }
}
