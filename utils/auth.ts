export function getOAuthHeader(): string {
  //Builds OAuth 1.0 PLAINTEXT authorization header using sandbox credentials from environment variables.
  return `OAuth oauth_consumer_key="${process.env.CONSUMER_KEY}",
          oauth_token="${process.env.ACCESS_TOKEN}",
          oauth_signature_method="PLAINTEXT",
          oauth_signature="${process.env.CONSUMER_SECRET}&${process.env.TOKEN_SECRET}"`;
}