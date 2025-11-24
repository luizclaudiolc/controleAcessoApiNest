import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (response?.custom === true) return response;

        return {
          success: true,
          message: response?.message ?? 'Operação realizada com sucesso',
          data: response?.data ?? response,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
