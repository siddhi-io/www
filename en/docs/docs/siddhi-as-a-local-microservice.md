# Siddhi 5.1 as a Local Microservice

This section provides information on running [Siddhi Apps](../introduction/#siddhi-application) on Bare Metal or VM. 

Siddhi Microservice can run one or more Siddhi Applications with required system configurations.
Here, the Siddhi application (`.siddhi` file) contains stream processing logic and the necessary system configurations can be passed via the Siddhi configuration `.yaml` file. 

Steps to Run Siddhi Local Microservice is as follows.

* Download the latest [Siddhi Runner distribution](https://github.com/siddhi-io/distribution/releases/download/v5.1.0-alpha/siddhi-runner-5.1.0-alpha.zip) 
* Unzip the siddhi-runner-x.x.x.zip
* Start SiddhiApps with the runner config by executing the following commands from the distribution directory<br/>
  Linux/Mac : `./bin/runner.sh -Dapps=<siddhi-file> -Dconfig=<config-yaml-file>`<br/>
  Windows : `bin\runner.bat -Dapps=<siddhi-file> -Dconfig=<config-yaml-file>`

!!! Tip "Running Multiple SiddhiApps in one runner."
    To run multiple SiddhiApps in one runtime, have all SiddhiApps in a directory and pass its location through `-Dapps` parameter as follows,<br/>
    `-Dapps=<siddhi-apps-directory>`

!!! Note "Always use **absolute path** for SiddhiApps and runner configs."
    Providing absolute path of SiddhiApp file, or directory in `-Dapps` parameter, and when providing the Siddhi runner config yaml on `-Dconfig` parameter while starting Siddhi runner.

!!! Tip "Siddhi Tooling"
    You can also use the powerful [Siddhi Editor](../../quckstart/#3-using-siddhi-for-the-first-time) to implement and test steam processing applications. 

!!! Info "Configuring Siddhi"
    To configure databases, extensions, authentication, periodic state persistence, and statistics for Siddhi as Local Microservice refer [Siddhi Config Guide](../config-guide/). 

## Samples

### Running Siddhi App

Following SiddhiApp collects events via HTTP and logs the number of events arrived during last 15 seconds.  

```sql
@App:name('CountOverTime')
@App:description('Receive events via HTTP, and logs the number of events received during last 15 seconds')

@source(type = 'http', receiver.url = "http://0.0.0.0:8006/production",
	@map(type = 'json'))
define stream ProductionStream (name string, amount double);

@sink(type = 'log')
define stream TotalCountStream (totalCount long);

-- Count the incoming events
@info(name = 'query1')
from ProductionStream#window.time(15 sec)
select count() as totalCount 
insert into TotalCountStream;
```

* Copy the above SiddhiApp, and create the SiddhiApp file `CountOverTime.siddhi`

* Run the SiddhiApp by executing following commands from the distribution directory
  * Linux/Mac :
  
    ```console
    ./bin/runner.sh -Dapps=<absolute-siddhi-file-path>/CountOverTime.siddhi
    ```

  * Windows :

      ```console
      bin\runner.bat -Dapps=<absolute-siddhi-file-path>\CountOverTime.siddhi
      ```

* Test the SiddhiApp by calling the HTTP endpoint using curl or Postman as follows,
  * Publish events with curl command:

    ```console
    curl -X POST http://localhost:8006/production \
    -header "Content-Type:application/json" \
    -d '{"event":{"name":"Cake","amount":20.12}}'
    ```

  * Publish events with Postman:
    * Install 'Postman' application from Chrome web store
    * Launch the application
    * Make a 'Post' request to 'http://localhost:8006/production' endpoint. Set the Content-Type to <code>'application/json'</code> and set the request body in json format as follows,
  
      ```json
      {
        "event": {
        "name": "Cake",
        "amount": 20.12
        }
      }
      ```

* Runner logs the total count on the console. Note, how the count increments with every event sent.

```console
[2019-04-11 13:36:03,517]  INFO {io.siddhi.core.stream.output.sink.LogSink} - CountOverTime : TotalCountStream : Event{timestamp=1554969963512, data=[1], isExpired=false}
[2019-04-11 13:36:10,267]  INFO {io.siddhi.core.stream.output.sink.LogSink} - CountOverTime : TotalCountStream : Event{timestamp=1554969970267, data=[2], isExpired=false}
[2019-04-11 13:36:41,694]  INFO {io.siddhi.core.stream.output.sink.LogSink} - CountOverTime : TotalCountStream : Event{timestamp=1554970001694, data=[1], isExpired=false}
```

### Running with runner config
When running SiddhiApps users can optionally provide a config yaml to Siddhi runner to manage configurations such as state persistence, databases connections and secure vault.

Following SiddhiApp collects events via HTTP and store them in H2 Database.

```sql
@App:name("ConsumeAndStore")
@App:description("Consume events from HTTP and write to TEST_DB")

@source(type = 'http', receiver.url = "http://0.0.0.0:8006/production",
	@map(type = 'json'))
define stream ProductionStream (name string, amount double);

@store(type='rdbms', datasource='TEST_DB')
define table ProductionTable (name string, amount double);

-- Store all events to the table
@info(name = 'query1')
from ProductionStream
insert into ProductionTable;
```

The runner config can by configured with the relevant datasource information and passed when starting the runner

```yaml
dataSources:
  - name: TEST_DB
    description: The datasource used for testing
    definition:
      type: RDBMS
      configuration:
        jdbcUrl: 'jdbc:h2:${sys:carbon.home}/wso2/${sys:wso2.runtime}/database/TEST_DB;DB_CLOSE_ON_EXIT=FALSE;LOCK_TIMEOUT=60000'
        username: admin
        password: admin
        driverClassName: org.h2.Driver
        maxPoolSize: 10
        idleTimeout: 60000
        connectionTestQuery: SELECT 1
        validationTimeout: 30000
        isAutoCommit: false
```

<ul>
    <li>Copy the above SiddhiApp, & config yaml, and create corresponding the SiddhiApp file <code>ConsumeAndStore.siddhi</code> and <code>TestDb.yaml</code> files.</li>
    <li>Run the SiddhiApp by executing following commands from the distribution directory
        <ul>
            <li>Linux/Mac :
            <pre style="white-space:pre-wrap;">./bin/runner.sh -Dapps=&lt;absolute-siddhi-file-path&gt;/ConsumeAndStore.siddhi \
  -Dconfig=&lt;absolute-config-yaml-path&gt;/TestDb.yaml</pre>
            </li>
            <li>Windows :
            <pre style="white-space:pre-wrap;">bin\runner.sh -Dapps=&lt;absolute-siddhi-file-path&gt;\ConsumeAndStore.siddhi ^
  -Dconfig=&lt;absolute-config-yaml-path&gt;\TestDb.yaml</pre>
            </li>
        </ul>
    </li>
    <li>Add data to H2 Database by calling the Siddhi Input stream HTTP endpoint
        <ul>
            <li><b>Publish events with curl command:</b><br/>
            Publish few json to the http endpoint as follows,
<pre style="white-space:pre-wrap;">
curl -X POST http://localhost:8006/production \
  --header "Content-Type:application/json" \
  -d '{"event":{"name":"Cake","amount":20.12}}'
</pre>
            </li>
            <li><b>Publish events with Postman:</b>
              <ol>
                <li>Install 'Postman' application from Chrome web store</li>
                <li>Launch the application</li>
                <li>Make a 'Post' request to 'http://localhost:8006/production' endpoint. Set the Content-Type to <code>'application/json'</code> and set the request body in json format as follows,
<pre>
{
  "event": {
    "name": "Cake",
    "amount": 20.12
  }
}</pre>
                </li>
              </ol>
            </li>
        </ul>
    </li>
    <li>Query Siddhi Store APIs to retrieve 10 records from the table.
        <ul>
            <li><b>Query stored events with curl command:</b><br/>
            Publish few json to the http endpoint as follows,
<pre style="white-space:pre-wrap;">
curl -X POST https://localhost:9443/stores/query \
  -H "content-type: application/json" \
  -u "admin:admin" \
  -d '{"appName" : "ConsumeAndStore", "query" : "from ProductionTable select * limit 10;" }' -k
</pre>
            </li>
            <li><b>Query stored events with Postman:</b>
              <ol>
                <li>Install 'Postman' application from Chrome web store</li>
                <li>Launch the application</li>
                <li>Make a 'Post' request to 'https://localhost:9443/stores/query' endpoint. Set the Content-Type to <code>'application/json'</code> and set the request body in json format as follows,
<pre>
{
  "appName" : "ConsumeAndStore",
  "query" : "from ProductionTable select * limit 10;"
}</pre>
                </li>
              </ol>
            </li>
        </ul>
    </li>
    <li>The results of the query will be as follows,
<pre style="white-space:pre-wrap;">
{
  "records":[
    ["Cake",20.12]
  ]
}</pre>
    </li>
</ul>

### Running with environmental/system variables
Templating SiddhiApps allows users to provide environment/system variables to siddhiApps at runtime. This can help users to migrate SiddhiApps from one environment to another (E.g from dev, test and to prod).

Following templated SiddhiApp collects events via HTTP, filters them based on `amount` greater than a given threshold value, and only sends the filtered events via email.

Here the `THRESHOLD` value, and `TO_EMAIL` are templated in the `TemplatedFilterAndEmail.siddhi` SiddhiApp.

```sql
@App:name("TemplatedFilterAndEmail")
@App:description("Consumes events from HTTP, filters them based on amount greater than a templated threshold value, and sends filtered events via email.")

@source(type = 'http', receiver.url = "http://0.0.0.0:8006/production",
	@map(type = 'json'))
define stream ProductionStream (name string, amount double);

@sink(ref = 'email-sink', subject = 'High {{name}} production!', to = '${TO_EMAIL}', content.type = 'text/html',
	@map(type = 'text',
		@payload("""
			Hi, <br/><br/>
			High production of <b>{{name}},</b> with amount <b>{{amount}}</b> identified. <br/><br/>
			For more information please contact production department.<br/><br/>
			Thank you""")))
define stream  FilteredProductionStream (name string, amount double);

-- Filters the events based on threshold 
@info(name = 'query1')
from ProductionStream[amount > ${THRESHOLD}]
insert into FilteredProductionStream;
```

The runner config is configured with a gmail account to send email messages in `EmailConfig.yaml` by templating sending `EMAIL_ADDRESS`, `EMAIL_USERNAME` and `EMAIL_PASSWORD`.   

```yaml
refs:
  -
    ref:
      name: 'email-sink'
      type: 'email'
      properties:
        port: '465'
        host: 'smtp.gmail.com'
        ssl.enable: 'true'
        auth: 'true'
        ssl.enable: 'true'
        # User your gmail configurations here
        address: '${EMAIL_ADDRESS}'   #E.g. test@gmail.com
        username: '${EMAIL_USERNAME}' #E.g. test
        password: '${EMAIL_PASSWORD}' #E.g. password
```

<ul>
    <li>Copy the above SiddhiApp, & config yaml, and create corresponding the SiddhiApp file <code>TemplatedFilterAndEmail.siddhi</code> and <code>EmailConfig.yaml</code> files.</li>
    
    <li>Set environment variables by running following in the termial Siddhi is about to run: 
         <pre style="white-space:pre-wrap;">
export THRESHOLD=20
export TO_EMAIL=&lt;to email address&gt; 
export EMAIL_ADDRESS=&lt;gmail address&gt;
export EMAIL_USERNAME=&lt;gmail username&gt;
export EMAIL_PASSWORD=&lt;gmail password&gt;</pre>
        Or they can also be passed as system variables by adding 
        <pre style="white-space:pre-wrap;">-DTHRESHOLD=20 -DTO_EMAIL=&gt;to email address&gt; -DEMAIL_ADDRESS=&lt;gmail address&gt; 
 -DEMAIL_USERNAME=&lt;gmail username&gt; -DEMAIL_PASSWORD=&lt;gmail password&gt;</pre>
        to the end of the runner startup script.
    </li>
        <li>Run the SiddhiApp by executing following commands from the distribution directory
        <ul>
            <li>Linux/Mac :
            <pre style="white-space:pre-wrap;">
./bin/runner.sh -Dapps=&lt;absolute-file-path&gt;/TemplatedFilterAndEmail.siddhi \
  -Dconfig=&lt;absolute-config-yaml-path&gt;/EmailConfig.yaml</pre>
            </li>
            <li>Windows :
            <pre style="white-space:pre-wrap;">
bin\runner.bat -Dapps=&lt;absolute-file-path&gt;\TemplatedFilterAndEmail.siddhi ^
  -Dconfig=&lt;absolute-config-yaml-path&gt;\EmailConfig.yaml</pre>
            </li>
        </ul>
    </li>
    <li>Test the SiddhiApp by calling the HTTP endpoint using curl or Postman as follows
        <ul>
            <li><b>Publish events with curl command:</b><br/>
            Publish few json to the http endpoint as follows,
<pre style="white-space:pre-wrap;">
curl -X POST http://localhost:8006/production \
  --header "Content-Type:application/json" \
  -d '{"event":{"name":"Cake","amount":2000.0}}'
</pre>
            </li>
            <li><b>Publish events with Postman:</b>
              <ol>
                <li>Install 'Postman' application from Chrome web store</li>
                <li>Launch the application</li>
                <li>Make a 'Post' request to 'http://localhost:8006/production' endpoint. Set the Content-Type to <code>'application/json'</code> and set the request body in json format as follows,
<pre>
{
  "event": {
    "name": "Cake",
    "amount": 2000.0
  }
}</pre>
                </li>
              </ol>
            </li>
        </ul>
    </li>
    <li>Check the <code>to.email</code> for the published email message, which will look as follows,
<pre style="white-space:pre-wrap;">
Subject : High Cake production!

Hi, 

High production of Cake, with amount 2000.0 identified. 

For more information please contact production department. 

Thank you</pre>
    </li>
</ul>
