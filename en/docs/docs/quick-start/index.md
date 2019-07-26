# Siddhi Quick Start Guide

Siddhi is a cloud native Streaming and Complex Event Processing engine that understands Streaming SQL queries in order to capture events from diverse data sources, process them, detect complex conditions, and publish output to various endpoints in real time.

Siddhi is used by many companies including Uber, eBay, PayPal (via Apache Eagle), here [**Uber processed more than 20 billion events per day using Siddhi**](http://wso2.com/library/conference/2017/2/wso2con-usa-2017-scalable-real-time-complex-event-processing-at-uber?utm_source=gitanalytics&utm_campaign=gitanalytics_Jul17) for their fraud analytics use cases. Siddhi is also used in various analytics and integration platforms such as [Apache Eagle](https://eagle.apache.org/) as a policy enforcement engine, [WSO2 API Manager](https://wso2.com/api-management/) as analytics and throttling engine, [WSO2 Identity Server](https://wso2.com/identity-and-access-management/) as an adaptive authorization engine.

This quick start guide contains the following six sections:

1. **Domain** of Siddhi
2. Overview of Siddhi **architecture**
3. Using Siddhi for the first time
4. Writing first Siddhi Application
5. Testing Siddhi Application
6. A bit of Stream Processing

## 1. Domain of Siddhi

Siddhi is an event driven system where all the data it consumes, processes and sends are modeled as events. Therefore, Siddhi can play a vital part in any event-driven architecture.   

As Siddhi works with events, first let's understand what an event is through an example. **If we consider transactions carried out via an ATM as a data stream, one withdrawal from it can be considered as an event**. This event contains data such as amount, time, account number, etc. Many such transactions form a stream.
![](../../images/quickstart/event-stream.png?raw=true "Event Stream")

Siddhi provides following functionalities,

* Streaming Data Analytics<br/>
  [Forrester](https://reprints.forrester.com/#/assets/2/202/'RES136545'/reports) defines Streaming Analytics as:<br/>
  > Software that provides analytical operators to **orchestrate data flow**, **calculate analytics**, and **detect patterns** on event data **from multiple, disparate live data sources** to allow developers to build applications that **sense, think, and act in real time**.

* Complex Event Processing (CEP)<br/>
  [Gartner’s IT Glossary](https://www.gartner.com/it-glossary/complex-event-processing) defines CEP as follows:<br/>
  >"CEP is a kind of computing in which **incoming data about events is distilled into more useful, higher level “complex” event data** that provides insight into what is happening."
  >
  >"**CEP is event-driven** because the computation is triggered by the receipt of event data. CEP is used for highly demanding, continuous-intelligence applications that enhance situation awareness and support real-time decisions."

* Streaming Data Integration<br/>
  > Streaming data integration is a way of integrating several systems by processing, correlating, and analyzing the data in memory, while continuously moving data in real-time from one system to another.

* Alerts & Notifications
  > The system to continuously monitor event streams, and send alerts and notifications, based on defined KPIs and other analytics.

* Adaptive Decision Making
  > A way to dynamically making real-time decisions based on predefined rules, the current state of the connected systems, and machine learning techniques.

Basically, Siddhi receives data event-by-event and processes them in real-time to produce meaningful information.

![](../../images/quickstart/siddhi-basic.png?raw=true "Siddhi Basic Representation")

Using the above Siddhi can be used to solve may use-cases as follows:

* Fraud Analytics
* Monitoring
* System Integration
* Anomaly Detection
* Sentiment Analysis
* Processing Customer Behavior
* .. etc

## 2. Overview of Siddhi architecture

![](../../images/siddhi-overview.png?raw=true "Overview")

As indicated above, Siddhi can:

+ Accept event inputs from many different types of sources.
+ Process them to transform, enrich, and generate insights.
+ Publish them to multiple types of sinks.

To use Siddhi, you need to write the processing logic as a **Siddhi Application** in the **Siddhi Streaming SQL** language which is discussed in the [section 4](#4-writing-first-siddhi-application). Here a Siddhi Application is a script file that contains business logic for a scenario.

When the **Siddhi application** is started, it:

1. Consumes data one-by-one as events.
2. Pipe the events to queries through various streams for processing.
3. Generates new events based on the processing done at the queries.
4. Finally, Sends newly generated events through output to streams.

## 3. Using Siddhi for the first time

In this section, we will be using the Siddhi tooling distribution — a server version of Siddhi that has a sophisticated web based editor with a GUI (referred to as _**“Siddhi Editor”**_) where you can write Siddhi Apps and simulate events to test your scenario.

**Step 1** — Install
[Oracle Java SE Development Kit (JDK)](http://www.oracle.com/technetwork/java/javase/downloads/index.html) version 1.8. <br>
**Step 2** — [Set the JAVA_HOME](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/) environment
variable. <br>
**Step 3** — Download the latest tooling distribution from [here](https://github.com/siddhi-io/distribution/releases/download/v0.1.0/siddhi-tooling-0.1.0.zip).<br>
**Step 4** — Extract the downloaded zip and navigate to `<TOOLING_HOME>/bin`. <br> (`TOOLING_HOME` refers to the extracted folder) <br>
**Step 5** — Issue the following command in the command prompt (Windows) / terminal (Linux/Mac)

```
For Windows: tooling.bat
For Linux/Mac: ./tooling.sh
```

After successfully starting the Siddhi Editor, the terminal should look like as shown below:

![](../../images/quickstart/after-starting-editor.png?raw=true "Terminal after starting Siddhi Editor")

After starting the Siddhi Editor, access the Editor GUI by visiting the following link in your browser (Google Chrome is the Recommended).

```
http://localhost:9390/editor
```

This takes you to the Siddhi Editor landing page.

![](../../images/quickstart/siddhi-editor.png?raw=true "Siddhi Editor")

## 4. Writing first Siddhi Application

Siddhi Streaming SQL is a rich, compact, easy-to-use SQL-like language. **As the first Siddhi Application, let's learn how to find the total** of values from the incoming events and output the current running total value for each event.

Siddhi has lot of in-built functions and extensions available for complex analysis, and you can find more information about the Siddhi grammar and its functions from the [Siddhi Query Guide](../query-guide/).

Let's consider sample scenario where we are **loading cargo boxes into a ship**. Here, we need to keep track of the total weight of the cargo added, and **the weight of each loaded cargo box is considered an event**.

![](../../images/quickstart/loading-ship.jpeg?raw=true "Loading Cargo on Ship")

We can write a Siddhi Application for the above scenario using the following **4 parts**.

**Part 1 — Giving our Siddhi application a suitable name.** This allows us to uniquely identity a Siddhi Application. In this example, let's name our application as _“HelloWorldApp”_

```
@App:name("HelloWorldApp")
```
**Part 2 — Defining the input stream.** The stream needs to have a name and a schema defining the data that each incoming event should contain. The event data attributes are expressed as name and type pairs.

We can also attach a _"source"_ to the created stream, so that we can consume events from outside and send them to the stream. (**Source is the Siddhi way to consume streams from
external systems**). For this scenario we will use an `http` source to consume Cargo Events. When added the `http` source will spin up a HTTP endpoint and keep on listening for messages. To learn more about sources, refer [source](../query-guide/#source))

In this scenario:

* The name of the input stream — _“CargoStream”_ <br>
This contains only one data attribute:
* The name of the data in each event — _“weight”_
* Type of the data _“weight”_ — int
* Type of source - _HTTP_
* HTTP endpoint address - http://0.0.0.0:8006/cargo
* Accepted input data format - _JSON_

```
@source(type = 'http', receiver.url = "http://0.0.0.0:8006/cargo", @map(type = 'json'))
define stream CargoStream (weight int);
```

**Part 3 - Defining the output stream.** This has the same info as the input _“CargoStream”_ stream definition with an additional _totalWeight_ attribute containing the total weight calculated so far.

In addition we also need to add a `log` _"sink"_  to log the `OutputStream` so that we can observe the output produced by the stream. (**Sink is the Siddhi way to publish streams to external systems**). This particular `log` type sink simply logs the stream events. To learn more about sinks, refer [sink](../query-guide/#sink))

```
@sink(type='log', prefix='LOGGER')
define stream OutputStream(weight int, totalWeight long);
```
**Part 4 — Writing the Siddhi query.** As part of the query we need to specify the following:

1. A name for the query — _“HelloWorldQuery”_
2. The input stream from which the query consumes events — _“CargoStream”_
3. How the output to be calculated - by calculating the *sum* of the *weight**s  
4. The data outputted to the output stream — _“weight”_, _“totalWeight”_
5. The output stream to which the event should be outputted — _“OutputStream”_

```
@info(name='HelloWorldQuery')
from CargoStream
select weight, sum(weight) as totalWeight
insert into OutputStream;
```

This query will calculate the sum of weights from the start of the Siddhi application. For more complex use cases refer [Siddhi Query Guild](../query-guide/))  

Final Siddhi application in the editor will look like following.
![](../../images/quickstart/hello-query.png?raw=true "Hello World in Stream Processor Studio")

You can copy the final Siddhi app from below.

```
@App:name("HelloWorldApp")

@source(type = 'http', receiver.url = "http://0.0.0.0:8006/cargo", @map(type = 'json'))
define stream CargoStream (weight int);

@sink(type='log', prefix='LOGGER')
define stream OutputStream(weight int, totalWeight long);

@info(name='HelloWorldQuery')
from CargoStream
select weight, sum(weight) as totalWeight
insert into OutputStream;
```

## 5. Testing Siddhi Application
In this section first we will test the logical accuracy of Siddhi query using in-built functions of Siddhi Editor. In a later section we will invoke the HTTP endpoint and perform an end to end test.

The Siddhi Editor has in-built support to simulate events. You can do it via the _“Event Simulator”_ panel at the left of the Siddhi Editor. Before running the event simulation, you should save your _HelloWorldApp_ by browsing to **File** menu -> and clicking **Save**. To simulate events, click **Event Simulator** and configure _Single Simulation_ as shown below.

![](../../images/quickstart/event-simulation.png?raw=true "Simulating Events in Stream Processor Studio")

**Step 1 — Configurations:**

* Siddhi App Name — _“HelloWorldApp”_
* Stream Name — _“CargoStream”_
* Timestamp — (Leave it blank)
* weight — 2 (or some integer)

**Step 2 — Click “Run” mode and then click “Start and Send”**. This starts the Siddhi Application and send the event.

If the Siddhi application is successfully started, the following message is printed in the Stream Processor Studio console:</br>
```
HelloWorldApp.siddhi Started Successfully!
```
**Step 3 — Click “Send” and observe the terminal**. This will send a new event for each click.
You can see a logs containing `outputData=[2, 2]` and `outputData=[2, 4]`, etc. You can change the value of the weight and send it to see how the sum of the weight is updated.

![](../../images/quickstart/log.png?raw=true "Terminal after sending 2 twice")

Bravo! You have successfully completed building and testing your first Siddhi Application!

## 6. A bit of Stream Processing

This section will improve our Siddhi app to demonstrates how to carry out **temporal window processing** with Siddhi.

Up to this point, we are calculating the sum of weights from the start of the Siddhi app, and now let's improve it to consider only the last three events for the calculation.

For this scenario, let's imagine that when we are loading cargo boxes into the ship and **we need to keep track of the average weight of the last three loaded boxes** so that we can balance the weight across the ship.
For this purpose, let's try to find the **average weight of last three boxes** of each event.

![](../../images/quickstart/siddhi-windows.png?raw=true "Terminal after sending 2 twice")

For window processing, we need to modify our query as follows:
```
@info(name='HelloWorldQuery')
from CargoStream#window.length(3)
select weight, sum(weight) as totalWeight, avg(weight) as averageWeight
insert into OutputStream;
```

* `from CargoStream#window.length(3)` - Specifies that we need to consider the last three events in a sliding manner.
* `avg(weight) as averageWeight` - Specifies calculating the average of events stored in the window and producing the results as _"averageWeight"_ (Note: Similarly the `sum` also calculates the `totalWeight` based on the last three events).

We also need to modify the _"OutputStream"_ definition to accommodate the new _"averageWeight"_.

```
define stream OutputStream(weight int, totalWeight long, averageWeight double);
```

The updated Siddhi Application is given below:

```
@App:name("HelloWorldApp")

@source(type = 'http', receiver.url = "http://0.0.0.0:8006/cargo",@map(type = 'json'))
define stream CargoStream (weight int);

@sink(type='log', prefix='LOGGER')
define stream OutputStream(weight int, totalWeight long, averageWeight double);

@info(name='HelloWorldQuery')
from CargoStream#window.length(3)
select weight, sum(weight) as totalWeight, avg(weight) as averageWeight
insert into OutputStream;
```

**Note:** You should listen on 0.0.0.0 with the Siddhi Application you are running inside the container.If you listen on localhost inside the container, nothing outside the container can connect to your application. That includes blocking port forwarding from the docker host and container to container networking.

Now you can send events using the Event Simulator and observe the log to see the sum and average of the weights based on the last three cargo events.

In the earlier scenario when the window is not used, the system only stored the running sum in its memory, and it did not store any events. But for `length` based [window processing](../query-guide/#window) the system will retain the events that fall into the window to perform aggregation operations such as average, maximum, etc. In this case when the 4th event arrives, the first event in the window is removed ensuring the memory usage does not grow beyond a specific limit. **Note:** some window types in Siddhi are even more optimized to perform the operations with minimal or no event retention.

## 7. Running Siddhi Application as a Docker microservice

In this step we will run above developed Siddhi application as a microservice utilizing Docker. For other available options please refer [here](../#executing-siddhi-applications). Here we will use siddhi-runner docker distribution. Follow the below steps to obtain the docker.

* Install docker in your machine and start the daemon ([https://docs.docker.com/install/](https://docs.docker.com/install/)).
* Pull the latest siddhi-runner image by executing below command.

```
docker pull siddhiio/siddhi-runner-alpine:latest
```
* Navigate to Siddhi Editor and choose **File -> Export File** for download above Siddhi application as a file.
* Move downloaded Siddhi file(_HelloWorldApp.siddhi_) to a desired location (e.g. `/home/me/siddhi-apps`)
* Execute below command to start the Siddhi Application as a microservice.

```
docker run -it -p 8006:8006 -v /home/me/siddhi-apps:/apps siddhiio/siddhi-runner-alpine
-Dapps=/apps/HelloWorldApp.siddhi
```
**Note: Make sure to update the `/home/me/siddhi-apps` with the folder path you have stored the `HelloWorldApp.siddhi` app.**
* Once container is started use below curl command to send events into _"CargoStream"_
```
curl -X POST http://localhost:8006/cargo \
  --header "Content-Type:application/json" \
  -d '{"event":{"weight":2}}'
```
* You will be able to observe outputs via logs as shown below.
```
[2019-04-24 08:54:51,755]  INFO {io.siddhi.core.stream.output.sink.LogSink} - LOGGER : Event{timestamp=1556096091751, data=[2, 2, 2.0], isExpired=false}
[2019-04-24 08:56:25,307]  INFO {io.siddhi.core.stream.output.sink.LogSink} - LOGGER : Event{timestamp=1556096185307, data=[2, 4, 2.0], isExpired=false}
```

To learn more about the Siddhi functionality, see [Siddhi Documentation](../).

If you have questions please post them on<a target="_blank" href="http://stackoverflow.com/search?q=siddhi">Stackoverflow</a> with <a target="_blank" href="http://stackoverflow.com/search?q=siddhi">"Siddhi"</a> tag.
