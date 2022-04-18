import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable
} from '@nestjs/common';
import { UsersService } from '../users.service';



@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {

  constructor(
    private userService: UsersService
  ) {

  }

  async intercept(context: ExecutionContext, next: CallHandler<any>) {

    const request = context.switchToHttp().getRequest();
    const { userId } = request.session;

    if (userId) {
      const user = await this.userService.findOne(userId);
      request.user = user;
    }

    return next.handle();
  }

}