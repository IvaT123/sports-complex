import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Controller()
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('/verify/:token')
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
