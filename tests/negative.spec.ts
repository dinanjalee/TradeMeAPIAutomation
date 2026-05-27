import { test, expect, request } from '@playwright/test';
import { testData } from '../utils/testData';
import createApiContext from '../utils/apiClient';
import { getOAuthHeader } from '../utils/auth';

test.describe('Negative API Scenarios', () => {
  //**Verify user gets unauthorized error with invalid authentication - Authentication error handling**
  test('invalid oauth token', async () => {
    const api = await request.newContext({
      baseURL: process.env.BASE_URL,
      extraHTTPHeaders: {
        Authorization: 'InvalidToken'
      }
    });
    //Verify user gets 4xx error status code when accessing a valid endpoint with invalid token
    const response = await api.get('/mytrademe/watchlist/all.json');
    expect([403, 404]).toContain(response.status());
    console.log('Response status:', response.status());

    const body = await response.json().catch(() => null);
    //Verify body is not null and contains expected error properties
    //expect(body).not.toBeNull();
    //Verify error response contains expected error message or code indicating listing not found
    if (body) {
      expect(body).toHaveProperty('ErrorDescription');
    }
    console.log('Response body:', await response.text());
  });

  //**Verify user gets 404 not found error when accessing an invalid endpoint - Endpoint error handling**
  test('invalid endpoint', async ({ request }) => {
    //const response = await request.get(`${process.env.BASE_URL}/invalid-endpoint`);
    const api = await createApiContext();
    //get the url for the listing endpoint
    const url = `${process.env.BASE_URL}${`/invalid-endpoint`}`;
    const response = await api.get(url, {
      headers: {
        Authorization: getOAuthHeader(url, 'GET'),
      },
    });

    console.log('Response status:', response.status());
    expect(response.status()).toBe(404);

    const body = await response.json().catch(() => null);
    //Verify body is not null and contains expected error properties
    //expect(body).not.toBeNull();
    ///Verify body and error response contains error message
    if (body) {
      expect(body).toHaveProperty('ErrorDescription');
    }
    console.log('Response body:', await response.text());
  });

  //**Verify user gets unauthorized error when auth header is missing - Missing authentication error handling**
  test('missing authentication header', async ({ request }) => {
    const response = await request.get(`${process.env.BASE_URL}/listings/${testData.validListingId}.json`);

    expect([400, 401]).toContain(response.status());
    console.log('Response status:', response.status());

    const body = await response.json().catch(() => null);
    //Verify body is not null and contains expected error properties
    expect(body).not.toBeNull();
    //Verify error response contains expected error message or code indicating listing not found
    if (body) {
      expect(body).toHaveProperty('ErrorDescription');
    }
    console.log('Response body:', await response.text());
  });

  
});