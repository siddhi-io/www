# Siddhi 4.x User Guide

Siddhi 4.x can run in multiple environments as follows.

* [Using Siddhi in WSO2 Stream Processor](#using-siddhi-in-wso2-stream-processor)
* [As a Java Library](#using-siddhi-as-a-java-library)
* [As a Python Library](#using-siddhi-as-a-python-library)

## **Using Siddhi in <a target="_blank" href="https://wso2.com/analytics-and-stream-processing/">WSO2 Stream Processor</a>**

* You can use Siddhi in the latest <a target="_blank" href="https://wso2.com/analytics-and-stream-processing/">WSO2 Stream 
Processor</a>. It is equipped with a graphical and source query editor, debugger, event simulator, monitoring, data visualization and reporting support. 
All none GPL <a target="_blank" href="http://siddhi.io/extensions/">Siddhi extensions</a> are shipped by default with 
WSO2 Stream Processor, and you can add other Siddhi extensions or upgrade existing Siddhi extensions, by removing and 
adding relevant Siddhi extension and its dependent OSGi bundles to `<SP_HOME>/lib` directory. If the Siddhi Extension depends on non OSGi jars 
convert them to OSGi bundles by following <a target="_blank" href="https://docs.wso2.com/display/SP4xx/Adding+Third+Party+Non+OSGi+Libraries">the steps provided in the SP docs</a>. 

* Refer the <a target="_blank" href="https://docs.wso2.com/display/SP4xx/Quick+Start+Guide">WSO2 SP Quick Start Guide</a> to try out Siddhi within WSO2 Stream Processor. 

* Refer <a target="_blank" href="https://docs.wso2.com/display/SP4xx">WSO2 Stream Processor Documentation</a> for more information.
 
## **Using Siddhi as a Java library**

* To embed Siddhi as a java library into your project and to get a working sample, follow the bellow steps:

### Step 1: Creating a Java Project

* Create a Java project using Maven and include the following dependencies in its `pom.xml` file.

```xml
   <dependency>
     <groupId>org.wso2.siddhi</groupId>
     <artifactId>siddhi-core</artifactId>
     <version>4.x.x</version>
   </dependency>
   <dependency>
     <groupId>org.wso2.siddhi</groupId>
     <artifactId>siddhi-query-api</artifactId>
     <version>4.x.x</version>
   </dependency>
   <dependency>
     <groupId>org.wso2.siddhi</groupId>
     <artifactId>siddhi-query-compiler</artifactId>
     <version>4.x.x</version>
   </dependency>
   <dependency>
     <groupId>org.wso2.siddhi</groupId>
     <artifactId>siddhi-annotations</artifactId>
     <version>4.x.x</version>
   </dependency>   
```

**Note**: You can create the Java project using any method you prefer. The required dependencies can be downloaded from [here](../download/).

* Create a new Java class in the Maven project.

### Step 2: Creating Siddhi Application

A Siddhi application is a self contained execution entity that defines how data is captured, processed and sent out.  

* Create a Siddhi Application by defining a stream definition E.g.`StockEventStream` defining the format of the incoming
 events, and by defining a Siddhi query as follows.
```java
  String siddhiApp = "define stream StockEventStream (symbol string, price float, volume long); " + 
                     " " +
                     "@info(name = 'query1') " +
                     "from StockEventStream#window.time(5 sec)  " +
                     "select symbol, sum(price) as price, sum(volume) as volume " +
                     "group by symbol " +
                     "insert into AggregateStockStream ;";
```

This Siddhi query groups the events by symbol and calculates aggregates such as the sum for price and sum of volume for the last 5 seconds time window. Then it inserts the results into a stream named `AggregateStockStream`. 
  
### Step 3: Creating Siddhi Application Runtime
This step involves creating a runtime representation of a Siddhi application.
```java
SiddhiManager siddhiManager = new SiddhiManager();
SiddhiAppRuntime siddhiAppRuntime = siddhiManager.createSiddhiAppRuntime(siddhiApp);
```
The Siddhi Manager parses the Siddhi application and provides you with an Siddhi application runtime. 
This Siddhi application runtime can be used to add callbacks and input handlers such that you can 
programmatically invoke the Siddhi application.

### Step 4: Registering a Callback
You can register a callback to the Siddhi application runtime in order to receive the results once the events are processed. There are two types of callbacks:

+ **Query callback**: This subscribes to a query.
+ **Stream callback**: This subscribes to an event stream.
In this example, a Stream callback is added to the `AggregateStockStream` to capture the processed events.

```java
siddhiAppRuntime.addCallback("AggregateStockStream", new StreamCallback() {
           @Override
           public void receive(Event[] events) {
               EventPrinter.print(events);
           }
       });
```
Here, once the results are generated they are sent to the receive method of this callback. An event printer is added 
inside this callback to print the incoming events for demonstration purposes.

### Step 5: Sending Events
In order to programmatically send events from the stream you need to obtain it's an input handler as follows:
```java
InputHandler inputHandler = siddhiAppRuntime.getInputHandler("StockEventStream");
```
Use the following code to start the Siddhi application runtime, send events and to shutdown Siddhi:
```java
//Start SiddhiApp runtime
siddhiAppRuntime.start();

//Sending events to Siddhi
inputHandler.send(new Object[]{"IBM", 100f, 100L});
Thread.sleep(1000);
inputHandler.send(new Object[]{"IBM", 200f, 300L});
inputHandler.send(new Object[]{"WSO2", 60f, 200L});
Thread.sleep(1000);
inputHandler.send(new Object[]{"WSO2", 70f, 400L});
inputHandler.send(new Object[]{"GOOG", 50f, 30L});
Thread.sleep(1000);
inputHandler.send(new Object[]{"IBM", 200f, 400L});
Thread.sleep(2000);
inputHandler.send(new Object[]{"WSO2", 70f, 50L});
Thread.sleep(2000);
inputHandler.send(new Object[]{"WSO2", 80f, 400L});
inputHandler.send(new Object[]{"GOOG", 60f, 30L});
Thread.sleep(1000);
 
//Shutdown SiddhiApp runtime
siddhiAppRuntime.shutdown();

//Shutdown Siddhi
siddhiManager.shutdown();
```
When the events are sent, you can see the output logged by the event printer.

Find the executable Java code of this example [here](https://github.com/siddhi-io/siddhi/blob/4.x.x/modules/siddhi-samples/quick-start-samples/src/main/java/org/wso2/siddhi/sample/TimeWindowSample.java)

For more code examples, see [quick start samples for Siddhi](https://github.com/siddhi-io/siddhi/tree/4.x.x/modules/siddhi-samples/quick-start-samples).

## **Using Siddhi as a Python library**

To use Siddhi in Python and to get a working sample follow the bellow sample:

### Step 1: Initialize libraries and imports

Add [log4j.xml](https://github.com/siddhi-io/PySiddhi/blob/4.x/log4j.xml) file to working directory in order to enable log4j logging. Log4j is used by PrintEvent to generate output.

Create a `.py` file add add the following Siddhi related imports: 

```python
from PySiddhi4.DataTypes.LongType import LongType
from PySiddhi4.core.SiddhiManager import SiddhiManager
from PySiddhi4.core.query.output.callback.QueryCallback import QueryCallback
from PySiddhi4.core.util.EventPrinter import PrintEvent
from time import sleep
```
### Step 2: Creating Siddhi Application

A Siddhi application is a self contained execution entity that defines how data is captured, processed and sent out.  

Create a Siddhi Application by defining a stream definition E.g.`StockEventStream` defining the format of the incoming events, and by defining a Siddhi query as follows.
 
```python
siddhiManager = SiddhiManager()
# Siddhi Query to filter events with volume less than 150 as output
siddhiApp = "define stream StockEventStream (symbol string, price float, volume long); " + \
"@info(name = 'query1') from StockEventStream[volume < 150] select symbol,price insert into OutputStream;"
```
This Siddhi query query to detect stock records having volume less than 150, and then inserts the results into a stream named `OutputStream`. 

For more details on Siddhi Query Language, refer [Siddhi Query Language Guide](../query-guide/).

### Step 3: Creating Siddhi Application Runtime
This step involves creating a runtime representation of a Siddhi application.

```python
# Generate runtime
siddhiAppRuntime = siddhiManager.createSiddhiAppRuntime(siddhiApp)
```

### Step 4: Registering a Callback
You can register a callback to the Siddhi application runtime in order to receive the results once the events are processed. There are two types of callbacks:

+ **Query callback**: This subscribes to a query.
+ **Stream callback**: This subscribes to an event stream.

In this example, a Query callback is added to the `query1` to capture the processed events.

```python
# Add listener to capture output events
class QueryCallbackImpl(QueryCallback):
    def receive(self, timestamp, inEvents, outEvents):
        PrintEvent(timestamp, inEvents, outEvents)
siddhiAppRuntime.addCallback("query1",QueryCallbackImpl())
```

Here, once the results are generated they are sent to the receive method of this callback. An event printer is added 
inside this callback to print the incoming events for demonstration purposes.

### Step 5: Sending Events
In order to programmatically send events from the stream you need to obtain it's an input handler as follows:

```python
# Retrieving input handler to push events into Siddhi
inputHandler = siddhiAppRuntime.getInputHandler("StockEventStream")
```

Use the following code to start the Siddhi application runtime, send events and to shutdown Siddhi:

```python
# Starting event processing
siddhiAppRuntime.start()

# Sending events to Siddhi
inputHandler.send(["IBM",700.0,LongType(100)])
inputHandler.send(["WSO2", 60.5, LongType(200)])
inputHandler.send(["GOOG", 50, LongType(30)])
inputHandler.send(["IBM", 76.6, LongType(400)])
inputHandler.send(["WSO2", 45.6, LongType(50)])

# Wait for response
sleep(10)

#Shutdown SiddhiApp runtime
siddhiAppRuntime.stop()

# Shutdown Siddhi
siddhiManager.shutdown()
```

### Full sample code

This sample demonstrating how to write a streaming query to detect stock records having volume less than 150. 

```python
from PySiddhi4.DataTypes.LongType import LongType
from PySiddhi4.core.SiddhiManager import SiddhiManager
from PySiddhi4.core.query.output.callback.QueryCallback import QueryCallback
from PySiddhi4.core.util.EventPrinter import PrintEvent
from time import sleep

siddhiManager = SiddhiManager()
# Siddhi Query to filter events with volume less than 150 as output
siddhiApp = "define stream StockEventStream (symbol string, price float, volume long); " + \
"@info(name = 'query1') from StockEventStream[volume < 150] select symbol,price insert into OutputStream;"

# Generate runtime
siddhiAppRuntime = siddhiManager.createSiddhiAppRuntime(siddhiApp)

# Add listener to capture output events
class QueryCallbackImpl(QueryCallback):
    def receive(self, timestamp, inEvents, outEvents):
        PrintEvent(timestamp, inEvents, outEvents)
siddhiAppRuntime.addCallback("query1",QueryCallbackImpl())

# Retrieving input handler to push events into Siddhi
inputHandler = siddhiAppRuntime.getInputHandler("StockEventStream")

# Starting event processing
siddhiAppRuntime.start()

# Sending events to Siddhi
inputHandler.send(["IBM",700.0,LongType(100)])
inputHandler.send(["WSO2", 60.5, LongType(200)])
inputHandler.send(["GOOG", 50, LongType(30)])
inputHandler.send(["IBM", 76.6, LongType(400)])
inputHandler.send(["WSO2", 45.6, LongType(50)])

# Wait for response
sleep(10)

siddhiAppRuntime.stop()

siddhiManager.shutdown()

```

### Expected Output

The 3 events with volume less than 150 are printed in log.

```log
INFO  EventPrinter - Events{ @timestamp = 1497708406678, inEvents = [Event{timestamp=1497708406678, id=-1, data=[IBM, 700.0], isExpired=false}], RemoveEvents = null }
INFO  EventPrinter - Events{ @timestamp = 1497708406685, inEvents = [Event{timestamp=1497708406685, id=-1, data=[GOOG, 50], isExpired=false}], RemoveEvents = null }
INFO  EventPrinter - Events{ @timestamp = 1497708406687, inEvents = [Event{timestamp=1497708406687, id=-1, data=[WSO2, 45.6], isExpired=false}], RemoveEvents = null }
```

## System Requirements
1. Minimum memory - 500 MB (based on in-memory data stored for processing)
2. Processor      - Pentium 800MHz or equivalent at minimum
3. Java SE Development Kit 1.8 (1.7 for 3.x version)
4. To build Siddhi from the Source distribution, it is necessary that you have
   JDK 1.8 version (1.7 for 3.x version) or later and Maven 3.0.4 or later
