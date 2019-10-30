# Siddhi 5.1 as a Python library

***PySiddhi*** is a Python wrapper for [Siddhi](https://siddhi-io.github.io/siddhi/) which can listens to events from data streams, detects complex conditions described via a Streaming SQL language, and triggers actions.
 
To use Siddhi in Python via PySiddhi and to get a working sample follow the below steps:
 
There are some prerequisites should be met before installing PySiddhi with above command.

## Prerequisites

- The following dependencies should be installed prior to installation of library.
  
      **Linux**
      
      - Python 2.7 or 3.x
      - Cython <br/> `sudo pip install cython`
      - Python Developer Package <br/> `sudo apt-get install python-dev python3-dev python-dev`
      - Oracle Java 8 and set JAVA_HOME path
      - libboost for Python _(Only to build from Source)_ <br/>`sudo apt-get install libboost-python-dev` 
      - Maven _(Only to build from Source)_
      - g++ and other development tools _(Only to build from Source)_ <br/>
                `sudo apt-get install build-essential g++ autotools-dev libicu-dev build-essential libbz2-dev libboost-all-dev`
  
      **macOS**
      
      - Install brew
      - Install python using brew
      - Cython <br/> `sudo pip install cython`
      - Oracle Java 8 and set JAVA_HOME path
      - boost for python _(Only to build from Source)_ <br/> `brew install boost`
      - Maven _(Only to build from Source)_
  
      **Windows**
      
      - Install Python 
      - Cython <br/>`sudo pip install cython`
      - Oracle Java 8 and set JAVA_HOME path
      - Install Visual Studio Build tools _(Only to build from Source)_
      - Maven _(Only to build from Source)_
    
- Download siddhi-sdk release from [here](https://github.com/siddhi-io/siddhi-sdk/releases) and set the SIDDHISDK_HOME as an environment variable. <br/> `export SIDDHISDK_HOME="<path-to-siddhi-sdk>"`
- Download siddhi-python-api-proxy-5.1.0.jar from [here](https://github.com/siddhi-io/PySiddhi/releases) and copy to `<SIDDHISDK_HOME>/lib` directory

## Installation

The current version is tested with Unix/Linux based operating systems. 
PySiddhi can be installed using one of the following methods.

### Install PySiddhi via Python Package Management

PySiddhi can be installed using pip.
 
```
pip install pysiddhi
```

### Install PySiddhi from Online Code

Using the following PIP command, PySiddhi can be directly installed from online code available in GitHub.
```
pip install git+https://github.com/siddhi-io/PySiddhi.git
```
*Note: In case of permission errors, use `sudo`*

### Install from Downloaded Code
Switch to the branch `master` of PySiddhi.
Navigate to source code root directory and execute the following PIP command.

```
pip install .
```
*Note the period (.) at end of command. In case of permission errors, use `sudo`*

## Sample

Let's tryout the below sample with PySiddhi to get better understanding about the usage.
This sample demonstrating how to write a streaming query to detect stock records having volume less than 150. 

### Step 1 - Initialize libraries and imports

Add [this file](https://github.com/siddhi-io/PySiddhi/blob/master/log4j.xml) to working directory in order to enable log4j 
logging. Log4j is used by PrintEvent to generate output.

```python
from PySiddhi.DataTypes.LongType import LongType
from PySiddhi.core.SiddhiManager import SiddhiManager
from PySiddhi.core.query.output.callback.QueryCallback import QueryCallback
from PySiddhi.core.util.EventPrinter import PrintEvent
from time import sleep
```

### Step 2 - Define filter using Siddhi Query

```python
siddhiManager = SiddhiManager()
# Siddhi Query to filter events with volume less than 150 as output
siddhiApp = "define stream cseEventStream (symbol string, price float, volume long);" + \
            "@info(name = 'query1') " + \
            "from cseEventStream[volume < 150] " + \
            "select symbol, price " + \
            "insert into outputStream;"

# Generate runtime
siddhiAppRuntime = siddhiManager.createSiddhiAppRuntime(siddhiApp)
```

For more details on Siddhi Query Language, refer [Siddhi Query Language Guide](https://siddhi.io/en/v5.1/docs/query-guide/).

### Step 3 - Define a listener for filtered events

```python
# Add listener to capture output events
class QueryCallbackImpl(QueryCallback):
    def receive(self, timestamp, inEvents, outEvents):
        PrintEvent(timestamp, inEvents, outEvents)
siddhiAppRuntime.addCallback("query1",QueryCallbackImpl())
```

### Step 4 - Test filter query using sample input events

```python
# Retrieving input handler to push events into Siddhi
inputHandler = siddhiAppRuntime.getInputHandler("cseEventStream")

# Starting event processing
siddhiAppRuntime.start()

# Sending events to Siddhi
inputHandler.send(["IBM",700.0,LongType(100)])
inputHandler.send(["WSO2", 60.5, LongType(200)])
inputHandler.send(["GOOG", 50, LongType(30)])
inputHandler.send(["IBM", 76.6, LongType(400)])
inputHandler.send(["WSO2", 45.6, LongType(50)])

# Wait for response
sleep(0.1)
```

### Clean Up - Remember to shutdown the Siddhi Manager when your done.

```python
siddhiManager.shutdown()
```

### Complete Siddhi App

Please find the complete sample Siddhi app in below

```python
from PySiddhi.DataTypes.LongType import LongType
from PySiddhi.core.SiddhiManager import SiddhiManager
from PySiddhi.core.query.output.callback.QueryCallback import QueryCallback
from PySiddhi.core.util.EventPrinter import PrintEvent
from time import sleep

siddhiManager = SiddhiManager()
# Siddhi Query to filter events with volume less than 150 as output
siddhiApp = "define stream cseEventStream (symbol string, price float, volume long); " + \
"@info(name = 'query1') from cseEventStream[volume < 150] select symbol,price insert into outputStream;"

# Generate runtime
siddhiAppRuntime = siddhiManager.createSiddhiAppRuntime(siddhiApp)

# Add listener to capture output events
class QueryCallbackImpl(QueryCallback):
    def receive(self, timestamp, inEvents, outEvents):
        PrintEvent(timestamp, inEvents, outEvents)
siddhiAppRuntime.addCallback("query1",QueryCallbackImpl())

# Retrieving input handler to push events into Siddhi
inputHandler = siddhiAppRuntime.getInputHandler("cseEventStream")

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

siddhiManager.shutdown()

```

### Expected Output

The 3 events with volume less than 150 are printed in log.

```log
INFO  EventPrinter - Events{ @timestamp = 1497708406678, inEvents = [Event{timestamp=1497708406678, id=-1, data=[IBM, 700.0], isExpired=false}], RemoveEvents = null }
INFO  EventPrinter - Events{ @timestamp = 1497708406685, inEvents = [Event{timestamp=1497708406685, id=-1, data=[GOOG, 50], isExpired=false}], RemoveEvents = null }
INFO  EventPrinter - Events{ @timestamp = 1497708406687, inEvents = [Event{timestamp=1497708406687, id=-1, data=[WSO2, 45.6], isExpired=false}], RemoveEvents = null }
```

## Uninstall PySiddhi
If the library has been installed as explained above, it could be uninstalled using the following pip command.
```
pip uninstall pysiddhi
```

!!! info "Refer [here](https://siddhi-io.github.io/PySiddhi/) to get more details about running Siddhi on Python."

