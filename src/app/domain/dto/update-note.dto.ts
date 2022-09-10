import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateNoteDto {
  @ApiProperty({ description: 'content value', required: true })
  @IsString()
  public text!: string;

  @ApiProperty({ description: 'is pompleted value', required: false })
  public isCompleted!: boolean;
}
