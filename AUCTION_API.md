# Auction API

Base URL:

```text
https://your-domain.com/api/v2
```

Most `/api/v2` routes require the system key when `REQUIRE_SYSTEM_KEY=1`.

Use one of these headers:

```http
x-system-key: YOUR_API_SYSTEM_KEY
```

or:

```http
x-api-key: YOUR_API_SYSTEM_KEY
```

Authenticated auction routes also require customer bearer token:

```http
Authorization: Bearer CUSTOMER_TOKEN
```

## List Auction Products

```http
GET /api/v2/auction/products
```

Example:

```bash
curl -X GET "https://your-domain.com/api/v2/auction/products" \
  -H "x-system-key: YOUR_API_SYSTEM_KEY"
```

Response:

```json
{
  "data": [
    {
      "id": 101,
      "name": "Auction Product",
      "slug": "auction-product",
      "thumbnail_img": "https://your-domain.com/public/uploads/all/image.jpg",
      "unit_price": 5000,
      "starting_bid": 1000,
      "auction_start_date": 1786258800,
      "auction_end_date": 1786345200,
      "highest_bid": 1500,
      "total_bids": 3
    }
  ],
  "success": true,
  "status": 200
}
```

## Auction Product Details

```http
GET /api/v2/auction/products/:slug
```

Example:

```bash
curl -X GET "https://your-domain.com/api/v2/auction/products/auction-product" \
  -H "x-system-key: YOUR_API_SYSTEM_KEY"
```

Response:

```json
{
  "data": [
    {
      "id": 101,
      "name": "Auction Product",
      "slug": "auction-product",
      "unit_price": 5000,
      "starting_bid": 1000,
      "auction_start_date": 1786258800,
      "auction_end_date": 1786345200,
      "auction_product": 1,
      "highest_bid": 1500,
      "total_bids": 3
    }
  ],
  "success": true,
  "status": 200
}
```

## Place Bid

```http
POST /api/v2/auction/place-bid
```

Required:

```json
{
  "product_id": 101,
  "amount": 1600
}
```

Example:

```bash
curl -X POST "https://your-domain.com/api/v2/auction/place-bid" \
  -H "x-system-key: YOUR_API_SYSTEM_KEY" \
  -H "Authorization: Bearer CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"product_id\":101,\"amount\":1600}"
```

Success response:

```json
{
  "result": true,
  "message": "Bid placed",
  "data": {
    "id": 55,
    "product_id": 101,
    "user_id": 22,
    "amount": 1600,
    "created_at": "2026-08-09T07:25:00.000Z",
    "updated_at": "2026-08-09T07:25:00.000Z"
  }
}
```

Validation errors:

```json
{
  "result": false,
  "message": "Bid amount must be greater than 1500",
  "minimum_bid": 1500
}
```

Other possible messages:

```text
Unauthenticated.
Invalid or missing system key.
Invalid bid data
Auction product not found
Auction date is not configured
Auction has not started yet
Auction has ended
```

## Bid Rules

- Product must be an auction product.
- Product must be published.
- Current time must be between `auction_start_date` and `auction_end_date`.
- Bid amount must be greater than both `starting_bid` and current highest bid.
- One user has one active bid row per product. If the same user bids again, their previous bid is updated.
- When a user outbids the current highest bidder, the previous highest bidder receives an email if SMTP is configured.

## Admin Routes

Admin panel:

```text
/admin/auction-products
/admin/auction-products/create
/admin/auction-products/:id/edit
/admin/auction-products/:id/bids
/admin/auction-product-orders
```

Admin behavior:

- Create/edit/delete auction products.
- Filter by all, inhouse, seller, and user.
- Started auction products cannot be edited.
- View/delete bids.
- View auction product orders separately.

## Production Migration In Coolify

The app now runs Prisma migrations automatically before production start:

```json
"prestart": "npm run db:migrate && npm run build",
"db:migrate": "prisma migrate deploy"
```

Coolify normally runs:

```bash
npm install
npm start
```

Before `npm start`, npm automatically runs `prestart`, so this will happen:

```bash
npm run db:migrate
npm run build
node dist/index.js
```

Requirements on Coolify:

- `DATABASE_URL` must be set and reachable during deploy/start.
- The MySQL user must have permission to create/alter tables and create indexes.
- The migration folder must be pushed:

```text
prisma/migrations/20260809071900_add_auction_products/migration.sql
```

Manual fallback SQL:

```text
docs/sql/add_auction_products.sql
```
