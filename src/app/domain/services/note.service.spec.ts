import { UpdateNoteDto } from './../dto/update-note.dto';
import { CreateNoteDto } from './../dto/create-note.dto';
import NoteService from './note.service';
import * as sinon from 'sinon';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import Note from '../entities/note.entity';
import { Repository } from 'typeorm';

describe('NoteService', () => {
  let noteService: NoteService;
  let sandbox: sinon.SinonSandbox;

  beforeAll(async () => {
    sandbox = sinon.createSandbox();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        {
          provide: getRepositoryToken(Note),
          useValue: sinon.createStubInstance(Repository),
        },
      ],
    }).compile();

    noteService = module.get<NoteService>(NoteService);
  });

  it('should call saveNote method with expected param', async () => {
    const createNodeSpy = jest.spyOn(noteService, 'saveNote');
    const dto = new CreateNoteDto();
    noteService.saveNote(dto);
    expect(createNodeSpy).toHaveBeenCalledWith(dto);
  });

  it('should call findOneNote method with expected param', async () => {
    const findOneNoteSpy = jest.spyOn(noteService, 'findOneNote');
    const findOneOptions = {};
    noteService.findOneNote(findOneOptions);
    expect(findOneNoteSpy).toHaveBeenCalledWith(findOneOptions);
  });

  it('should call updateNote method with expected params', async () => {
    const updateNoteSpy = jest.spyOn(noteService, 'updateNote');
    const noteId = '12345670';
    const dto = new UpdateNoteDto();

    noteService.updateNote(noteId, dto);
    expect(updateNoteSpy).toHaveBeenCalledWith(noteId, dto);
  });

  it('should call deleteNote method with expected param', async () => {
    const deleteNoteSpy = jest.spyOn(noteService, 'deleteNote');
    const noteId = '12345670';
    noteService.deleteNote(noteId);
    expect(deleteNoteSpy).toHaveBeenCalledWith(noteId);
  });

  afterAll(async () => {
    sandbox.restore();
  });
});
