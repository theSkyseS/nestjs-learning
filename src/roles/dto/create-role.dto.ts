import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: "Role's ID", example: '2' })
  readonly id: number;
  @ApiProperty({ description: "Role's Name", example: 'ADMIN' })
  readonly name: string;
}
