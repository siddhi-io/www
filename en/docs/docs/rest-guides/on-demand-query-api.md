# On-Demand Query APIs

-   [Query records through ad-hoc queries](#query-records-through-ad-hoc-queries)

## Query records through ad-hoc queries

### Overview

On-demand queries provide a way of performing add hock operations on Siddhi tables (stores), named-windows, and named-aggregations.

|                         |                                                                                                    |
|-------------------------|----------------------------------------------------------------------------------------------------|
| Description             | Queries records in the Siddhi stores, named windows and named aggregations.                         |
| API Context             | `             /query            `                                                                  |
| HTTP Method             | `             POST            `                                                                    |
| Request/Response Format | `             application/json            `                                                        |
| Authentication          | Basic                                                                                              |
| Username                | `             admin            `                                                                   |
| Password                | `             admin            `                                                                   |
| Runtime                 | Runner                                                                                             |

### curl command syntax

``` java
curl -X POST https://localhost:9443/query -H "content-type: application/json" -u "admin:admin"  -d '{"appName" : "AggregationTest", "query" : "from stockAggregation select *" }' -k
```

### Sample curl command

``` java
curl -X POST https://localhost:9443/query -H "content-type: application/json" -u "admin:admin" -d '{"appName" : "ProductDetails", "query" : "from productTable select *" }' -k
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

