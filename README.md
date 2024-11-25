# Bitespeed Backend Task: Identity Reconciliation

This repository implements a backend service for the **Identity Reconciliation** task. The service provides a mechanism to consolidate customer identities based on their email and phone number, ensuring seamless tracking of customer information across multiple purchases.

## Features

- **Consolidates customer contacts**:
  - Identifies and links contacts based on email or phone number.
  - Creates a "primary" contact while marking others as "secondary".
- **Handles Multiple Scenarios**:
  - Supports creating new contacts or linking existing ones.
  - Manages scenarios where only email, only phone number, or both are provided.
- **RESTful API**:
  - Offers an `/identify` endpoint to handle identity reconciliation requests.
- **JSON Responses**:
  - Provides a structured response, detailing the primary contact and associated secondary contacts.

## API Overview

### Endpoint: `/identify`

#### Request

Accepts a POST request with the following optional parameters:
- `email`: A string representing the customer's email address.
- `phoneNumber`: A string or number representing the customer's phone number.

Example Request Body:
```json
{
  "email": "example@domain.com",
  "phoneNumber": "1234567890"
}
```
#### Response
Returns a JSON object with consolidated contact details:

```json
Copy code
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["primary@domain.com", "secondary@domain.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": [2, 3]
  }
}
```
