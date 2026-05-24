# Trade Me API Automation Challenge

## Tech Stack
- Playwright
- TypeScript
- OAuth Authentication

## Covered Scenarios

### Positive Tests
- Retrieve listing
- Add listing to watchlist
- Retrieve watchlist
- Filter watchlist

### Negative Tests
- Unauthorized access
- Invalid listing ID
- Invalid endpoint
- Invalid OAuth token

### Edge Cases
- Duplicate add attempts
- Large listing IDs
- Empty watchlists

---

## Setup

```bash
npm install
```

---

## Configure Environment

Add your:
- Consumer Key
- Consumer Secret
- Access Token
- Token Secret

---

## Run Tests

```bash
npx playwright test
```

---

## View Report

```bash
npx playwright show-report
```