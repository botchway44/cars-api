import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from 'src/users/dto/user.dto';


interface ClassConstructor {
  new(...args: any[]): {};
}

export function Serialize(dto: ClassConstructor ) {
  return UseInterceptors(new SerializeInterceptor(UserDTO))

}

export class SerializeInterceptor implements NestInterceptor {

  constructor(
    private dto: any
  ) {
    this.dto = dto;
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

    // console.log('Serializer interceptor running...', context);

    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        })
        // console.log("I am running before reponse", data);
      })
    )
  }

}