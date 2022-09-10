import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('api/v1')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api/v1/health')
  getHealthCheck() {
    return {
      status: 'ok',
    };
  }
}
