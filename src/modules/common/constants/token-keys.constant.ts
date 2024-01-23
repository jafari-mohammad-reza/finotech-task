import { IRedisCacheKey } from 'src/share';

export const tokenIdKey = (identifier: string): IRedisCacheKey => ({
  name: `${identifier}-token-id`,
  ttl: 1800,
});
