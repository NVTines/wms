import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

export class AuthDto {
  @ApiProperty({ type: String, required: true, default: 'M00001' })
  code: string;

  @ApiProperty({ type: String, required: true, default: '1234567' })
  // @Min(6)
  password: string;
}

export class RefreshDto {
  @ApiProperty({ type: String, required: true, default: 'abcdxyz' })
  refreshToken: string;

  @ApiProperty({ type: String, required: true, default: 'abcdxyz' })
  accessToken: string;
}
