import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ description: 'content value', required: true })
  @IsString()
  public text!: string;

  @ApiProperty({ description: 'is completed value', required: true })
  @IsBoolean()
  public isCompleted!: boolean;
}

export class GetNoteById {
  @ApiProperty({ description: 'UUID', required: true })
  @IsUUID()
  public id!: string;
}
