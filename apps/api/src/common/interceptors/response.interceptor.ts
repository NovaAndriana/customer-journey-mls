import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, StandardResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();

    return next.handle().pipe(
      map((result) => {
        const isPaginated =
          result && typeof result === 'object' && 'items' in result && 'meta' in result;

        return {
          success: true,
          statusCode: response.statusCode,
          message: result?.message ?? 'Request successful',
          data: isPaginated ? result.items : (result?.data ?? result ?? null),
          ...(isPaginated ? { meta: result.meta } : {}),
          timestamp: new Date().toISOString(),
          path: request.url,
        } as StandardResponse<T>;
      }),
    );
  }
}