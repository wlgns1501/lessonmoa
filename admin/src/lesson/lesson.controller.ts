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
import { UpdateLessonPipe } from './dtos/update_lesson.pipe';
import { UpdateLessonDto } from './dtos/update_lesson.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@ApiTags('lesson')
@Controller('lesson')
export class LessonController {
  constructor(private readonly service: LessonService) {}

  @Get('')
  @ApiOperation({ summary: '레슨 리스트' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  getLessonsList(@Query(new GetLessonsPipe()) getLessonsDto: GetLessonsDto) {
    return this.service.getLessonsList(getLessonsDto);
  }

  @Get(':lessonId')
  @ApiOperation({ summary: '레슨 상세페이지' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  getLesson(@Param('lessonId') lessonId: number) {
    return this.service.getLesson(lessonId);
  }

  @Patch(':lessonId')
  @ApiOperation({ summary: '레슨 수정' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  updateLesson(
    @Param('lessonId') lessonId: number,
    @Body(new UpdateLessonPipe()) updateLessonDto: UpdateLessonDto,
  ) {
    return this.service.updateLesson(lessonId, updateLessonDto);
  }

  @Patch(':lessonId/canceled')
  @ApiOperation({ summary: '레슨 취소' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  updateLessonCanceled(@Param('lessonId') lessonId: number) {
    return this.service.updateLessonCanceled(lessonId);
  }
}
