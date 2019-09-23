# Store APIs

-   [Query records in Siddhi store](#query-records-in-siddhi-store)

## Query records in Siddhi store

### Overview

|                         |                                                                                                    |
|-------------------------|----------------------------------------------------------------------------------------------------|
| Description             | Queries records in the Siddhi store. For more information, see Managing Stored Data via REST API . |
| API Context             | `             /stores/query            `                                                           |
| HTTP Method             | `             POST            `                                                                    |
| Request/Response Format | `             application/json            `                                                        |
| Authentication          | Basic                                                                                              |
| Username                | `             admin            `                                                                   |
| Password                | `             admin            `                                                                   |
| Runtime                 | Runner                                                                                             |

### curl command syntax

``` java
curl -X POST https://localhost:9443/stores/query -H "content-type: application/json" -u "admin:admin"  -d '{"appName" : "AggregationTest", "query" : "from stockAggregation select *" }' -k
```

### Sample curl command

``` java
curl -X POST https://localhost:9443/stores/query -H "content-type: application/json" -u "admin:admin" -d '{"appName" : "RoomService", "query" : "select 10 as roomNumber, 1 as arrival update RoomTypeTable  set RoomTypeTable.people = RoomTypeTable.people + arrival on RoomTypeTable.roomNo == roomNumber;" }' -k
```

### Sample output

``` java
```

### Response

|                         |                                                             |
|-------------------------|-------------------------------------------------------------|
| HTTP Status Code        | Possible codes are 200 and 404. <br/>For descriptions of the HTTP status codes, see [HTTP Status Codes](../http-status-code)                 |

