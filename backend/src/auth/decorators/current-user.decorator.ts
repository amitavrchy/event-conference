import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  company: string | null;
};

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: AuthUser }>();
    const user = request.user;
    if (!user) return undefined;
    return data ? user[data] : user;
  },
);
