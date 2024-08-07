import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, RefreshDto } from './auth.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Message } from '@/common/decorators/message.decorator';

@Controller({
  path: '/auth',
})
@ApiTags('auth'.toUpperCase())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiBody({ required: true, type: AuthDto })
  @ApiResponse({ status: 201, description: 'Authorize Employee' })
  @Message.Success({ message: 'Employee authorized', status: 201 })
  @Message.Error({ message: 'Invalid credentials', status: 401 })
  authorize(@Body() credentials: AuthDto) {
    return this.authService.authorize(credentials);
  }

  @Post('/refresh')
  @ApiBody({ required: true, type: RefreshDto })
  @ApiResponse({ status: 201, description: 'Refresh token' })
  @Message.Success({ message: 'Refresh success', status: 201 })
  @Message.Error({ message: 'Invalid credentials', status: 401 })
  refresh(@Body() credentials: RefreshDto) {
    return this.authService.refresh(credentials);
  }
}
