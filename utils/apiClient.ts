import { APIRequestContext, request } from '@playwright/test';
import { getOAuthHeader } from './auth';

//Creates API context with base URL and OAuth header for authentication
export default async function createApiContext(): Promise<APIRequestContext> {
  return await request.newContext({
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      Authorization: getOAuthHeader(),
      Accept: 'application/json'
    }
  });
}