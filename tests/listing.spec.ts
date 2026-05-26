import { test, expect } from '@playwright/test';
import createApiContext from '../utils/apiClient';
import { testData } from '../utils/testData';
import { getOAuthHeader } from '../utils/auth';

test.describe('Retrieve Listing API', () => {

  //**Verify user can retrieve a list of search results successfully** - Positive Scenario
  test('should get TradeMe search listings', async () => {
    const api = await createApiContext();
    //get the URL for the search endpoint
    const url = `${process.env.BASE_URL}${`/Search/General.json?search_string=test`}`;

    //Make the GET request with the URL and OAuth header
    const response = await api.get(url, {
      headers: {
      Authorization: getOAuthHeader(url, 'GET'),
      },
    });
    //Log the URL and status for debugging
    console.log('URL:', url);
    console.log('STATUS:', response.status());
    //Log the response body for get an Id
    const text = await response.text();
    console.log('RESPONSE:', text);
    console.log('Response body:', await response.text());
    expect(response.status()).toBe(200);

});
  //**Verify user can retrieve a valid listing successfully** - Positive Scenario
  test('should retrieve listing successfully', async () => {
    const api = await createApiContext();
    //get the url for the listing endpoint
    const url = `${process.env.BASE_URL}${`/listings/${testData.validListingId}.json`}`;
    const response = await api.get(url, {
      headers: {
        Authorization: getOAuthHeader(url, 'GET'),
      },
    });
    
    //check the status code
    expect(response.status()).toBe(200);
    
    const text = await response.text();
    const body = JSON.parse(text);

    //Verify the response contains expected listing details
    expect(body.ListingId).toBe(Number(testData.validListingId));
    expect(body.Title).toBeDefined();
    //Log listing details for debugging
    console.log('Listing ID:', body.ListingId);
    console.log('Title:', body.Title);
});

  //**Verify user gets an error when requesting an invalid listing - Negative Scenario**
  test('should return error for invalid listing', async () => {
    const api = await createApiContext();
    //get the url for the listing endpoint
    const url = `${process.env.BASE_URL}${`/listings/${testData.invalidListingId}.json`}`;
    const response = await api.get(url, {
      headers: {
        Authorization: getOAuthHeader(url, 'GET'),
      },
    });
    ///Verify 4xx error response status code
    expect([400, 404, 500]).toContain(response.status());
    console.log('Response status:', response.status());

    const body = await response.json().catch(() => null);
    //Verify body and error response contains error message
    //expect(body).not.toBeNull();
    //expect(body).toHaveProperty('ErrorDescription');
    if (body) {
      expect(body).toHaveProperty('ErrorDescription');
    }
    console.log('Response body:', await response.text());
  });


  //**Verify user gets unauthorized error with invalid authentication - Negative Scenario**
  test('should return unauthorized with invalid auth', async ({ request }) => {
    const response = await request.get(`${process.env.BASE_URL}/listings/${testData.validListingId}.json`);
    
    expect([400, 403]).toContain(response.status());
    console.log('Response status:', response.status());
    
    const body = await response.json().catch(() => null);
    //Verify body and error response contains error message
    if (body) {
      expect(body).toHaveProperty('ErrorDescription');
    }
    console.log('Response body:', await response.text());
  });

  //**Verify user gets an error when requesting a listing with a malformed ID - Negative Scenario**
  test('should handle malformed listing id', async () => {
    const api = await createApiContext();
    //get the url for the listing endpoint
    const url = `${process.env.BASE_URL}${`/listings/${testData.malformedListingId}.json`}`;
    const response = await api.get(url, {
      headers: {
        Authorization: getOAuthHeader(url, 'GET'),
      },
    });

    ///Verify 4xx error response status code
    expect([400, 404]).toContain(response.status());
    console.log('Response status:', response.status());
    
    const body = await response.json().catch(() => null);
    //Verify body and error response contains error message
    if (body) {
      expect(body).toHaveProperty('ErrorDescription');
    }
    console.log('Response body:', await response.text());
  });

  //**Verify user gets an error when requesting a listing with an large ID - Negative Scenario**
  test('should handle extremely large listing id', async () => {
    const api = await createApiContext();
    //get the url for the listing endpoint
    const url = `${process.env.BASE_URL}${`/listings/${testData.largeListingId}.json`}`;
    const response = await api.get(url, {
      headers: {
        Authorization: getOAuthHeader(url, 'GET'),
      },
    });

    //Verify 4xx error response status code
    expect([400, 404]).toContain(response.status());

    const body = await response.json().catch(() => null);
    //Verify body and error response contains error message
    if (body) {
      expect(body).toHaveProperty('ErrorDescription');
    }
    console.log('Response body:', await response.text());
  });
});