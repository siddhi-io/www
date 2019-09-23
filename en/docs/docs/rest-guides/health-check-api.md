# Health Check APIs

-   [Fetch Health status of the Siddhi Runner](#fetch-health-status-of-the-siddhi-runner)

## Fetch Health status of the Siddhi Runner

### Overview

|                         |                                                                                                    |
|-------------------------|----------------------------------------------------------------------------------------------------|
| Description             | Fetches the health status of the Siddhi Runner.                                                    |
| API Context             | `             /health            `                                                                 |
| HTTP Method             | `             GET            `                                                                     |
| Request/Response Format | `             application/json            `                                                        |
| Authentication          | Not Required                                                                                       |
| Username                | N/A                                                                                                |
| Password                | N/A                                                                                                |
| Runtime                 | Runner                                                                                             |


### curl command syntax

``` java
curl -k -X GET http://localhost:9090/health
```
 
### Sample curl command

``` java
curl -k -X GET http://localhost:9090/health
```

### Sample output

``` java
{"status":"healthy"}
```

### Response

|                         |                                                             |
|-------------------------|-------------------------------------------------------------|
| HTTP Status Code        | Possible codes are 200 and 404. <br/>For descriptions of the HTTP status codes, see [HTTP Status Codes](../http-status-code)                 |

