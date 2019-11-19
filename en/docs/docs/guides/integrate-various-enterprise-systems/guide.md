Retrieve and Publish Data from/to Various Enterprise Systems
===========================================================

This guide illustrates how you can receive data from various enterprise systems, process it, and then send processed data into other systems.

## Scenario

Paris becomes very busy in the rush hours. Most of the people trying to go to offices in the morning and children try to go to school. In the afternoon all those people trying to go back to their premises. The traffic becomes high in those hours. If there is a bad weather condition in those rush hours the traffic might increase up to a certain level.

Partis Transport Management Authority (Paris TMA) is accountable for handling all the traffic in Paris. They have noticed this increase in traffic due to the bad weather conditions in several areas. To reduce this traffic, they try to build a system that notifies all users if there are bad weather conditions in a particular area. Paris TMA uses a centralized database to receive notifications about bad weather conditions. Besides, they are tracking locations of all the vehicles in Paris city. If some incident happens, this system will notify all the users that are near to that area.

After completing this guide you will understand how to receive various inputs from heterogeneous systems (like NATS, RDBMS, MongoDB), process it, and send back processed outputs in various formats like Email notification.

## What You'll Build

The implementation of the ParisTMA system represented in the following architecture diagram. The overall architecture can be expressed as the following subsystems.

### Vehicle Locator Subsystem

The vehicle locator subsystem is responsible for receiving the location of each subscriber and update subscriber database collection with their current location. The process of this subsystem showed in step 01-03 in the architecture diagram. The location of a vehicle, input to the NATS cluster as a JSON object like below.

```json
{
    "vehicleId": "v001",
    "currentArea": "a002"
}
```

The Siddhi app called ParisTMAVehicleLocator will listen to those messages that come to the NATS cluster and periodically update the Mongo database with those current locations. This Mongo database contained all the information relevant to subscribers along with their current location.

### Notifier Subsystem

