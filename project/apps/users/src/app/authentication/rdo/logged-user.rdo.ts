import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoggedUserRdo {

  @ApiProperty({
    description: 'Access token',
    example: 'fsdfsd65fd6s5fsd6fsd6sljkasjf'
  })
  @Expose()
  public accessToken: string;

  @ApiProperty({
    description: 'Refresh token',
    example: 'fsdfsd65fd6s5fsd6fsd6sljkasjf'
  })
  @Expose()
  public refreshToken: string;
}
