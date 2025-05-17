# FDX Core Transactions API For Offset to Page based Pagination Mapping Testing

Leverages the [Mock API For Page Based Pagination Testing](https://github.com/lbrenman/nodejs-express-mock-pagenum-pagesize-pagination-api) as the page based pagination API.

## To Run

* Clone Repo
* Run `npm install`
* Add .env file
  ```bash
  API_KEY=
  UPSTREAM_API_KEY=
  UPSTREAM_API_URL=
  DEFAULT_LIMIT=
  DEFAULT_OFFSET=
  PORT=
  ```
* Run `npm start`
* Make calls to the API

## Curl Commands

* Default offset and limit
```bash
curl -X GET "http://localhost:3000/accounts/33333/transactions" \
  -H "x-api-key: myoffsetapikey"
```

Response:

```json
{
  "page": {
    "nextOffset": "10",
    "total": 1000
  },
  "links": {
    "next": {
      "href": "/accounts/33333/transactions?offSet=10&limit=10"
    }
  },
  "transactions": [
    {
      "id": 1,
      "name": "Item 1"
    },
    {
      "id": 2,
      "name": "Item 2"
    },
    .
    .
    .
    {
      "id": 10,
      "name": "Item 10"
    }
  ]
}
```

* Custom offset and limit
```bash
curl -X GET "http://localhost:3000/accounts/33333/transactions?limit=10&offSet=10" \
-H "x-api-key: myoffsetapikey"
```

Response:

```json
{
  "page": {
    "nextOffset": "20",
    "total": 1000
  },
  "links": {
    "next": {
      "href": "/accounts/33333/transactions?offSet=20&limit=10"
    }
  },
  "transactions": [
    {
      "id": 11,
      "name": "Item 11"
    },
    {
      "id": 12,
      "name": "Item 12"
    },
    .
    .
    .
    {
      "id": 20,
      "name": "Item 20"
    }
  ]
}
```

* Exceeding offset and limit

```bash
curl -X GET "http://localhost:3000/accounts/33333/transactions?limit=10&offset=2000" \
  -H "x-api-key: myoffsetapikey"
```

Response:

```json
{
  "error": "Offset exceeds available data"
}
```