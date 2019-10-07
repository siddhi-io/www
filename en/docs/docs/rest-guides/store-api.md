# Store APIs (Deprecated)

- [Query records in Siddhi store](#query-records-in-siddhi-store)

## Query records in Siddhi store

### Overview

Replaced with on-demand queries. Please check [here](on-demand-query-api.md) for more details.

|                         |                                                                                                    |
|-------------------------|----------------------------------------------------------------------------------------------------|
| Description             | Queries records in the Siddhi store. For more information, see Managing Stored Data via REST API . |
| API Context             | `/stores/query`                                                           |
| HTTP Method             | `POST`                                                                    |
| Request/Response Format | `application/json`                                                        |
| Authentication          | Basic                                                                                              |
| Username                | `admin`                                                                   |
| Password                | `admin`                                                                   |
| Runtime                 | Runner                                                                                             |

### curl command syntax

``` java
curl -X POST https://localhost:9443/stores/query -H "content-type: application/json" -u "admin:admin"  -d '{"appName" : "AggregationTest", "query" : "from stockAggregation select *" }' -k
```

### Sample curl command in runner distribution

``` java
curl -X POST https://localhost:9443/query -H "content-type: application/json" -u "admin:admin" -d '{"appName" : "ProductDetails", "query" : "from productTable select *" }' -k
```

### Sample curl command in tooling distribution

``` java
curl -X POST https://localhost:9743/query -H "content-type: application/json" -u "admin:admin" -d '{"appName" : "ProductDetails", "query" : "from productTable select *" }' -k
```

### Sample output

``` java
{
   "records": [
       [
           "ID234",
           "Chocolate"
       ],
       [
           "ID235",
           "Ice Cream"
       ]
   ]
}
```

### Response

|                         |                                                             |
|-------------------------|-------------------------------------------------------------|
| HTTP Status Code        | Possible codes are 200 and 404. <br/>For descriptions of the HTTP status codes, see [HTTP Status Codes](../http-status-code)                 |
