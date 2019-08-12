# Siddhi 4.x as a Python library

To use Siddhi in Python via PySiddhi and to get a working sample follow the below sample:

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
