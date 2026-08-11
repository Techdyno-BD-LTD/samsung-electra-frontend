# Auction Implementation & Flow Guide

This guide compiles the frontend integration roadmap and backend process flow for the Samsung Electra Product Bidding/Auction feature.

---

## 1. Frontend Integration Guide (From Figma to API)

### A. Product Bidding Listing Page (Grid of Cards)
1. **Fetch the Products**:
   * Call `GET /api/v2/auction/products` using your `x-system-key`.
   * This API returns a list of items (`data`).
2. **Filtering Sidebar (Brands, Categories, Bid Status)**:
   * **Brands & Categories**: Filter the API results on the frontend based on the selected brand/category checkbox, or check if the API accepts query parameters (like `?brand=Samsung`).
   * **Bid Status (Live Bid vs. Upcoming)**:
     * Compare the current time on the user's browser with the product's `auction_start_date` and `auction_end_date` (represented as Unix timestamps in the API response, e.g., `1786258800`).
     * **Live Bid**: Current time is between `auction_start_date` and `auction_end_date`.
     * **Upcoming**: Current time is before `auction_start_date`.
3. **Displaying the Product Card**:
   * **Countdown Timer**: Write a JavaScript timer that runs every second, calculating the difference between the current time and the product's `auction_end_date`. Format this difference into **Days, Hours, Minutes, and Seconds**.
   * **Bid Stats**: Use `total_bids` from the API for the "Bids" counter, and display the `starting_bid` or `highest_bid`.
   * **CTA Button**:
     * If the auction is live, display a blue **"Place Bid"** button that links the user to the product's details page using its `slug` (e.g., `/auction-products/haier-washing-machine`).
     * If the auction has ended (current time is after `auction_end_date`), show a disabled red **"Close Bid"** button.

### B. Product Bidding Details Page
1. **Fetch Individual Product Details**:
   * Get the `slug` from the URL route (e.g. `haier-washing-machine`).
   * Call `GET /api/v2/auction/products/:slug` with your `x-system-key`.
2. **Handle Bid Form Logic**:
   * Show a text/number input box with the placeholder "Start your bid".
   * Show a **"Bid"** button.
   * **Validation checks before submitting**:
     * Ensure the user is logged in (you need their `CUSTOMER_TOKEN` for the bearer header). If not logged in, redirect them to the Login page.
     * Ensure the user's typed amount is greater than the current `highest_bid` (or `starting_bid` if no bids exist).
3. **Submit the Bid**:
   * When they click the "Bid" button, make a `POST /api/v2/auction/place-bid` call.
   * Send the system key header, the customer bearer token, and a JSON body containing:
     * `product_id`
     * `amount` (the input value)
   * **Handle the response**:
     * **On Success** (`result: true`): Show a success toast/message (e.g. "Bid placed!"), and refresh the page data to update the current `highest_bid` and the bid count on the screen.
     * **On Error** (`result: false`): Show the message returned by the API (e.g., "Bid amount must be greater than 1500") directly below the input field to guide the user.

---

## 2. Backend Bidding Flow & Requirements

### Requirements for Bidding
* **User Authentication is Required**: The endpoint uses `sanctumAuth` middleware. If a user is not logged in (i.e., they lack a valid Customer Bearer Token), the request is rejected immediately with an unauthorized status before it even hits the bidding logic.
* **Valid Request Data**: The client must provide a positive `product_id` and a bid `amount` strictly greater than `0`.
* **Auction Status Constraints**:
  * The product must have `auction_product: 1` and `published: 1` in the database.
  * The current time must be **after** `auction_start_date` and **before** `auction_end_date`.
* **Minimum Bid Amount Constraint**:
  * The bid amount must be strictly greater than both the product's `starting_bid` and the current highest bid recorded for that product.

### Full Process Flow (User to Backend)

1. **User Action**: The user enters an amount on the details page and clicks the "Bid" button.
2. **Frontend Call**: The frontend sends a `POST` request to `/api/v2/auction/place-bid` containing the `product_id` and `amount`, along with the `Authorization: Bearer CUSTOMER_TOKEN` header.
3. **Authentication Check (Backend)**:
   * The backend's authentication middleware intercepts the request.
   * It extracts the `userId` from the bearer token. If invalid/missing, it returns an unauthorized error.
4. **Data Validation**:
   * The backend verifies that the `product_id` exists, is configured for auctions, and is published.
   * It checks that the current server time falls inside the allowed bidding window.
5. **Bid Level Check**:
   * The database is queried for the current highest bid for that product.
   * The backend checks if the user's bid is higher than both the starting price and the current highest bid. If not, it returns a `422` error showing what the minimum acceptable bid is.
6. **Database Update/Creation**:
   * The backend checks if **this specific user** has already placed a bid on this product.
   * **If yes**: It updates their existing bid row to the new, higher amount.
   * **If no**: It creates a brand-new bid row for them.
7. **Email Notification (Outbidding)**:
   * If there was an existing highest bidder and that bidder is *not* the current user, the system retrieves their email address.
   * It fires an email to the outbid user informing them that they have been outbid and links them back to the product details page.
8. **Success Response**: The backend returns a `200 OK` status with the updated bid record.

---

## 3. Pending Checkout & Price Override (Future Scope)
> [!IMPORTANT]
> The checkout price override and automatic validation for auction winners are **not yet implemented in the backend**. 
> - **Checkout Price Override:** Currently, if a user checks out an auction product, it defaults to the standard retail `unit_price`. To complete the flow, backend checkout logic must be written to verify if the purchasing user is the actual winner of the auction, and dynamically override the checkout order price to match their winning bid amount.
