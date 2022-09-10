import { UpdateNoteDto } from './../dto/update-note.dto';
import { CreateNoteDto, GetNoteById } from './../dto/create-note.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import NoteService from '../services/note.service';

@Controller('api/v1/notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post('/')
  @ApiTags('notes')
  @ApiOperation({ description: 'Create a new note' })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  async saveNote(@Body() createDto: CreateNoteDto) {
    return await this.noteService.saveNote(createDto);
  }

  @Get('/')
  @ApiTags('notes')
  @ApiOperation({ description: 'Get all notes' })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async getAllNote() {
    return await this.noteService.findAllNotes({});
  }

  @Get('/:id')
  @ApiTags('notes')
  @ApiOperation({ description: 'Get one note by id' })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async getNoteById(@Param() dto: GetNoteById) {
    return await this.noteService.findOneNote({
      where: {
        id: dto.id,
      },
    });
  }

  @Patch('/:id')
  @ApiTags('notes')
  @ApiOperation({ description: 'Update note by id' })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async updateNoteById(
    @Param() param: GetNoteById,
    @Body() dto: UpdateNoteDto,
  ) {
    return await this.noteService.updateNote(param.id, dto);
  }

  @Delete('/:id')
  @ApiTags('notes')
  @ApiOperation({ description: 'Delete note by id' })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async deleteNodeById(@Param() param: GetNoteById) {
    return await this.noteService.deleteNote(param.id);
  }
}
