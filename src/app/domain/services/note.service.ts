import { UpdateNoteDto } from './../dto/update-note.dto';
import { CreateNoteDto } from './../dto/create-note.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as lodash from 'lodash';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import Note from '../entities/note.entity';

@Injectable()
export default class NoteService {
  constructor(
    @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
  ) {}

  async findAllNotes(findAllOptions: FindManyOptions<Note>) {
    return await this.noteRepository.find(findAllOptions);
  }

  async findOneNote(findOneOptions: FindOneOptions<Note>) {
    return await this.noteRepository.findOne(findOneOptions);
  }

  async saveNote(noteDto: CreateNoteDto) {
    const note = this.noteRepository.create(noteDto);
    return await this.noteRepository.save(note);
  }

  async updateNote(noteId: string, noteDto: UpdateNoteDto) {
    const noteFound = await this.findOneNote({
      where: { id: noteId },
    });
    return await this.noteRepository.save(lodash.merge(noteFound, noteDto));
  }

  async deleteNote(noteId: string) {
    const noteFound = await this.findOneNote({
      where: { id: noteId },
    });
    if (noteFound) {
      await this.noteRepository.delete(noteId);
      return noteFound;
    }

    return null;
  }
}
