import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('/verify/:token')
  @ApiOperation({
    summary:
      'Verifies users by tokens that were assigned to them after creation',
  })
  async verifyEmail(@Param('token') token: string): Promise<string> {
    const user = await this.userService.getUserByVerificationToken(token);

    if (!user) {
      throw new Error('Invalid verification token');
    }

    user.isVerified = true;
    user.verificationToken = null;

    await this.userService.verifyUser(user.id, user);

    return 'Email verified';
  }
}
