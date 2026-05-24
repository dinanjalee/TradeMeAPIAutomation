import { test, expect } from '@playwright/test';
import createApiContext from '../utils/apiClient';
import { testData } from '../utils/testData';

test.describe('Retrieve Listing API', () => {
  //**Verify user can retrieve a valid listing successfully** - Positive Scenario
  test('should retrieve listing successfully', async () => {
    const api = await createApiContext();
    const response = await api.get(`/listings/${testData.validListingId}.json`);

    ///Verify response status is 200 Succcess status code
    expect(response.status()).toBe(200);
    console.log('Response status:', response.status());

    ///Verify response body contains expected properties and values for the listing
    const body = await response.json();
    expect(body).toHaveProperty('ListingId');
    expect(body).toHaveProperty('Title');
    expect(body.ListingId).toBe(Number(testData.validListingId));
    expect(body.Title).not.toBe('');
    console.log('Response body:', await response.text());
  });

  //**Verify user gets an error when requesting an invalid listing - Negative Scenario**
  test('should return error for invalid listing', async () => {
    const api = await createApiContext();
    const response = await api.get(`/listings/${testData.invalidListingId}.json`);
    ///Verify 4xx error response status code
    expect([400, 404]).toContain(response.status());
    console.log('Response status:', response.status());

    const body = await response.json().catch(() => null);
    //Verify body is not null and contains expected error properties
    expect(body).not.toBeNull();
    //Verify error response contains expected message or code indicating listing not found
    expect(body).toHaveProperty('ErrorDescription');
    console.log('Response body:', await response.text());
  });


  //**Verify user gets unauthorized error with invalid authentication - Negative Scenario**
  test('should return unauthorized with invalid auth', async ({ request }) => {
    const response = await request.get(`${process.env.BASE_URL}/listings/${testData.validListingId}.json`);
    expect([400, 403]).toContain(response.status());
    console.log('Response status:', response.status());
    
    const body = await response.json().catch(() => null);
    //Verify body is not null and contains expected error properties
    expect(body).not.toBeNull();
    //Verify error response contains expected message or code indicating listing not found
    expect(body).toHaveProperty('ErrorDescription');
    console.log('Response body:', await response.text());
  });

  //**Verify user gets an error when requesting a listing with a malformed ID - Negative Scenario**
  test('should handle malformed listing id', async () => {
    const api = await createApiContext();
    const response = await api.get(`/listings/${testData.malformedListingId}.json`);

    ///Verify 4xx error response status code
    expect([400, 404]).toContain(response.status());
    console.log('Response status:', response.status());
    
    const body = await response.json().catch(() => null);
    //Verify body is not null and contains expected error properties
    expect(body).not.toBeNull();
    //Verify error response contains expected message or code indicating listing not found
    expect(body).toHaveProperty('ErrorDescription');
    console.log('Response body:', await response.text());
  });

  //**Verify user gets an error when requesting a listing with an extremely large ID - Negative Scenario**
  test('should handle extremely large listing id', async () => {
    const api = await createApiContext();
    const response = await api.get(`/listngs/${testData.largeListingId}.json`);

    //Verify 4xx error response status code
    expect([400, 404]).toContain(response.status());

    const body = await response.json().catch(() => null);
    //Verify body is not null and contains expected error properties
    expect(body).not.toBeNull();
    //Verify error response contains expected message or code indicating listing not found
    expect(body).toHaveProperty('ErrorDescription');
    console.log('Response body:', await response.text());
  });
});