import { SetMetadata } from '@nestjs/common';
import { Roles as _Roles } from '@prisma/client';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: _Roles[]) => SetMetadata(ROLES_KEY, roles);
