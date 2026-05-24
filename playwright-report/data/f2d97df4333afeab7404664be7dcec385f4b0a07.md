# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: watchlist.spec.ts >> Watchlist API >> add listing to watchlist
- Location: tests\watchlist.spec.ts:7:7

# Error details

```
TypeError: apiRequestContext.post: Invalid character in header content ["Authorization"]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import createApiContext from '../utils/apiClient';
  3  | import { testData } from '../utils/testData';
  4  | 
  5  | test.describe('Watchlist API', () => {
  6  |   //**Verify user can add listing to watchlist and retrieve it successfully - Positive Scenario**
  7  |   test('add listing to watchlist', async () => {
  8  |     const api = await createApiContext();
  9  |     //Add a valid listing to the user's watchlist and verify it's successfully added
> 10 |     const addResponse = await api.post(`/mytrademe/watchlist/${testData.validListingId}.json`);
     |                                   ^ TypeError: apiRequestContext.post: Invalid character in header content ["Authorization"]
  11 |     expect(addResponse.ok()).toBeTruthy();
  12 |     expect(addResponse.status()).toBe(200);
  13 |     console.log('Watchlist addition response status:', addResponse.status());
  14 | 
  15 |     //Verify retrieve the full watchlist after adding the listing and verify the 200 Succcess status code
  16 |     const watchlistResponse = await api.get('/mytrademe/watchlist/all.json');
  17 |     expect(watchlistResponse.status()).toBe(200);
  18 |     console.log('Watchlist retrieval response status:', watchlistResponse.status());
  19 | 
  20 |     //Verify the added listing exists in the returned watchlist data
  21 |     const body = await watchlistResponse.json();
  22 |     const found = body.List.some(
  23 |       (item: any) => item.ListingId === Number(testData.validListingId)
  24 |     );
  25 |     expect(found).toBeTruthy();
  26 |     console.log('Added listing found in watchlist:', found);
  27 |   });
  28 | 
  29 |   //**Verify edge case validation for watchlist retrieval with filters - Edge Case Scenario**
  30 |   test('filter watchlist', async () => {
  31 |     const api = await createApiContext();
  32 | 
  33 |     //Retrieve watchlist with filter applied (limit rows to 5)
  34 |     const response = await api.get('/mytrademe/watchlist/all.json?rows=5');
  35 |     //Verify API responds 200 successfully respond code and returns a watchlist with only 5 items or less
  36 |     expect(response.status()).toBe(200);
  37 |     const body = await response.json();
  38 |     expect(body.List.length).toBeLessThanOrEqual(5);
  39 |     console.log('Filtered watchlist response status:', response.status());
  40 |     console.log('Number of items in filtered watchlist:', body.List.length);
  41 |   });
  42 | 
  43 |   //**Verify user gets unauthorized error with invalid authentication when accessing watchlist - Authentication error handling**
  44 |   test('unauthorized access', async ({ request }) => {
  45 |     //Verify when accessing watchlist API with invalid authentication
  46 |     const response = await request.get(`${process.env.BASE_URL}/mytrademe/watchlist/all.json`);
  47 |     //Verify returns 401 Unauthorized status code
  48 |     expect([400, 401, 403]).toContain(response.status());
  49 |     console.log('Unauthorized access response status:', response.status());
  50 | 
  51 |     const body = await response.json().catch(() => null);
  52 |     //Verify body is not null and contains expected error properties
  53 |     expect(body).not.toBeNull();
  54 |     //Verify error response contains expected error message or code indicating listing not found
  55 |     if (body) {
  56 |       expect(body).toHaveProperty('ErrorDescription');
  57 |     }
  58 |     console.log('Response body:', await response.text());
  59 |   });
  60 | 
  61 | });
```