The process of the notifier subsystem illustrated in step 04-07 in the architecture diagram. The notifier subsystem triggers the process when our system receives weather update to the RDBMS as shown in step 04. The ParisTMANotifier Siddhi app will handle all the logical execution of this notification process. There exists a [CDC](https://github.com/siddhi-io/siddhi-io-cdc) source which listens to the changes of the RDBMS. When some weather notification inserts into the RDBMS, the ParisTMANotifier Siddhi app retrieves this insert event. That insert event will contain the area that this weather incident happened. Using that area, ParisTMANotifier filters out all the subscribers that are in that given area using the subscriber collection in the Mongo database. To all those subscribers ParisTMANotifier will send an email notification about this incident.

![Architecture Diagram](images/architecture.png "Architecture Diagram")

## Prerequisites

### Mandatory Requirements

1. [Siddhi tooling VM/Local distribution](https://siddhi.io/en/v5.1/download/)
1. One of the [Siddhi runner distributions](https://siddhi.io/en/v5.1/download/)
    1. VM/Local Runtime
    1. Docker Image
    1. K8s Operator (commands are given in deployment section)
1. [MySQL database](https://www.mysql.com/)
1. [Mongo database](https://docs.mongodb.com/manual/installation/)
1. [NATS streaming server](https://nats-io.github.io/docs/nats_streaming/gettingstarted/install.html)
1. [Java 8](https://www.oracle.com/java/technologies/jdk8-downloads.html) or higher

### Requirements needed to deploy Siddhi in Docker/Kubernetes

1. [Docker](https://docs.docker.com/install/)
1. Kubernetes cluster
    1. [Minikube](https://github.com/kubernetes/minikube#installation)
    1. [Google Kubernetes Engine(GKE)](https://console.cloud.google.com)
    1. [Docker for Mac](https://docs.docker.com/docker-for-mac/install/)
1. [Helm](https://helm.sh/docs/using_helm/)
1. Refer to [this documentation about Configuring a Google Kubernetes Engine (GKE) Cluster](https://github.com/siddhi-io/siddhi-operator/blob/master/docs/gke-setup.md) to deploy Siddhi apps in GKE.

## Implementation

As illustrated in the previous architecture diagram you will need Siddhi apps called ParisTMAVehicleLocator and ParisTMANotifier.

1. Start the [Siddhi tooling](https://siddhi.io/en/v5.0/docs/tooling/) runtime and go to the editor UI in http://localhost:9390/editor
1. Use the following steps to start the Siddhi tooling runtime. Extract the downloaded zip and navigate to /bin. (TOOLING_HOME refers to the extracted folder). Use the following command in the command prompt (Windows) / terminal (Linux/Mac).
    ```sh
    For Windows: tooling.bat
    For Linux/Mac: ./tooling.sh
    ```
1. Select File -> New option, then you could either use the source view or design view to write/build the Siddhi Application. You can find the Siddhi Application bellow, that implements the requirements mentioned above.

Let’s write (develop) the Siddhi Application, as given below.

Once the Siddhi app is created, you can use the Event Simulator option in the editor to simulate events to streams and perform developer testing. The implementation of those apps is described in the following subtopics.

!!! Note "Siddhi Query Guide"
    The execution steps and the logic of the Siddhi query described as comments in the following Siddhi app. Therefore here we are not going to explain in detail here. For more details about Siddhi queries please refer [Siddhi query guide](https://siddhi.io/en/v5.1/docs/query-guide/).


### Vehicle Locator

```siddhi
@App:name("ParisTMAVehicleLocator")
@App:description("Listen to the events send by NATS about vehicle locations and periodically update the Mongo database.")

/*
Purpose:
    The ParisTMA has subscribers that subscribe to get the service. All the subscriber details are saved in the Mongo database. In that database ParisTMA stores the current location of subscriber vehicles. The events related to current locations come as TCP requests through NATS. This app listens to those events and eventually update the database with the current location of each subscriber.

Input:
        NATS event with JSON payload: 
        {
            "vehicleId": "v001",
            "currentArea": "a002"
        }

Output:
    Update the collection(subscriber) documents of MongoDB(parisTma).

*/

-- NATS source that listens to the events
@source(
    type='nats', 
    cluster.id='${STAN_CLUSTER_ID}', 
    destination='VehicleInputTunnel', 
    bootstrap.servers='${STAN_SERVER_URL}', 
    @map(type='json')
)
define stream CurrentVehicleAreaInputStream(vehicleId string, currentArea string);

-- MongoDB store
@store(type='mongodb', mongodb.uri='${MONGODB_URI}')
define table subscriber(vehicleId string, currentArea string);

-- Retrieves events from NATS source and update in MongoDB
@info(name='update-or-insert-subscriber-location') 
from CurrentVehicleAreaInputStream
update or insert into subscriber 
on subscriber.vehicleId==vehicleId;
```

### Notifier

```siddhi
@App:name("ParisTMANotifier")
@App:description("Listen to the CDC events about the weather updates and send notifications to the subscribed users.")

/*
Purpose:
    The ParisTMA has subscribers that subscribe to get the service. All the subscriber details are saved in the Mongo database. In that database ParisTMA stores the current location of subscriber vehicles. There is a separate system handle by the Paris weather forecast organization. They periodically update the MySQL database called 'paristma' with recent weather incidents. This app listens to those insertions using CDC and sends notifications to the subscribers who are in that particular area that incident happens.

Input:
    CDC insertions.

Output:
    Email to users that notifying about the incident. 
    Note: Even you can change this email notification to an SMS notification calling an SMS provider.
*/

-- CDC source that listens to insertions of the Incident table
@source(
    type='cdc',
    url='${MYSQL_URL}',
    username='siddhi_user',
    password='siddhiio',
    table.name='Incident',
    operation='insert',
    @map(
        type='keyvalue'
    )
)
define stream IncidentInputStream(incidentId int, incidentName string, incidentType string, incidentDetails string, incidentArea string);

-- MongoDB store of subscribers
@store(type='mongodb', mongodb.uri='${MONGODB_URI}')
define table subscriber(vehicleId string, currentArea string, subscriberName string, subscriberEmail string);

-- Email sink to send notifications
@sink(type='email', username="${PARIS_TMA_EMAIL}", address="${PARIS_TMA_EMAIL}", password="${PARIS_TMA_EMAIL_PASSWORD}", 
      subject="Weather Notification in {{incidentArea}}", to="{{subscriberEmail}}", host="smtp.gmail.com", port="465", 
      ssl.enable="true", auth="true", 
      @map(type='text', 
           @payload("""
            Hi {{subscriberName}}

            Recent reports state that there is {{incidentName}} in your area {{incidentArea}}. It is in {{incidentType}} state right now. 
            
            The report state that {{incidentDetails}}.

            Thanks, 
            Paris Transport Management Authority""")))
define stream UserNotificationStream (subscriberName string, subscriberEmail string, incidentName string, incidentType string, incidentDetails string, incidentArea string);

-- Listen to the insertions in IncidentInputStream and join it with subscriber collection in MongoDB to get user information. Send notifications using that user information.
@info(name='listen-and-notify') 
from IncidentInputStream#window.length(1) join subscriber
on IncidentInputStream.incidentArea==subscriber.currentArea
select 
    subscriber.subscriberName, 
    subscriber.subscriberEmail, 
    IncidentInputStream.incidentName, 
    IncidentInputStream.incidentType, 
    IncidentInputStream.incidentDetails, 
    IncidentInputStream.incidentArea
insert into UserNotificationStream;
```

## Testing

### Setup MongoDB 

Refer [this link](https://docs.mongodb.com/manual/installation/) to install MongoDB in your local machine. The ParisTMA system uses a Mongo database called `parisTma` and that parisTma collection contained a collection called the `subscriber`. In order to connect to the Mongo database, the Siddhi runtime will use a user called `siddhi_user` that identified by password `siddhiio`. You can create those MongoDB databases, collections, users and insert data using the following MongoDB commands.

```sh

> use parisTma
> db.createCollection("subscriber")
> db.createUser(
   {	user: "siddhi_user",
      pwd: "siddhiio",
      roles:[{role: "userAdmin" , db:"parisTma"}]
   }
)

> db.subscriber.insert({
   vehicleId: 'v001',
   currentArea: 'a001',
   subscriberName: 'John Dus',
   subscriberEmail: 'b.wathsala.bw@gmail.com'
})

> db.subscriber.insert({
   vehicleId: 'v002',
   currentArea: 'a002',
   subscriberName: 'Natalie Jonson',
   subscriberEmail: 'b.wathsala.bw@gmail.com'
})

> db.subscriber.insert({
   vehicleId: 'v003',
   currentArea: 'a003',
   subscriberName: 'Mark Norman',
   subscriberEmail: 'buddhik@wso2.com'
})
```

### Setup MySQL

After that, you have to create a MySQL database called `paristma`. It contained a table called `Incident` to store all the weather incidents happened recently. To access the MySQL database you also need to create a user called `siddhi_user` that identified by password `siddhiio`. The incident table will look like the following.

![MySQL Incident Table](images/mysql-incident-table.png "MySQL Incident Table")

To connect to the MySQL database Siddhi tooling runtime needs the MySQL client library. You can download the [MySQL JAR from here](https://dev.mysql.com/downloads/connector/j/5.1.html) and then add the JAR to the `${TOOLING_HOME}/jars` directory.

This example uses the Siddhi CDC in the default(listening) mode. The listening mode needs to change the configurations as described [here](https://github.com/siddhi-io/siddhi-io-cdc). For example, you have to add the following configurations to the `my.cnf` file.

```sh
[mysqld]
server-id         = 223344
log_bin           = mysql-bin
binlog_format     = row
binlog_row_image  = full
expire_logs_days  = 10
gtid_mode                 = on
enforce_gtid_consistency  = on
binlog_rows_query_log_events = on
log-error=/var/log/mysql/mysql.err
log-bin = /var/log/mysql/mysql-replication.log
```

### Setup NATS Streaming Cluster

Now you need to [install a NATS streaming server](https://nats-io.github.io/docs/nats_streaming/gettingstarted/install.html). For example, to install the NATS streaming cluster in MacOS use the following commands.

```sh
$ brew install nats-streaming-server
```

After the installation runs the NATS streaming cluster as below.

```sh
$ nats-streaming-server
```

The Siddhi app runtime will need the following JARs to connect to the NATS streaming server. Download those JARs using the following links and add those JARs to `${TOOLING_HOME}/jars` directory.

- [Java NATS streaming](https://mvnrepository.com/artifact/io.nats/java-nats-streaming/2.1.2)
- [JNATS](https://mvnrepository.com/artifact/io.nats/jnats/2.3.0)

It also needs the Protobuf bundle. Download the Protobuf bundle using the following link and add the bundle to ${TOOLING_HOME}/bundles directory.

- [Protobuf](https://mvnrepository.com/artifact/com.google.protobuf/protobuf-java/3.6.1)

### Configurations

The above Siddhi apps receive the MySQL, MongoDB, and NATS connections details as environment variables. For local deployments for testing these apps, you have to set up those environmental variables as follows.

1. STAN_CLUSTER_ID=`test-cluster`
1. STAN_SERVER_URL=`nats://localhost:4222`
1. MONGODB_URI=`mongodb://127.0.0.1:27017/parisTma?&gssapiServiceName=mongodb`
1. MYSQL_URL=`jdbc:mysql://127.0.0.1:3306/paristma`
1. PARIS_TMA_EMAIL=`<TEST_EMAIL>`
1. PARIS_TMA_EMAIL_PASSWORD=`<TEST_EMAIL_PASSWORD>`

### Tryout

After all those configurations and setups you will be able to starts the both Siddhi apps without any error. Testing the app can be done in two levels.

1. Update the vehicle location periodically
1. Send notifications

To test the vehicle location updates you have to send a request to the NATS streaming server. You can send the request using various NATS clients. In this use case, you can use NATS streaming Go language client to easily send requests. To do that you need to have to install Golang in your machine. Or else you can use other clients like ([Java](https://github.com/nats-io/stan.java), [JS](https://github.com/nats-io/stan.js), [Python](https://github.com/nats-io/stan.py), or [Ruby](https://github.com/nats-io/stan.rb) etc). You can use following Golang commands to send a request to the NATS streaming cluster.

```sh
$ go get github.com/nats-io/stan.go/
$ go run $GOPATH/src/github.com/nats-io/stan.go/examples/stan-pub/main.go -s localhost:4222 -c test-cluster VehicleInputTunnel "{\"vehicleId\": \"v001\", \"currentArea\":\"a003\"}"
```

To run the notification Siddhi app you just need to insert data entry to the Incident table. When you do that it the Siddhi app will simply send an email to the subscribers like below.

![Email](images/email.png "Email")

## Deployment

### Deploy on VM/ Bare Metal

1. First, you have to set up prerequisites as described in the previous sections.
    1. [Setup MongoDB](#setup-mongodb)
    1. [Setup MySQL](#setup-mysql)
    1. [Setup NATS Streaming](#setup-nats-streaming-cluster)
1. Download the [Siddhi runner distribution pack from here](https://siddhi.io/en/v5.1/download/) and unzip it.
1. Download relevant JARs and add those JARs to `${RUNNER_HOME}/jars` directory.
    1. [MySQL](https://dev.mysql.com/downloads/connector/j/5.1.html)
    1. [Java NATS streaming](https://mvnrepository.com/artifact/io.nats/java-nats-streaming/2.1.2)
    1. [JNATS](https://mvnrepository.com/artifact/io.nats/jnats/2.3.0)
1. Download Protobuf bundle and add the bundle to `${RUNNER_HOME}/bundles` directory.
    1. [Protobuf](https://mvnrepository.com/artifact/com.google.protobuf/protobuf-java/3.6.1)
1. Copy your Siddhi file into `<RUNNER_HOME>/wso2/runner/deployment/siddhi-files`
1. Start the following binary file to run the Siddhi runner server.
    ```sh
    For Linux/Mac: <RUNNER_HOME>/bin/runner.sh
    For Windows: <RUNNER_HOME>/bin/runner.bat
    ```
1. Now you can try out the sample as described in this [tryout section](#tryout).

### Deploy on Docker

#### Prerequisite

[Install Docker](https://docs.docker.com/install/) in your machine.

#### Siddhi Docker Configurations

In the tooling editor itself, you can export your Siddhi app into a runnable docker artifact. You can go to `Export->For Docker` and it will give to a zip file that contained the following files.

```sh
├── Dockerfile
├── bundles
│   └── protobuf-java-3.6.1.jar
├── configurations.yaml
├── jars
│   ├── java_nats_streaming_2.1.2.jar
│   ├── jnats_2.3.0.jar
│   └── mysql-connector-java-5.1.45-bin.jar
└── siddhi-files
    ├── ParisTMANotifier.siddhi
    └── ParisTMAVehicleLocator.siddhi
```

When you export the apps as a Docker, it will ask for the templated values to be filled. You have to use the following values for those templated values.

1. STAN_CLUSTER_ID=`test-cluster`
1. STAN_SERVER_URL=`nats://nats:4222`
1. MONGODB_URI=`mongodb://mongodb:27017/parisTma?&gssapiServiceName=mongodb`
1. MYSQL_URL=`jdbc:mysql://mysqldb:3306/paristma`
1. PARIS_TMA_EMAIL=`<TEST_EMAIL>`
1. PARIS_TMA_EMAIL_PASSWORD=`<TEST_EMAIL_PASSWORD>`

In order to change the configurations of MySQL Docker container you have create `my.cnf` file in your current directory and add the following content to that file. Also create directory called `mysql`.

```sh
[mysqld]
server-id         = 223344
log_bin           = mysql-bin
binlog_format     = row
binlog_row_image  = full
expire_logs_days  = 10
gtid_mode                 = on
enforce_gtid_consistency  = on
binlog_rows_query_log_events = on
log-error=/var/log/mysql/mysql.err
log-bin = /var/log/mysql/mysql-replication.log
```

Now you need to have a Docker compose file like below to set up all the prerequisites. This compose file contains volume mounts to change configurations of the MySQL container.

```yaml
version: "3"
services:
    backend:
        container_name: paristma-notifier
        user: 802:802
        build:
          context: .
          dockerfile: ./Dockerfile
        links:
            - mysqldb
            - mongodb
            - nats
        networks:
            - default
        restart: on-failure

    mysqldb:
        image: 'mysql:5.7'
        container_name: paristma-mysqldb
        environment:
            MYSQL_USER: siddhi_user
            MYSQL_PASSWORD: siddhiio
            MYSQL_ROOT_PASSWORD: siddhiio
        ports:
            - "3304:3306"
        networks:
            - default
        restart: on-failure
        volumes:
            - ./my.cnf:/etc/my.cnf
            - ./mysql:/var/log/mysql
        command: --sql_mode=""

    mongodb:
        image: 'mongo:4.0.4'
        container_name: paristma-mongodb
        ports:
            - "27017-27019:27017-27019"
        networks:
            - default
        restart: on-failure

    nats:
        image: 'nats-streaming:0.16.2-linux'
        container_name: paristma-nats
        ports:
            - "4223:4223"
            - "8223:8223"
        networks:
            - default
        restart: on-failure
```

Now you can start each containers.

1. First, you need to build the Docker composer.
    ```sh
    docker-compose build
    ```
1. Starts the MySQL container using the following command and set up the MySQL database as [described above](#setup-mysql).
    ```sh
    docker-compose up -d mysqldb
    ```
1. Then, starts the MongoDB container using the following command and set up the MongoDB database as [described above](#setup-mongodb).
    ```sh
    docker-compose up -d mongodb
    ```
1. After that, starts the NATS container using the following command.
    ```sh
    docker-compose up -d nats
    ```
1. Finally, start the Siddhi backend runtime.
    ```sh
    docker-compose up -d backend
    ```
When you insert data entry to the Incident table, the Siddhi app will simply send an email to the subscribers like below.

![Email](images/email.png "Email")

### Deploy on Kubernetes

#### Prerequisites

1. Kubernetes cluster
    1. [Minikube](https://github.com/kubernetes/minikube#installation)
    1. [Google Kubernetes Engine(GKE)](https://console.cloud.google.com)
    1. [Docker for Mac](https://docs.docker.com/docker-for-mac/install/)
1. [Install HELM](https://helm.sh/docs/using_helm/#installing-helm)

#### Siddhi Kubernetes Configurations

In the tooling editor itself, you can export your Siddhi app into a runnable Kubernetes artifact. You can go to `Export->For Kubernetes` and it will give to a zip file that contained the following files.

```sh
├── Dockerfile
├── bundles
│   └── protobuf-java-3.6.1.jar
├── configurations.yaml
├── jars
│   ├── java_nats_streaming_2.1.2.jar
│   ├── jnats_2.3.0.jar
│   └── mysql-connector-java-5.1.45-bin.jar
├── siddhi-files
│   ├── ParisTMANotifier.siddhi
│   └── ParisTMAVehicleLocator.siddhi
└── siddhi-process.yaml
```

When you export the apps as a Kubernetes, it will ask for the templated values to be filled. You have to use the following values for those templated values.

1. STAN_CLUSTER_ID=`siddhi-stan`
1. STAN_SERVER_URL=`nats://siddhi-nats:4222`
1. MONGODB_URI=`mongodb://siddhi_user:siddhiio@paristma-mongodb:27017/parisTma`
1. MYSQL_URL=`jdbc:mysql://mysqldb:3306/paristma`
1. PARIS_TMA_EMAIL=`<TEST_EMAIL>`
1. PARIS_TMA_EMAIL_PASSWORD=`<TEST_EMAIL_PASSWORD>`

#### Setup MongoDB

Let’s install MongoDB in your Kubernetes cluster using Helm.

```sh
$ helm install stable/mongodb
$ helm install --name paristma --set volumePermissions.enabled=true,mongodbRootPassword=siddhiio,mongodbUsername=siddhi_user,mongodbPassword=siddhiio,mongodbDatabase=parisTma stable/mongodb 
```

Now you can access the MongoDB externally using following commands and set up the Mongo database as [described previously](#setup-mongodb).

```sh
$ export MONGODB_ROOT_PASSWORD=$(kubectl get secret --namespace default paristma-mongodb -o jsonpath="{.data.mongodb-root-password}" | base64 --decode)

$ kubectl run --namespace default paristma-mongodb-client --rm --tty -i --restart='Never' --image bitnami/mongodb --command -- mongo admin --host paristma-mongodb --authenticationDatabase admin -u root -p $MONGODB_ROOT_PASSWORD
```

#### Setup MySQL

In order to change the MySQL configurations for the Siddhi CDC extension, you need to create a file called `values.yaml` with including the following configurations.

```sh

mysqlRootPassword: siddhiio
mysqlUser: siddhi_user
mysqlPassword: siddhiio
mysqlDatabase: paristma
configurationFiles:
    my.cnf: |-
        [mysqld]
        server-id         = 223344
        log_bin           = mysql-bin
        binlog_format     = row
        binlog_row_image  = full
        expire_logs_days  = 10
        gtid_mode                 = on
        enforce_gtid_consistency  = on
        binlog_rows_query_log_events = on
        log-error=/var/log/mysql/mysql.err
        log-bin = /var/log/mysql/mysql-replication.log
```

Now you can install MySQL in you Kubernetes cluster using Helm.

```sh
$ helm install --name mysqldb -f values.yaml stable/mysql
```

Use Kubernetes port forwading to access MySQL externally using 3307 port and create nessasary tables in the MySQL database as [described previously](#setup-mysql).

```sh
$ kubectl port-forward svc/mysql-db 3307:3306
```

#### Setup NATS Streaming

Use the following kubectl commands to set up the NATS streaming cluster.

```sh
$ kubectl apply -f https://github.com/nats-io/nats-operator/releases/download/v0.5.0/00-prereqs.yaml
$ kubectl apply -f https://github.com/nats-io/nats-operator/releases/download/v0.5.0/10-deployment.yaml
$ kubectl apply -f https://github.com/nats-io/nats-streaming-operator/releases/download/v0.2.2/default-rbac.yaml
$ kubectl apply -f https://github.com/nats-io/nats-streaming-operator/releases/download/v0.2.2/deployment.yaml

$ echo '
---
apiVersion: "nats.io/v1alpha2"
kind: "NatsCluster"
metadata:
  name: "siddhi-nats"
spec:
  size: 1
' | kubectl apply -f -

$ echo '
---
apiVersion: "streaming.nats.io/v1alpha1"
kind: "NatsStreamingCluster"
metadata:
  name: "siddhi-stan"
spec:
  size: 1
  natsSvc: "siddhi-nats"
' | kubectl apply -f -
```

For more details about the NATS streaming server, refer to this [documentation](https://github.com/nats-io/nats-streaming-operator/tree/v0.2.2).

#### Setup Siddhi Operator

Use the following kubectl commands to install the Siddhi operator in your Kubernetes cluster.

```sh
$ kubectl apply -f https://github.com/siddhi-io/siddhi-operator/releases/download/v0.2.0/00-prereqs.yaml
$ kubectl apply -f https://github.com/siddhi-io/siddhi-operator/releases/download/v0.2.0/01-siddhi-operator.yaml
```

Now you need to create your own docker image with including all the custom libraries and configuration changes that you have made. Use following command to build and push the docker image with the tag `<DOCKER_HUB_USER_NAME>/siddhi-runner-alpine:latest`.

```sh
$ docker build -t <DOCKER_HUB_USER_NAME>/siddhi-runner-alpine:latest .
$ docker push <DOCKER_HUB_USER_NAME>/siddhi-runner-alpine:latest
```
After the Kubernetes export now you already have this `siddhi-process.yaml` file.

```yaml

apiVersion: siddhi.io/v1alpha2
kind: SiddhiProcess
metadata:
  name: paris-tma

spec:
  apps:
  - script: |
      @App:name("ParisTMANotifier")
      @App:description("Listen to the CDC events about the weather updates and send notifications to the subscribed users.")

      /*
      Purpose:
          The ParisTMA has subscribers that subscribe to get the service. All the subscriber details are saved in the Mongo database. In that database ParisTMA stores the current location of subscriber vehicles. There is a separate system handle by the Paris weather forecast organization. They periodically update the MySQL database called 'paristma' with recent weather incidents. This app listens to those insertions using CDC and sends notifications to the subscribers who are in that particular area that incident happens.

      Input:
          CDC insertions.

      Output:
          Email to users that notifying about the incident.
          Note: Even you can change this email notification to an SMS notification calling an SMS provider.
      */

      -- CDC source that listens to insertions of the Incident table
      @source(
          type='cdc',
          url='${MYSQL_URL}',
          username='siddhi_user',
          password='siddhiio',
          table.name='Incident',
          operation='insert',
          @map(
              type='keyvalue'
          )
      )
      define stream IncidentInputStream(incidentId int, incidentName string, incidentType string, incidentDetails string, incidentArea string);

      -- MongoDB store of subscribers
      @store(type='mongodb', mongodb.uri='${MONGODB_URI}')
      define table subscriber(vehicleId string, currentArea string, subscriberName string, subscriberEmail string);

      -- Email sink to send notifications
      @sink(type='email', username="${PARIS_TMA_EMAIL}", address="${PARIS_TMA_EMAIL}", password="${PARIS_TMA_EMAIL_PASSWORD}",
            subject="Weather Notification in {{incidentArea}}", to="{{subscriberEmail}}", host="smtp.gmail.com", port="465",
            ssl.enable="true", auth="true",
            @map(type='text',
                 @payload("""
                  Hi {{subscriberName}}

                  Recent reports state that there is {{incidentName}} in your area {{incidentArea}}. It is in {{incidentType}} state right now.

                  The report state that {{incidentDetails}}.

                  Thanks,
                  Paris Transport Management Authority""")))
      define stream UserNotificationStream (subscriberName string, subscriberEmail string, incidentName string, incidentType string, incidentDetails string, incidentArea string);

      -- Listen to the insertions in IncidentInputStream and join it with subscriber collection in MongoDB to get user information. Send notifications using that user information.
      @info(name='listen-and-notify')
      from IncidentInputStream#window.length(1) join subscriber
      on IncidentInputStream.incidentArea==subscriber.currentArea
      select
          subscriber.subscriberName,
          subscriber.subscriberEmail,
          IncidentInputStream.incidentName,
          IncidentInputStream.incidentType,
          IncidentInputStream.incidentDetails,
          IncidentInputStream.incidentArea
      insert into UserNotificationStream;
  - script: |-
      @App:name("ParisTMAVehicleLocator")
      @App:description("Listen to the events send by NATS about vehicle locations and periodically update the Mongo database.")

      /*
      Purpose:
          The ParisTMA has subscribers that subscribe to get the service. All the subscriber details are saved in the Mongo database. In that database ParisTMA stores the current location of subscriber vehicles. The events related to current locations come as TCP requests through NATS. This app listens to those events and eventually update the database with the current location of each subscriber.

      Input:
              NATS event with JSON payload:
              {
                  "vehicleId": "v001",
                  "currentArea": "a002"
              }

      Output:
          Update the collection(subscriber) documents of MongoDB(parisTma).

      */

      -- NATS source that listens to the events
      @source(
          type='nats',
          cluster.id='${STAN_CLUSTER_ID}',
          destination='VehicleInputTunnel',
          bootstrap.servers='${STAN_SERVER_URL}',
          @map(type='json')
      )
      define stream CurrentVehicleAreaInputStream(vehicleId string, currentArea string);

      -- MongoDB store
      @store(type='mongodb', mongodb.uri='${MONGODB_URI}')
      define table subscriber(vehicleId string, currentArea string);

      -- Retrieves events from NATS source and update in MongoDB
      @info(name='update-or-insert-subscriber-location')
      from CurrentVehicleAreaInputStream
      update or insert into subscriber
      on subscriber.vehicleId==vehicleId;
  container:
    env:
    - name: MYSQL_URL
      value: jdbc:mysql://mysqldb:3306/paristma
    - name: MONGODB_URI
      value: mongodb://siddhi_user:siddhiio@paristma-mongodb:27017/parisTma
    - name: PARIS_TMA_EMAIL
      value: <TEST_EMAIL>
    - name: PARIS_TMA_EMAIL_PASSWORD
      value: <TEST_EMAIL_PASSWORD>
    - name: STAN_CLUSTER_ID
      value: siddhi-stan
    - name: STAN_SERVER_URL
      value: nats://siddhi-nats:4222
    image: <DOCKER_HUB_USER_NAME>/siddhi-runner-alpine:latest
  runner: |
    wso2.carbon:
      id: siddhi-runner
      name: Siddhi Runner Distribution
      ports:
        offset: 0
    transports:
      http:
        listenerConfigurations:
        - id: default
          host: 0.0.0.0
          port: 9090
        - id: msf4j-https
          host: 0.0.0.0
          port: 9443
          scheme: https
          keyStoreFile: ${carbon.home}/resources/security/wso2carbon.jks
          keyStorePassword: wso2carbon
          certPass: wso2carbon
        transportProperties:
        - name: server.bootstrap.socket.timeout
          value: 60
        - name: client.bootstrap.socket.timeout
          value: 60
        - name: latency.metrics.enabled
          value: true
    dataSources:
    - name: WSO2_CARBON_DB
      description: The datasource used for registry and user manager
      definition:
        type: RDBMS
        configuration:
          jdbcUrl: jdbc:h2:${sys:carbon.home}/wso2/${sys:wso2.runtime}/database/WSO2_CARBON_DB;DB_CLOSE_ON_EXIT=FALSE;LOCK_TIMEOUT=60000
          username: wso2carbon
          password: wso2carbon
          driverClassName: org.h2.Driver
          maxPoolSize: 10
          idleTimeout: 60000
          connectionTestQuery: SELECT 1
          validationTimeout: 30000
          isAutoCommit: false
```

Now you can install the SiddhiProcess using following `kubectl` command. Before you install the `SiddhiProcess` you have to add the docker image tag in the `siddhi-process.yaml` file. You have to add the docker image name(<DOCKER_HUB_USER_NAME>/siddhi-runner-alpine:latest) in the YAML entry `spec.container.image`.

```sh
$ kubectl apply -f siddhi-process.yaml
```

If all the Kubernetes artifacts deployed correctly, it will show the status like below.

```sh
$ kubectl get deploy

NAME                      READY     UP-TO-DATE   AVAILABLE   AGE
bold-boxer-mongodb        1/1       1            1           2h
mysqldb                   1/1       1            1           2h
nats-operator             1/1       1            1           2h
nats-streaming-operator   1/1       1            1           2h
paris-tma-0               1/1       1            1           2h
paris-tma-1               1/1       1            1           2h
paristma-mongodb          1/1       1            1           2h
siddhi-operator           1/1       1            1           2h
tiller-deploy             1/1       1            1           2h

$ kubectl get svc

NAME                 TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
bold-boxer-mongodb   ClusterIP   10.100.153.173   <none>        27017/TCP                    2h
kubernetes           ClusterIP   10.96.0.1        <none>        443/TCP                      21d
mysqldb              ClusterIP   10.106.112.140   <none>        3306/TCP                     2h
paristma-mongodb     ClusterIP   10.102.211.214   <none>        27017/TCP                    2h
siddhi-nats          ClusterIP   10.110.123.222   <none>        4222/TCP                     2h
siddhi-nats-mgmt     ClusterIP   None             <none>        6222/TCP,8222/TCP,7777/TCP   2h
siddhi-operator      ClusterIP   10.102.157.184   <none>        8383/TCP                     2h
tiller-deploy        ClusterIP   10.103.160.179   <none>        44134/TCP                    2h
$ kubectl get siddhi
NAME        STATUS    READY     AGE
paris-tma   Running   2/2       2h
```

When you insert data entry to the Incident table, the Siddhi app will simply send an email to the subscribers like below.

![Email](images/email.png "Email")
