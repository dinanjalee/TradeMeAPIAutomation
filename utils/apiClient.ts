import { APIRequestContext, request } from '@playwright/test';
import { getOAuthHeader } from '../utils/auth';

export default async function createApiContext() {
  return await request.newContext({
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  });
}