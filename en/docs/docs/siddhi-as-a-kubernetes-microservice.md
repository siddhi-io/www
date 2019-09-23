# Siddhi 5.2 as a Kubernetes Microservice

This section provides information on running [Siddhi Apps](../introduction/#siddhi-application) natively in Kubernetes via Siddhi Kubernetes Operator.

Siddhi can be configured using `SiddhiProcess` kind and passed to the Siddhi operator for deployment.
Here, the Siddhi applications containing stream processing logic can be written inline in `SiddhiProcess` yaml or passed as `.siddhi` files via contig maps. `SiddhiProcess` yaml can also be configured with the necessary system configurations.

## Prerequisites

* A Kubernetes cluster v1.10.11 or higher.

    1. [Minikube](https://github.com/kubernetes/minikube#installation)
    2. [Google Kubernetes Engine(GKE) Cluster](https://console.cloud.google.com/)
    3. [Docker for Mac](https://docs.docker.com/docker-for-mac/install/)
    4. Or any other Kubernetes cluster
* Distributed deployment of Siddhi apps need [NATS operator](https://github.com/nats-io/nats-operator/tree/v0.6.0#namespace-scoped-installation) and [NATS streaming operator](https://github.com/nats-io/nats-streaming-operator/tree/v0.2.2#getting-started).
* Admin privileges to install Siddhi operator  

!!! Note "Minikube"
    Siddhi operator automatically creates NGINX ingress. Therefore it to work we can either enable ingress on Minikube using the following command.
    <pre>
    minikube addons enable ingress
    </pre>
    or disable Siddhi operator's [automatically ingress creation](#deploy-siddhi-apps-without-ingress-creation).

!!! Note "Google Kubernetes Engine (GKE) Cluster"
    To install Siddhi operator, you have to give cluster admin permission to your account. In order to do that execute the following command (by replacing "your-address@email.com" with your account email address). 
    <pre>kubectl create clusterrolebinding user-cluster-admin-binding \ 
            --clusterrole=cluster-admin --user=your-address@email.com
    </pre>  
    
!!! Note "Docker for Mac"
    Siddhi operator automatically creates NGINX ingress. Therefore it to work we can either enable ingress on Docker for mac following the official [documentation](https://kubernetes.github.io/ingress-nginx/deploy/#docker-for-mac)
    or disable Siddhi operator's [automatically ingress creation](#deploy-siddhi-apps-without-ingress-creation).
    
!!! Note "Port Forwarding for Testing & Debugging Purposes"
    Instead of creating ingress you can enable port forwarding (`kubectl port-forward`) to access the application in the Kubernetes cluster. This will help a lot for TCP connections as well.
    <pre>kubectl port-forward svc/mysql-db 13306:3306
    </pre>
    For more details please refer this Kubernetes official [documentation](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/#forward-a-local-port-to-a-port-on-the-pod)
    
## Install Siddhi Operator

To install the Siddhi Kubernetes operator run the following commands.

```sh
kubectl apply -f https://github.com/siddhi-io/siddhi-operator/releases/download/v0.2.0-beta/00-prereqs.yaml
kubectl apply -f https://github.com/siddhi-io/siddhi-operator/releases/download/v0.2.0-beta/01-siddhi-operator.yaml
```

You can verify the installation by making sure the following deployments are running in your Kubernetes cluster.

```sh
$ kubectl get deployment

NAME              DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
siddhi-operator   1         1         1            1           1m
```

!!! Note "Using a custom-built Siddhi runner image"
    If you need to use a custom-built `siddhi-runner` image for all the `SiddhiProcess` deployments, you have to configure `siddhiRunnerImage` entry in `siddhi-operator-config` config map.
    Refer the documentation on creating custom Siddhi runner images bundling additional JARs [here](../docs/config-guide.md#adding-to-siddhi-docker-microservice).
    If you are pulling the custom-built image from a private Docker registry/repository, specify the corresponding kubernetes secret as `siddhiRunnerImageSecret` entry in `siddhi-operator-config` config map. For more details on using docker images from private registries/repositories refer [this documentation](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/).

## Deploy and run Siddhi App

Siddhi applications can be deployed on Kubernetes using the Siddhi operator.

Here we will be creating a very simple Siddhi stream processing application that receives power consumption from several devices in a house. If the power consumption of dryer exceeds the consumption limit of 6000W then that Siddhi app sends an alert from printing a log.

This can be created using a SiddhiProcess YAML file as given below.

```yaml
apiVersion: siddhi.io/v1alpha2
kind: SiddhiProcess
metadata:
  name: power-surge-app
spec:
  apps:
    - script: |
        @App:name("PowerSurgeDetection")
        @App:description("App consume events from HTTP as a JSON message of { 'deviceType': 'dryer', 'power': 6000 } format and inserts the events into DevicePowerStream, and alerts the user if the power level is greater than or equal to 600 by printing a message in the log.")

        /*
            Input: deviceType string and powerConsuption int(Watt)
            Output: Alert user from printing a log, if there is a power surge in the dryer. In other words, notify when power is greater than or equal to 600W.

        */
        @source(
          type='http',
          receiver.url='${RECEIVER_URL}',
          basic.auth.enabled='false',
          @map(type='json')
        )
        define stream DevicePowerStream(deviceType string, power int);

        @sink(type='log', prefix='LOGGER')  
        define stream PowerSurgeAlertStream(deviceType string, power int); 

        @info(name='power-filter')  
        from DevicePowerStream[deviceType == 'dryer' and power >= 600] 
        select deviceType, power  
        insert into PowerSurgeAlertStream;

  container:
    env:
      -
        name: RECEIVER_URL
        value: "http://0.0.0.0:8080/checkPower"

    image: "siddhiio/siddhi-runner-ubuntu:5.1.0-beta"
```

!!! Note "Always listen on 0.0.0.0 with the Siddhi Application running inside a container environment."
    If you listen on localhost inside the container, nothing outside the container can connect to your application. 
    
!!! Tip "Siddhi Tooling"
    You can also use the powerful [Siddhi Editor](../../quckstart/#3-using-siddhi-for-the-first-time) to implement and test steam processing applications. 

!!! Info "Configuring Siddhi"
    To configure databases, extensions, authentication, periodic state persistence, and statistics for Siddhi as Kubernetes Microservice refer [Siddhi Config Guide](../config-guide/). 

To deploy the above Siddhi app in your Kubernetes cluster, copy above YAML to a file with name `power-surge-app.yaml` and execute the following command.

```sh
kubectl create -f <absolute-yaml-file-path>/power-surge-app.yaml
```

!!! Note "TLS secret"
    Within the SiddhiProcess, a TLS secret named `siddhi-tls` is configured. If a Kubernetes secret with the same name does not exist in the Kubernetes cluster, the NGINX will ignore it and use a self-generated certificate. Configuring a secret will be necessary for calling HTTPS endpoints, refer [deploy and run Siddhi apps with HTTPS](#deploy-and-run-siddhi-app-with-https) section for more details.

If the `power-surge-app` is deployed successfully, it should create SiddhiProcess, deployment, service, and ingress as following.

```sh
$ kubectl get SiddhiProcesses
NAME              STATUS    READY     AGE
power-surge-app   Running   1/1       2m

$ kubectl get deployment
NAME                READY     UP-TO-DATE   AVAILABLE   AGE
power-surge-app-0   1/1       1            1           2m
siddhi-operator     1/1       1            1           2m

$ kubectl get service
NAME                TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
kubernetes          ClusterIP   10.96.0.1       <none>        443/TCP    2d
power-surge-app-0   ClusterIP   10.96.44.182    <none>        8080/TCP   2m
siddhi-operator     ClusterIP   10.98.78.238    <none>        8383/TCP   2m

$ kubectl get ingress
NAME      HOSTS     ADDRESS     PORTS     AGE
siddhi    siddhi    10.0.2.15   80        2m
```

!!! Note "Using a custom-built Siddhi runner image"
    If you need to use a custom-built `siddhi-runner` image for a specific `SiddhiProcess` deployment, you have to configure `container.image` spec in the `power-surge-app.yaml`.
    Refer the documentation on creating custom Siddhi runner images bundling additional JARs [here](../docs/config-guide.md#adding-to-siddhi-docker-microservice).
    If you are pulling the custom-built image from a private Docker registry/repository, specify the corresponding kubernetes secret as `imagePullSecret` argument in the `power-surge-app.yaml` file. For more details on using docker images from private registries/repositories refer [this documentation](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/).

**_Invoke Siddhi Applications_**

To invoke the Siddhi App, obtain the external IP of the ingress load balancer using `kubectl get ingress` command as following.

```sh
$ kubectl get ingress
NAME      HOSTS     ADDRESS     PORTS     AGE
siddhi    siddhi    10.0.2.15   80        2m
```

Then, add the host `siddhi` and related external IP (`ADDRESS`) to the `/etc/hosts` file in your machine.

!!! Note "Minikube"
    For Minikube, you have to use Minikube IP as the external IP. Hence, run `minikube ip` command to get the IP of the Minikube cluster.

!!! Note "Docker for Mac"
    For Docker for Mac, you have to use `0.0.0.0` as the external IP.

Use the following CURL command to send events to `power-surge-app` deployed in Kubernetes.

```sh
curl -X POST \
  http://siddhi/power-surge-app-0/8080/checkPower \
  -H 'Accept: */*' \
  -H 'Content-Type: application/json' \
  -H 'Host: siddhi' \
  -d '{
	"deviceType": "dryer",
	"power": 60000
}'
```

**_View Siddhi Process Logs_**

Since the output of `power-surge-app` is logged, you can see the output by monitoring the associated pod's logs.

To find the `power-surge-app` pod use the `kubectl get pods` command. This will list down all the deployed pods.

```sh
$ kubectl get pods

NAME                                       READY     STATUS    RESTARTS   AGE
power-surge-app-0-646c4f9dd5-rxzkq         1/1       Running   0          4m
siddhi-operator-6698d8f69d-6rfb6           1/1       Running   0          4m
```

Here, the pod starting with the SiddhiProcess name (in this case `power-surge-app-`) is the pod we need to monitor.

To view the logs, run the `kubectl logs <pod name>` command.
This will show all the Siddhi process logs, along with the filtered output events as given below.

```sh
$ kubectl logs power-surge-app-0-646c4f9dd5-rxzkq

...
[2019-07-12 07:12:48,925]  INFO {org.wso2.transport.http.netty.contractimpl.listener.ServerConnectorBootstrap$HttpServerConnector} - HTTP(S) Interface starting on host 0.0.0.0 and port 9443
[2019-07-12 07:12:48,927]  INFO {org.wso2.transport.http.netty.contractimpl.listener.ServerConnectorBootstrap$HttpServerConnector} - HTTP(S) Interface starting on host 0.0.0.0 and port 9090
[2019-07-12 07:12:48,941]  INFO {org.wso2.carbon.kernel.internal.CarbonStartupHandler} - Siddhi Runner Distribution started in 6.853 sec
[2019-07-12 07:17:22,219]  INFO {io.siddhi.core.stream.output.sink.LogSink} - LOGGER : Event{timestamp=1562915842182, data=[dryer, 60000], isExpired=false}
```

## Get Siddhi process status

### List Siddhi processes

List the Siddhi process using the `kubectl get sps` or `kubectl get SiddhiProcesses` commands as follows.

```sh
$ kubectl get sps
NAME              STATUS    READY     AGE
power-surge-app   Running   1/1       5m

$ kubectl get SiddhiProcesses
NAME              STATUS    READY     AGE
power-surge-app   Running   1/1       5m
```

### View Siddhi process configs

Describe the Siddhi process configuration details using `kubectl describe sp` command as follows.

```sh
$ kubectl describe sp power-surge-app

Name:         power-surge-app
Namespace:    default
Labels:       <none>
Annotations:  kubectl.kubernetes.io/last-applied-configuration={"apiVersion":"siddhi.io/v1alpha2","kind":"SiddhiProcess","metadata":{"annotations":{},"name":"power-surge-app","namespace":"default"},"spec":{"apps":[...
API Version:  siddhi.io/v1alpha2
Kind:         SiddhiProcess
Metadata:
  Creation Timestamp:  2019-07-12T07:12:35Z
  Generation:          1
  Resource Version:    148205
  Self Link:           /apis/siddhi.io/v1alpha2/namespaces/default/siddhiprocesses/power-surge-app
  UID:                 6c6d90a4-a474-11e9-a05b-080027f4eb25
Spec:
  Apps:
    Script:  @App:name("PowerSurgeDetection")
@App:description("App consume events from HTTP as a JSON message of { 'deviceType': 'dryer', 'power': 6000 } format and inserts the events into DevicePowerStream, and alerts the user if the power level is greater than or equal to 600 by printing a message in the log.")

/*
    Input: deviceType string and powerConsuption int(Watt)
    Output: Alert user from printing a log, if there is a power surge in the dryer. In other words, notify when power is greater than or equal to 600W.

*/
@source(
  type='http',
  receiver.url='${RECEIVER_URL}',
  basic.auth.enabled='false',
  @map(type='json')
)
define stream DevicePowerStream(deviceType string, power int);

@sink(type='log', prefix='LOGGER')  
define stream PowerSurgeAlertStream(deviceType string, power int); 

@info(name='power-filter')  
from DevicePowerStream[deviceType == 'dryer' and power >= 600] 
select deviceType, power  
insert into PowerSurgeAlertStream;

  Container:
    Env:
      Name:   RECEIVER_URL
      Value:  http://0.0.0.0:8080/checkPower
      Name:   BASIC_AUTH_ENABLED
      Value:  false
    Image:    siddhiio/siddhi-runner-ubuntu:5.1.0-beta
Status:
  Nodes:   <nil>
  Ready:   1/1
  Status:  Running
Events:
  Type    Reason             Age   From                      Message
  ----    ------             ----  ----                      -------
  Normal  DeploymentCreated  11m   siddhiprocess-controller  power-surge-app-0 deployment created successfully
  Normal  ServiceCreated     11m   siddhiprocess-controller  power-surge-app-0 service created successfully
```

### View Siddhi process logs

To view the Siddhi process logs, first get the Siddhi process pods using the `kubectl get pods` command as follows.  

```sh
$ kubectl get pods

NAME                                       READY     STATUS    RESTARTS   AGE
power-surge-app-0-646c4f9dd5-rxzkq         1/1       Running   0          4m
siddhi-operator-6698d8f69d-6rfb6           1/1       Running   0          4m
```

Then to retrieve the Siddhi process logs, run `kubectl logs <pod name>` command. Here `<pod name>` should be replaced with the name of the pod that starts with the relevant SiddhiProcess's name. 
A sample output logs are of this command is as follows.

```sh
$ kubectl logs power-surge-app-0-646c4f9dd5-rxzkq

...
[2019-07-12 07:12:48,925]  INFO {org.wso2.transport.http.netty.contractimpl.listener.ServerConnectorBootstrap$HttpServerConnector} - HTTP(S) Interface starting on host 0.0.0.0 and port 9443
[2019-07-12 07:12:48,927]  INFO {org.wso2.transport.http.netty.contractimpl.listener.ServerConnectorBootstrap$HttpServerConnector} - HTTP(S) Interface starting on host 0.0.0.0 and port 9090
[2019-07-12 07:12:48,941]  INFO {org.wso2.carbon.kernel.internal.CarbonStartupHandler} - Siddhi Runner Distribution started in 6.853 sec
[2019-07-12 07:17:22,219]  INFO {io.siddhi.core.stream.output.sink.LogSink} - LOGGER : Event{timestamp=1562915842182, data=[dryer, 60000], isExpired=false}
```

## Change the Default Configurations of Siddhi Runner

Siddhi runner use `<SIDDHI_RUNNER_HOME>/conf/runner/deployment.yaml` file as the default configuration file. In the `deployment.yaml` the file you can configure data sources that you planned to use, add refs, and enable state persistence, etc. To change the configurations of the `deployment.yaml`, you can add `runner` YAML spec like below to your SiddhiProcess YAML file. For example, the following config change will enable file system state persistence.

```yaml
  runner: |
    state.persistence:
      enabled: true
      intervalInMin: 1
      revisionsToKeep: 2
      persistenceStore: io.siddhi.distribution.core.persistence.FileSystemPersistenceStore
      config:
        location: siddhi-app-persistence
```

## Deploy and run Siddhi App using config maps

Siddhi operator allows you to deploy Siddhi app configurations via config maps instead of just adding them inline. Through this, you can also run multiple Siddhi Apps in a single SiddhiProcess.

This can be done by passing the config maps containing Siddhi app files to the SiddhiProcess's apps configuration as follows.

```yaml
apps:
  - configMap: power-surge-cm1
  - configMap: power-surge-cm2
```

**Sample on deploying and running Siddhi Apps via config maps**

Here we will be creating a very simple Siddhi stream processing application that receives power consumption from several devices in a house. If the power consumption of dryer exceeds the consumption limit of 6000W then that Siddhi app sends an alert from printing a log.

```programming
@App:name("PowerSurgeDetection")
@App:description("App consume events from HTTP as a JSON message of { 'deviceType': 'dryer', 'power': 6000 } format and inserts the events into DevicePowerStream, and alerts the user if the power level is greater than or equal to 600 by printing a message in the log.")

/*
    Input: deviceType string and powerConsuption int(Watt)
    Output: Alert user from printing a log, if there is a power surge in the dryer. In other words, notify when power is greater than or equal to 600W.

*/
@source(
  type='http',
  receiver.url='${RECEIVER_URL}',
  basic.auth.enabled='false',
  @map(type='json')
)
define stream DevicePowerStream(deviceType string, power int);

@sink(type='log', prefix='LOGGER')  
define stream PowerSurgeAlertStream(deviceType string, power int); 

@info(name='power-filter')  
from DevicePowerStream[deviceType == 'dryer' and power >= 600] 
select deviceType, power  
insert into PowerSurgeAlertStream;
```

!!! Tip "Siddhi Tooling"
    You can also use the powerful [Siddhi Editor](../../quckstart/#3-using-siddhi-for-the-first-time) to implement and test steam processing applications. 

Save the above Siddhi App file as `PowerSurgeDetection.siddhi`, and use this file to create a Kubernetes config map with the name `power-surge-cm`.
This can be achieved by running the following command.

```sh
kubectl create configmap power-surge-cm --from-file=<absolute-file-path>/PowerSurgeDetection.siddhi
```

The created config map can be added to SiddhiProcess YAML under the `apps` entry as follows.

```yaml
apiVersion: siddhi.io/v1alpha2
kind: SiddhiProcess
metadata:
  name: power-surge-app
spec: 
  apps: 
    - configMap: power-surge-cm
  container: 
    env: 
      - 
        name: RECEIVER_URL
        value: "http://0.0.0.0:8080/checkPower"

    image: "siddhiio/siddhi-runner-ubuntu:5.1.0-beta"

```

Save the YAML file as `power-surge-app.yaml`, and use the following command to deploy the SiddhiProcess.

```
kubectl create -f <absolute-yaml-file-path>/power-surge-app.yaml
```

!!! Note "Using a config, created from a directory containing multiple Siddhi files"
    SiddhiProcess's `apps.configMap` configuration also supports a config map that is created from a directory containing multiple Siddhi files.
    Use `kubectl create configmap siddhi-apps --from-file=<DIRECTORY_PATH>` command to create a config map from a directory.


**_Invoke Siddhi Applications_**

To invoke the Siddhi App, first obtain the external IP of the ingress load balancer using `kubectl get ingress` command as follows.

```sh
$ kubectl get ingress
NAME      HOSTS     ADDRESS     PORTS     AGE
siddhi    siddhi    10.0.2.15   80        2m
```

Then, add the host `siddhi` and related external IP (`ADDRESS`) to the `/etc/hosts` file in your machine.

!!! Note "Minikube"
    For Minikube, you have to use Minikube IP as the external IP. Hence, run `minikube ip` command to get the IP of the Minikube cluster.

Use the following CURL command to send events to `power-surge-app` deployed in Kubernetes.

```sh
curl -X POST \
  http://siddhi/power-surge-app-0/8080/checkPower \
  -H 'Accept: */*' \
  -H 'Content-Type: application/json' \
  -H 'Host: siddhi' \
  -H 'cache-control: no-cache' \
  -d '{
	"deviceType": "dryer",
	"power": 60000
}'
```


**_View Siddhi Process Logs_**

Since the output of `power-surge-app` is logged, you can see the output by monitoring the associated pod's logs.
 
To find the `power-surge-app` pod use the `kubectl get pods` command. This will list down all the deployed pods.

```sh
$ kubectl get pods

NAME                                       READY     STATUS    RESTARTS   AGE
power-surge-app-0-646c4f9dd5-tns7l         1/1       Running   0          2m
siddhi-operator-6698d8f69d-6rfb6           1/1       Running   0          8m
```

Here, the pod starting with the SiddhiProcess name (in this case `power-surge-app-`) is the pod we need to monitor.

To view the logs, run the `kubectl logs <pod name>` command.
This will show all the Siddhi process logs, along with the filtered output events as given below.

```sh
$ kubectl logs power-surge-app-0-646c4f9dd5-tns7l

...
[2019-07-12 07:50:32,861]  INFO {org.wso2.carbon.kernel.internal.CarbonStartupHandler} - Siddhi Runner Distribution started in 8.048 sec
[2019-07-12 07:50:32,864]  INFO {org.wso2.transport.http.netty.contractimpl.listener.ServerConnectorBootstrap$HttpServerConnector} - HTTP(S) Interface starting on host 0.0.0.0 and port 9443
[2019-07-12 07:50:32,866]  INFO {org.wso2.transport.http.netty.contractimpl.listener.ServerConnectorBootstrap$HttpServerConnector} - HTTP(S) Interface starting on host 0.0.0.0 and port 9090
[2019-07-12 07:51:42,488]  INFO {io.siddhi.core.stream.output.sink.LogSink} - LOGGER : Event{timestamp=1562917902484, data=[dryer, 60000], isExpired=false}
```

## Deploy Siddhi Apps without Ingress creation

By default, Siddhi operator creates an NGINX ingress and exposes your HTTP/HTTPS through that ingress. If you need to disable automatic ingress creation, you have to change the `autoIngressCreation` value in the Siddhi `siddhi-operator-config` config map to `false` or `null` as below.

```yaml
# This config map used to parse configurations to the Siddhi operator.
apiVersion: v1
kind: ConfigMap
metadata:
  name: siddhi-operator-config
data:
  siddhiHome: /home/siddhi_user/siddhi-runner/
  siddhiProfile: runner
  siddhiImage: siddhiio/siddhi-runner-alpine:5.1.0-beta
  autoIngressCreation: "false"
```

## Deploy and run Siddhi App with HTTPS

Configuring TLS will allow Siddhi ingress NGINX to expose HTTPS endpoints of your Siddhi Apps. To do so, create a Kubernetes secret(`siddhi-tls`) and add that to the TLS configuration in `siddhi-operator-config` config map as given below.

```yaml
ingressTLS: siddhi-tls
```

**Sample on deploying and running Siddhi App with HTTPS**

First, you need to create a certificate using the following commands. For more details about the certificate creation refers [this](https://github.com/kubernetes/ingress-nginx/blob/master/docs/user-guide/tls.md#tls-secrets).

```sh
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout siddhi.key -out siddhi.crt -subj "/CN=siddhi/O=siddhi"
```

After that, create a kubernetes secret called `siddhi-tls`, which we intended to add to the TLS configurations using the following command.

```sh
kubectl create secret tls siddhi-tls --key siddhi.key --cert siddhi.crt
```

The created secret then need to be added to the `siddhi-operator-config` config map as follow.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: siddhi-operator-config
data:
  siddhiHome: /home/siddhi_user/siddhi-runner/
  siddhiProfile: runner
  siddhiImage: siddhiio/siddhi-runner-ubuntu:5.1.0-beta
  autoIngressCreation: "true"
  ingressTLS: siddhi-tls
```

When this is done Siddhi operator will now enable TLS support via the NGINX ingress, and you will be able to access all the HTTPS endpoints.

**_Invoke Siddhi Applications_**

You can use now send the events to following HTTPS endpoint.

```sh
https://siddhi/power-surge-app-0/8080/checkPower
```

Further, you can use the following CURL command to send a request to the deployed Siddhi applications via HTTPS.

```sh
curl --cacert siddhi.crt -X POST \
  https://siddhi/power-surge-app-0/8080/checkPower \
  -H 'Accept: */*' \
  -H 'Content-Type: application/json' \
  -H 'Host: siddhi' \
  -H 'cache-control: no-cache' \
  -d '{
	"deviceType": "dryer",
	"power": 60000
}'
```

**_View Siddhi Process Logs_**

The output logs show the event that you sent using the previous CURL command.

```
$ kubectl get pods

NAME                                       READY     STATUS    RESTARTS   AGE
power-surge-app-0-646c4f9dd5-kk5md         1/1       Running   0          2m
siddhi-operator-6698d8f69d-6rfb6           1/1       Running   0          10m
$ kubectl logs monitor-app-667c97c898-rrtfs
...
[2019-07-12 09:06:15,173]  INFO {org.wso2.transport.http.netty.contractimpl.listener.ServerConnectorBootstrap$HttpServerConnector} - HTTP(S) Interface starting on host 0.0.0.0 and port 9443
[2019-07-12 09:06:15,184]  INFO {org.wso2.transport.http.netty.contractimpl.listener.ServerConnectorBootstrap$HttpServerConnector} - HTTP(S) Interface starting on host 0.0.0.0 and port 9090
[2019-07-12 09:06:15,187]  INFO {org.wso2.carbon.kernel.internal.CarbonStartupHandler} - Siddhi Runner Distribution started in 10.819 sec
[2019-07-12 09:07:50,098]  INFO {io.siddhi.core.stream.output.sink.LogSink} - LOGGER : Event{timestamp=1562922470093, data=[dryer, 60000], isExpired=false}
```

## Deploy and Run Siddhi App with TCP Endpoints

The default ingress creation of the Siddhi operator allows accessing HTTP/HTTPS endpoints externally. By default, it will not support TCP endpoints. Sometimes you may have some TCP endpoints to configure like NATS and Kafka sources and access those endpoints externally.

```sql
@source(type='nats', @map(type='text'), destination='SP_NATS_INPUT_TEST', bootstrap.servers='nats://localhost:4222',client.id='nats_client',server.id='test-cluster',queue.group.name = 'group_nats',durable.name = 'nats-durable',subscription.sequence = '100')
define stream inputStream (name string, age int, country string);
```

To access these TCP connections externally you can do it as in the following example.

First, you have to disable [automatic ingress creation in the Siddhi operator](#deploy-siddhi-apps-without-ingress-creation). Then you have to manually create ingress and enable the TCP configurations. To enable TCP configurations in NGINX ingress [please refer to this documentation](https://kubernetes.github.io/ingress-nginx/user-guide/exposing-tcp-udp-services/). 

To create NATS cluster you will need a NATS spec like below.

```yaml
apiVersion: nats.io/v1alpha2
kind: NatsCluster
metadata:
  name: nats-siddhi
spec:
  size: 1
```

Save this yaml as `nats-cluster.yaml` and deploy it using `kubeclt`.

```sh
$ kubeclt apply -f nats-cluster.yaml
```

Likewise, create a nats streaming cluster as below.

```yaml
apiVersion: streaming.nats.io/v1alpha1
kind: NatsStreamingCluster
metadata:
  name: stan-siddhi
spec:
  size: 1
  natsSvc: nats-siddhi
```

Save this yaml as `stan-cluster.yaml` and deploy it using `kubeclt`.

```sh
$ kubeclt apply -f stan-cluster.yaml
```

Now you can deploy the following Siddhi app that contained a NATS source.

```yaml
apiVersion: siddhi.io/v1alpha2
kind: SiddhiProcess
metadata: 
  name: power-consume-app
spec: 
  apps: 
    - script: |
        @App:name("PowerConsumptionSurgeDetection")
        @App:description("App consumes events from NATS as a text message of { 'deviceType': 'dryer', 'power': 6000 } format and inserts the events into DevicePowerStream, and alerts the user if the power consumption in 1 minute is greater than or equal to 10000W by printing a message in the log for every 30 seconds.")

        /*
            Input: deviceType string and powerConsuption int(Joules)
            Output: Alert user from printing a log, if there is a power surge in the dryer within 1 minute period. 
                    Notify the user in every 30 seconds when total power consumption is greater than or equal to 10000W in 1 minute time period.
        */

        @source(
          type='nats',
          cluster.id='siddhi-stan',
          destination = 'PowerStream', 
          bootstrap.servers='nats://siddhi-nats:4222',
          @map(type='text')
        )
        define stream DevicePowerStream(deviceType string, power int);

        @sink(type='log', prefix='LOGGER')
        define stream PowerSurgeAlertStream(deviceType string, powerConsumed long);

        @info(name='surge-detector')
        from DevicePowerStream#window.time(1 min)
        select deviceType, sum(power) as powerConsumed
        group by deviceType
        having powerConsumed > 10000
        output every 30 sec
        insert into PowerSurgeAlertStream;

  container: 
    image: "siddhiio/siddhi-runner-ubuntu:5.1.0-beta"
  
  persistentVolumeClaim: 
    accessModes: 
      - ReadWriteOnce
    resources: 
      requests: 
        storage: 1Gi
    storageClassName: standard
    volumeMode: Filesystem
  
  runner: |
    state.persistence:
      enabled: true
      intervalInMin: 1
      revisionsToKeep: 2
      persistenceStore: io.siddhi.distribution.core.persistence.FileSystemPersistenceStore
      config:
        location: siddhi-app-persistence
```

Save this yaml as `power-consume-app.yaml` and deploy it using `kubeclt`.

```sh
$ kubeclt apply -f power-consume-app.yaml
```

This commands will create Kubernetes artifacts like below.

```sh
$ kubectl get svc
NAME                  TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
kubernetes            ClusterIP      10.96.0.1        <none>        443/TCP                      12d
power-consume-app-0   ClusterIP      10.99.148.217    <none>        4222/TCP                     5m
siddhi-nats           ClusterIP      10.105.250.215   <none>        4222/TCP                     5m
siddhi-nats-mgmt      ClusterIP      None             <none>        6222/TCP,8222/TCP,7777/TCP   5m
siddhi-operator       ClusterIP      10.102.251.237   <none>        8383/TCP                     5m

$ kubectl get pods
NAME                                       READY     STATUS    RESTARTS   AGE
nats-operator-b8f4977fc-8gnjd              1/1       Running   0          5m
nats-streaming-operator-64b565bcc7-r9rpw   1/1       Running   0          5m
power-consume-app-0-84f6774bd8-jl95w       1/1       Running   0          5m
siddhi-nats-1                              1/1       Running   0          5m
siddhi-operator-6c6c5d8fcc-hvl7j           1/1       Running   0          5m
siddhi-stan-1                              1/1       Running   0          5m
```

Now you have to create an ingress for the `siddhi-nats` service.

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: siddhi-nats
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - http:
      paths:
      - path: /nats
        backend:
          serviceName: siddhi-nats
          servicePort: 4222
```

Save this yaml as `siddhi-nats.yaml` and deploy it using `kubeclt`.

```sh
$ kubeclt apply -f siddhi-nats.yaml
```

Now you can send messages directly to the NATS streaming server that running on your Kubernetes cluster. You have to send those messages to `nats://<KUBERNETES_CLUSTER_IP>:4222` URI. To send messages to this NATS streaming cluster you can use a Siddhi app that has NATS sink or samples provided by NATS.

!!! Note "Minikube External TCP Access"
    The TCP configuration change that described in the ingress NGINX [documentation](https://kubernetes.github.io/ingress-nginx/user-guide/exposing-tcp-udp-services/) occurred connection refused problems in Minikube. To configure TCP external access properly in Minikube please refer to the steps described in [this comment](https://github.com/nats-io/nats-streaming-operator/issues/41#issuecomment-488625055).

## Deploy and run Siddhi App in Distributed Mode

Siddhi apps can be in two different types.

1. Stateless Siddhi apps
1. Stateful Siddhi apps

The deployment of the stateful Siddhi apps follows distributed architecture to ensure high availability. The fully distributed scenario of Siddhi deployments handle using Siddhi [distributed annotations](./query-guide/#distributed-sink).

<table>
  <tr>
    <th width='20%'></th>
    <th width='38%'><b>Without Messaging System</b></th>
    <th width='42%'><b>With Messaging System</b></th>
  </tr>
  <tr>
    <td><b>Without Distributed Annotations</b></td>
    <td><b>Case 1</b>: The given Siddhi app will be deployed in a stateless mode in a single kubernetes deployment.</td>
    <td>
      <b>Case 2</b>: If given Siddhi app contains stateful queries then the Siddhi app divided into two partial Siddhi apps (passthrough and process) and deployed in two kubernetes deployments. Use the configured messaging system to communicate between two apps.
    </td>
  </tr>
  <tr>
    <td><b>With Distributed Annotations</b></td>
    <td><b>Case 3</b>: WIP(Work In Progress)</td>
    <td><b>Case 4</b>: WIP(Work In Progress)</td>
  </tr>
</table>

The previously described Siddhi app deployments fall under this Case 1 category. The following sample will cover the Siddhi app deployments which fall under Case 2.

**Sample on deploying and running Siddhi App with a Messaging System**

The Siddhi operator currently supports NATS as the messaging system. Therefore it is prerequisite to deploying NATS operator and NATS streaming operator in your kubernetes cluster before you install the Siddhi app.

1. Refer [this documentation](https://github.com/nats-io/nats-streaming-operator/tree/v0.2.2#getting-started) to install NATS operator and NATS streaming operator.
1. Install the [Siddhi operator](#install-siddhi-operator).
1. Create a [persistence volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) in your cluster.

Now we need a NATS cluster and NATS streaming cluster to run the Siddhi app deployment. For this, there are two cases handled by the operator.

1. User can create NATS cluster and NATS streaming cluster as described in [this documentation](https://github.com/nats-io/nats-streaming-operator/tree/v0.2.2#deploying-a-nats-streaming-cluster). Specify cluster details in the YAML file like following.

    ```yaml
    messagingSystem:
      type: nats
      config: 
        bootstrapServers:
          - "nats://example-nats:4222"
        clusterId: example-stan
    ```

1. If the user only specifies messaging system as NATS like below then Siddhi operator will automatically create NATS cluster(`siddhi-nats`) and NATS streaming cluster(`siddhi-stan`), and connect two partial apps.
  
      ```yaml
      messagingSystem:
        type: nats
      ```

Before installing a Siddhi app you have to check that all prerequisites(Siddhi-operator, nats-operator, and nats-streaming-operator) up and running perfectly like below.

```sh
$ kubectl get deployments

NAME                      READY     UP-TO-DATE   AVAILABLE   AGE
nats-operator             1/1       1            1           5m
nats-streaming-operator   1/1       1            1           5m
siddhi-operator           1/1       1            1           5m
```

Now you need to specify a YAML file like below to create stateful Siddhi app deployment.

```yaml
apiVersion: siddhi.io/v1alpha2
kind: SiddhiProcess
metadata: 
  name: power-consume-app
spec: 
  apps: 
    - script: |
        @App:name("PowerConsumptionSurgeDetection")
        @App:description("App consumes events from HTTP as a JSON message of { 'deviceType': 'dryer', 'power': 6000 } format and inserts the events into DevicePowerStream, and alerts the user if the power consumption in 1 minute is greater than or equal to 10000W by printing a message in the log for every 30 seconds.")

        /*
            Input: deviceType string and powerConsuption int(Joules)
            Output: Alert user from printing a log, if there is a power surge in the dryer within 1 minute period. 
                    Notify the user in every 30 seconds when total power consumption is greater than or equal to 10000W in 1 minute time period.
        */

        @source(
          type='http',
          receiver.url='${RECEIVER_URL}',
          basic.auth.enabled='false',
          @map(type='json')
        )
        define stream DevicePowerStream(deviceType string, power int);

        @sink(type='log', prefix='LOGGER') 
        define stream PowerSurgeAlertStream(deviceType string, powerConsumed long); 

        @info(name='power-consumption-window')  
        from DevicePowerStream#window.time(1 min) 
        select deviceType, sum(power) as powerConsumed
        group by deviceType
        having powerConsumed > 10000
        output every 30 sec
        insert into PowerSurgeAlertStream;

  container: 
    env: 
      - 
        name: RECEIVER_URL
        value: "http://0.0.0.0:8080/checkPower"
      - 
        name: BASIC_AUTH_ENABLED
        value: "false"
    image: "siddhiio/siddhi-runner-ubuntu:5.1.0"
  
  messagingSystem:
    type: nats
       
  persistentVolumeClaim: 
    accessModes: 
      - ReadWriteOnce
    resources: 
      requests: 
        storage: 1Gi
    storageClassName: standard
    volumeMode: Filesystem
  
  runner: |
    state.persistence:
      enabled: true
      intervalInMin: 1
      revisionsToKeep: 2
      persistenceStore: io.siddhi.distribution.core.persistence.FileSystemPersistenceStore
      config:
        location: siddhi-app-persistence
```

Save this YAML as `power-consume-app.yaml` as use `kubectl` to deploy the app.

```sh
kubectl apply -f power-consume-app.yaml
```

This `kubectl` execution in the Siddhi operator will do the following tasks.

1. Create a NATS cluster and streaming cluster since the user did not specify it.
1. Parse the given Siddhi app and create two partial Siddhi apps(passthrough and process). Then deploy both apps in separate deployments to distribute I/O time. Check health of the Siddhi runner and make deployments up and running.
1. Create a service for passthrough app.
1. Create an ingress rule that maps to passthrough service.

After a successful deployment, your kubernetes cluster should have these artifacts.

```sh
$ kubectl get SiddhiProcesses
NAME                STATUS    READY     AGE
power-consume-app   Running   2/2       5m

$ kubectl get deployments
NAME                      READY     UP-TO-DATE   AVAILABLE   AGE
nats-operator             1/1       1            1           10m
nats-streaming-operator   1/1       1            1           10m
power-consume-app-0       1/1       1            1           5m
power-consume-app-1       1/1       1            1           5m
siddhi-operator           1/1       1            1           10m

$ kubectl get service
NAME                  TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
kubernetes            ClusterIP   10.96.0.1        <none>        443/TCP                      2d7h
power-consume-app-0   ClusterIP   10.105.67.227    <none>        8080/TCP                     5m
siddhi-nats           ClusterIP   10.100.205.21    <none>        4222/TCP                     10m
siddhi-nats-mgmt      ClusterIP   None             <none>        6222/TCP,8222/TCP,7777/TCP   10m
siddhi-operator       ClusterIP   10.103.229.109   <none>        8383/TCP                     10m

$ kubectl get ingress
NAME      HOSTS     ADDRESS     PORTS     AGE
siddhi    siddhi    10.0.2.15   80        10m

$ kubectl get pv
NAME        CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS    CLAIM                             STORAGECLASS   REASON    AGE
siddhi-pv   1Gi        RWO            Recycle          Bound     default/power-consume-app-1-pvc   standard                 10m

$ kubectl get pvc
NAME                      STATUS    VOLUME      CAPACITY   ACCESS MODES   STORAGECLASS   AGE
power-consume-app-1-pvc   Bound     siddhi-pv   1Gi        RWO            standard       5m
```

Here `power-consume-app-0` is the passthrough deployment and `power-consume-app-1` is the process deployment.

Now you can send an HTTP request to the passthrough app.

```sh
curl -X POST \
  http://siddhi/power-consume-app-0/8080/checkPower \
  -H 'Accept: */*' \
  -H 'Content-Type: application/json' \
  -H 'Host: siddhi' \
  -d '{
	"deviceType": "dryer",
	"power": 60000
}'
```

The process app logs will show that event.

```sh
$ kubectl get pods
NAME                                       READY     STATUS    RESTARTS   AGE
nats-operator-dd7f4945f-x4vf8              1/1       Running   0          10m
nats-streaming-operator-6fbb6695ff-9rmlx   1/1       Running   0          10m
power-consume-app-0-7486b87979-6tccx       1/1       Running   0          5m
power-consume-app-1-588996fcfb-prncj       1/1       Running   0          5m
siddhi-nats-1                              1/1       Running   0          5m
siddhi-operator-6698d8f69d-w2kvj           1/1       Running   0          10m
siddhi-stan-1                              1/1       Running   1          5m

$ kubectl logs power-consume-app-1-588996fcfb-prncj
JAVA_HOME environment variable is set to /opt/java/openjdk
CARBON_HOME environment variable is set to /home/siddhi_user/siddhi-runner
RUNTIME_HOME environment variable is set to /home/siddhi_user/siddhi-runner/wso2/runner
Picked up JAVA_TOOL_OPTIONS: -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap
[2019-07-12 14:09:16,648]  INFO {org.wso2.carbon.launcher.extensions.OSGiLibBundleDeployerUtils updateOSGiLib} - Successfully updated the OSGi bundle information of Carbon Runtime: runner  
...
[2019-07-12 14:12:04,969]  INFO {io.siddhi.core.stream.output.sink.LogSink} - LOGGER : Event{timestamp=1562940716559, data=[dryer, 60000], isExpired=false}
```
