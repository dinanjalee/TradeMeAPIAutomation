import { test, expect } from '@playwright/test';
import createApiContext from '../utils/apiClient';
import { testData } from '../utils/testData';
import { getOAuthHeader } from '../utils/auth';

test.describe('Watchlist API', () => {
  //**Verify user can add listing to watchlist successfully - Positive Scenario**
  test('add listing to watchlist', async () => {
    const api = await createApiContext();
    //post the listingId to add to the watchlist and verify the API responds with 200 Success status code
    const url = `${process.env.BASE_URL}${`/mytrademe/watchList/${testData.validListingId}.json`}`;
      const response = await api.post(url, {
        headers: {
          Authorization: getOAuthHeader(url, 'POST'),
        },
      });
    //verify 200 status for successfully added
    expect(response.status()).toBe(200);
    console.log('Watchlist addition response status:', response.status());
    console.log('Watchlist addition response body:', await response.text());
  });

  //**Verify retrieve the full watchlist after adding the listing and verify the added listing is present in the watchlist - Positive Scenario**
  test('check watchlist to get added listing', async() =>{
    const api = await createApiContext();
    const url = `${process.env.BASE_URL}${`/mytrademe/watchlist/all.json`}`;
      const watchlistResponse = await api.get(url, {
        headers: {
          Authorization: getOAuthHeader(url, 'GET'),
        },
      });
    expect(watchlistResponse.status()).toBe(200);
    console.log('Watchlist retrieval response status:', watchlistResponse.status());

    //Verify the added listing exists in the returned watchlist data
    const body = await watchlistResponse.json();
    const found = body.List.some(
      (item: any) => item.ListingId === Number(testData.validListingId)
    );
    expect(found).toBeTruthy();
    console.log('Added listing found in watchlist:', found);
  })
    

  //**Verify  watchlist retrieval with filters - Positive Scenario**
  test('filter watchlist', async () => {
    const api = await createApiContext();
    //Retrieve watchlist with filter applied (limit rows to 5)
    const url = `${process.env.BASE_URL}${`/mytrademe/watchlist/all.json?rows=5`}`;
      const response = await api.get(url, {
        headers: {
          Authorization: getOAuthHeader(url, 'GET'),
        },
      });
    //Verify API responds 200 successfully respond code and returns a watchlist with only 5 items or less
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.List.length).toBeLessThanOrEqual(5);
    console.log('Filtered watchlist response status:', response.status());
    console.log('Number of items in filtered watchlist:', body.List.length);
  });

  //**Verify user can remove listing from watchlist and verify it's removed successfully - Positive Scenario *
  test('remove listing from watchlist', async () => {
    const api = await createApiContext();
    //Remove listing from watchlist and verify API responds with 200 Success status code
    const url = `${process.env.BASE_URL}${`/mytrademe/watchList/${testData.validListingId}.json`}`;
      const response = await api.delete(url, {
        headers: {
          Authorization: getOAuthHeader(url, 'DELETE'),
        },
      });
    expect(response.status()).toBe(200);
    console.log('Watchlist removal response status:', response.status());

    //Verify the removed listing is not exist in the all watchlist data
    const urlWatchList = `${process.env.BASE_URL}${`/mytrademe/watchlist/all.json`}`;
      const watchlistResponse = await api.get(urlWatchList, {
        headers: {
          Authorization: getOAuthHeader(urlWatchList, 'GET'),
        },
      });
    expect(watchlistResponse.status()).toBe(200);
    const body = await watchlistResponse.json();
    const listingExists = body.List.some(
      (item: any) => item.ListingId === Number(testData.validListingId)
    );
    expect(listingExists).toBeFalsy();
    console.log('Removed listing found in watchlist:', listingExists);
  });

  //**Verify user cannot add invalid listing to watchlist and retrieve it successfully - Negative Scenario**
  test('add invalid listing to watchlist', async () => {
    const api = await createApiContext();
    //post the listingId to add to the watchlist and verify the API responds with 200 Success status code
    const url = `${process.env.BASE_URL}${`/mytrademe/watchList/${testData.invalidListingId}.json`}`;
      const response = await api.post(url, {
        headers: {
          Authorization: getOAuthHeader(url, 'POST'),
        },
      });
    //verify 400 status and error message for invalid listingId
    expect(response.status()).toBe(400);
    console.log('Watchlist addition response status:', response.status());
    console.log('Watchlist addition response body:', await response.text());
  });


});