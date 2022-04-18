
import {
  createParamDecorator,
  ExecutionContext
} from '@nestjs/common'
import { User } from '../user.entity';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as User;
  }
)