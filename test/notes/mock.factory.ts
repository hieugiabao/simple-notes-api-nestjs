import { UpdateNoteDto } from './../../src/app/domain/dto/update-note.dto';
import { CreateNoteDto } from './../../src/app/domain/dto/create-note.dto';
export class MockFactory {
  genCreateNoteDto() {
    const createDto = new CreateNoteDto();
    createDto.text = 'For Testing';
    createDto.isCompleted = false;
    return createDto;
  }

  genUpdateNoteDto() {
    const updateDto = new UpdateNoteDto();
    updateDto.text = 'Update test';
    updateDto.isCompleted = true;
    return updateDto;
  }
}
