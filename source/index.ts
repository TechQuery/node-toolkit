export {
    uniqueID,
    toRegExp,
    prettify,
    uglify,
    cache,
    hasItem,
    patch
} from './language';
import { toES_5 as compile, cache } from './language';
/**
 * @private
 */
export const toES_5 = cache(compile);

export * from './module';
export * from './file';
export * from './network';
export * from './console';
export * from './asset';
