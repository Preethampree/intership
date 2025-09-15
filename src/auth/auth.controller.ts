import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Query('role') role: string, @Req() req: any) {
    // Store role in session for later use
    if (req.session) {
      (req.session as any).role = role;
    }
    // Passport will handle the redirect to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: any,
    @Res() res: any,
  ) {
    try {
      const user = req.user as any;
      const role = (req.session as any)?.role || 'patient'; // Default to patient if no role specified
      
      // Find or create user in database
      const dbUser = await this.authService.findOrCreateUser(user, role);
      
      // Generate JWT token
      const token = await this.authService.generateJwtToken(dbUser);
      
      // Clear session
      if (req.session) {
        (req.session as any).role = undefined;
      }
      
      // Return JWT token and user info
      res.json({
        access_token: token,
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
          provider: dbUser.provider,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: 'Authentication failed',
        error: error.message,
      });
    }
  }
}
