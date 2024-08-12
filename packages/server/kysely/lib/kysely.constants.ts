import { Inject } from '@nestjs/common';

export const KYSELY_CONFIG = Symbol('KYSELY_CONFIG');
export const KYSELY_INSTANCE = Symbol('KYSELY_INSTANCE');
export const InjectKysely = () => Inject(KYSELY_INSTANCE);
