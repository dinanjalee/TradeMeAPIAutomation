/*export function getOAuthHeader(): string {
  return `OAuth oauth_consumer_key="${process.env.CONSUMER_KEY}",oauth_token="${process.env.ACCESS_TOKEN}",oauth_signature_method="PLAINTEXT",oauth_signature="${process.env.CONSUMER_SECRET}&${process.env.TOKEN_SECRET}"`;  
}*/

import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

export function getOAuthHeader(url: string, method: 'GET' | 'POST') {
  const oauth = new OAuth({
    consumer: {
      key: process.env.CONSUMER_KEY!,
      secret: process.env.CONSUMER_SECRET!,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    },
  });

  const request_data = { url, method };

  const token = {
    key: process.env.ACCESS_TOKEN!,
    secret: process.env.TOKEN_SECRET!,
  };

  return oauth.toHeader(oauth.authorize(request_data, token)).Authorization;
}