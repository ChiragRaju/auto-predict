import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';


export class SerializeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        //Run Something before a request is handled by the request handler
        console.log('I am Running before Handler', context);
        return next.handle().pipe(map((data: any) => {
            //Run Something before the response is sent out
            console.log('I am Running before Response is Sent Out', data);
        
         }));
    }
}


