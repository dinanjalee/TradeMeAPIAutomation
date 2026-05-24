import { test, expect } from '@playwright/test';
import createApiContext from '../utils/apiClient';
import { testData } from '../utils/testData';

test.describe('Watchlist API', () => {
  //**Verify user can add listing to watchlist and retrieve it successfully - Positive Scenario**
  test('add listing to watchlist', async () => {
    const api = await createApiContext();
    //Add a valid listing to the user's watchlist and verify it's successfully added
    const addResponse = await api.post(`/mytrademe/watchlist/${testData.validListingId}.json`);
    expect(addResponse.ok()).toBeTruthy();
    expect(addResponse.status()).toBe(200);
    console.log('Watchlist addition response status:', addResponse.status());

    //Verify retrieve the full watchlist after adding the listing and verify the 200 Succcess status code
    const watchlistResponse = await api.get('/mytrademe/watchlist/all.json');
    expect(watchlistResponse.status()).toBe(200);
    console.log('Watchlist retrieval response status:', watchlistResponse.status());

    //Verify the added listing exists in the returned watchlist data
    const body = await watchlistResponse.json();
    const found = body.List.some(
      (item: any) => item.ListingId === Number(testData.validListingId)
    );
    expect(found).toBeTruthy();
    console.log('Added listing found in watchlist:', found);
  });

  //**Verify edge case validation for watchlist retrieval with filters - Edge Case Scenario**
  test('filter watchlist', async () => {
    const api = await createApiContext();

    //Retrieve watchlist with filter applied (limit rows to 5)
    const response = await api.get('/mytrademe/watchlist/all.json?rows=5');
    //Verify API responds 200 successfully respond code and returns a watchlist with only 5 items or less
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.List.length).toBeLessThanOrEqual(5);
    console.log('Filtered watchlist response status:', response.status());
    console.log('Number of items in filtered watchlist:', body.List.length);
  });

  //**Verify user gets unauthorized error with invalid authentication when accessing watchlist - Authentication error handling**
  test('unauthorized access', async ({ request }) => {
    //Verify when accessing watchlist API with invalid authentication
    const response = await request.get(`${process.env.BASE_URL}/mytrademe/watchlist/all.json`);
    //Verify returns 401 Unauthorized status code
    expect([400, 401, 403]).toContain(response.status());
    console.log('Unauthorized access response status:', response.status());

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