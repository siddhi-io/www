# Healthcheck APIs

-   [Updating a Siddhi Application](#SiddhiApplicationManagementAPIs-UpdatingaSiddhiApplication)

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
| Runtime                 | Worker                                                                                             |


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

<table>
<tbody>
<tr class="odd">
<td>HTTP Status Code</td>
<td><p>200 or 404</p>
<p>For descriptions of the HTTP status codes, see <a href="_HTTP_Status_Codes_">HTTP Status Codes</a> .</p></td>
</tr>
</tbody>
</table>
