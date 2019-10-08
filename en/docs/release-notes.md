# Release Notes 

## Siddhi Distribution Releases

### Siddhi Distribution 5.1.0

#### Highlights
* Siddhi 5.1.0 distribution release contains the features and bug fixes done in Siddhi core 5.1.x releases. Other than that, it provides a lot of new features and improvements that help for the cloud native stream processing deployments. Please find more details in below.

#### Features & Improvements
* Caching support to retain on-demand queries provided by users through editor. [(#499)](https://github.com/siddhi-io/distribution/pull/499)
* Add alerts for the docker push process. [(#507)](https://github.com/siddhi-io/distribution/pull/507)
* Improve logging and default selections in K8/Docker export. [(#516)](https://github.com/siddhi-io/distribution/pull/516)
* Add validations to the export docker config step. [(#526)](https://github.com/siddhi-io/distribution/pull/526)
* Improve auto completion in editor to include latest keywords. [(#528)](https://github.com/siddhi-io/distribution/pull/528)
* Support relative path for -Dapps and -Dconfig parameters. [(#543)](https://github.com/siddhi-io/distribution/pull/543)
* Make templated Siddhi apps collapsable. [(#592)](https://github.com/siddhi-io/distribution/pull/592)
* Add alert dialog to see the console if artifacts are pushed to Docker. [(#598)](https://github.com/siddhi-io/distribution/pull/598)
* Docker image push support and set values for templated variables in Siddhi apps [(#485)](https://github.com/siddhi-io/distribution/pull/485)
* Improvements to perform list operations with events. [Check here](https://github.com/siddhi-io/siddhi-execution-list)
* Add styling for template option in Docker/Kubernetes export dialog [(#442)](https://github.com/siddhi-io/distribution/pull/442)
* Add side panel to the editor which allows the user to set values for templated variables in Siddhi apps [(#446)](https://github.com/siddhi-io/distribution/pull/446)
* Deprecate existing query API and introduce on-demand queries [(#481)](https://github.com/siddhi-io/distribution/pull/481)
* Add preview support to receive/publish gRpc events. [(#396)](https://github.com/siddhi-io/distribution/pull/396)
* Skip empty jar/bundle selections in Docker/Kubernetes export. [(#367)](https://github.com/siddhi-io/distribution/pull/367)
* UI/UX improvements in k8/Docker export feature. [(#373)](https://github.com/siddhi-io/distribution/pull/373), [(#369)](https://github.com/siddhi-io/distribution/pull/369)
* Improve startup scripts carbon.sh and carbon.bat to support JDK 11. [(#394)](https://github.com/siddhi-io/distribution/pull/394)
* Add support for offset in siddhi parser [(#291)](https://github.com/siddhi-io/distribution/pull/291)
* Add overload param support for source view editor [(#310)](https://github.com/siddhi-io/distribution/pull/310)
* Improve design view to show the connection between *-call-request and *-call-response IOs. [(#310)](https://github.com/siddhi-io/distribution/pull/310)
* Feature to support downloading docker and Kubernetes artifacts from Tooling UI [(#349)](https://github.com/siddhi-io/distribution/pull/349)

#### Bug Fixes
* Fix samples not loading in welcome page. [(#491)](https://github.com/siddhi-io/distribution/pull/491)
* Remove unnecessary console logs. [(#494)](https://github.com/siddhi-io/distribution/pull/494)
* Fix multiple template value showing issue. [(#495)](https://github.com/siddhi-io/distribution/pull/495)
* Docker build fails due to in-proper .  handling of user inputs. [(#496)](https://github.com/siddhi-io/distribution/pull/496)
* Avoid syntax validation while app is running and validate when stopped. [(#501)](https://github.com/siddhi-io/distribution/pull/501)

<details>
<summary>More Info on Bug Fixes</summary>
<ul>
<li> Refactor gRPC related samples. <a href="https://github.com/siddhi-io/siddhi/pull/502">(#502)</a></li>
<li> Fix UI issues in Docker/Kubernets export. <a href="https://github.com/siddhi-io/siddhi/pull/504">(#504)</a></li>
<li> Add proper error handling to Docker/Kubernets export backend services. <a href="https://github.com/siddhi-io/siddhi/pull/503">(#503)</a></li>
<li> Maintain templated Siddhi app in runtime without overriding with the populated app. <a href="https://github.com/siddhi-io/siddhi/pull/505">(#505)</a></li>
<li> Fix console reconnection issue in editor. <a href="https://github.com/siddhi-io/siddhi/pull/506">(#506)</a></li>
<li> Show only the started siddhi apps in on-demand query dialog box. <a href="https://github.com/siddhi-io/siddhi/pull/522">(#522)</a></li>
<li> Avoid passing empty values for unset variables in Docker/Kubernetes export. <a href="https://github.com/siddhi-io/siddhi/pull/525">(#525)</a></li>
<li> Prettify error messages in editor console. <a href="https://github.com/siddhi-io/siddhi/pull/531">(#531)</a></li>
<li> Sample test client failures in windows environment. <a href="https://github.com/siddhi-io/siddhi/pull/534">(#534)</a></li>
<li> Log error trace (if any) while trying to start Siddhi app from editor. <a href="https://github.com/siddhi-io/siddhi/pull/542">(#542)</a></li>
<li> Jar to Bundle conversion failure in Windows environment. <a href="https://github.com/siddhi-io/siddhi/pull/554">(#554)</a></li>
<li> Maintain a single Siddhi manager and reuse it across components. <a href="https://github.com/siddhi-io/siddhi/pull/556">(#556)</a></li>
<li> Faulty Siddhi app not recovers even after the valid changes. <a href="https://github.com/siddhi-io/siddhi/pull/559">(#559)</a></li>
<li> Siddhi app cannot be saved is the app name annotation is not given. <a href="https://github.com/siddhi-io/siddhi/pull/563">(#563)</a></li>
<li> Docker push is not working in Widnows environment. <a href="https://github.com/siddhi-io/siddhi/pull/565">(#565)</a></li>
<li> CSS issue when deleting elements in editor design view. <a href="https://github.com/siddhi-io/siddhi/pull/571">(#571)</a></li>
<li> Simulator controls are not get disabled when app becomes faulty. <a href="https://github.com/siddhi-io/siddhi/pull/574">(#574)</a></li>
<li> Case sensitivity issue in fault stream annotations. <a href="https://github.com/siddhi-io/siddhi/pull/578">(#578)</a></li>
<li> Fix K8s unexpected character issue and set default messaging. <a href="https://github.com/siddhi-io/siddhi/pull/583">(#583)</a></li>
<li> Issue in docker export with 'Could not acquire image ID or digest following build'. <a href="https://github.com/siddhi-io/siddhi/pull/587">(#587)</a></li>
<li> Duplicate ports being added to docker file and readme. <a href="https://github.com/siddhi-io/siddhi/pull/589">(#589)</a></li>
<li> Docker export does not list all the Siddhi apps. <a href="https://github.com/siddhi-io/siddhi/pull/591">(#591)</a></li>
<li> Avoid parser creating multiple passthrough queries. <a href="https://github.com/siddhi-io/siddhi/pull/593">(#593)</a></li>
<li> Add validation in docker export to select either download or push. <a href="https://github.com/siddhi-io/siddhi/pull/597">(#597)</a></li>
<li> Duplicate stream definitions being added to Siddhi topology. <a href="https://github.com/siddhi-io/siddhi/pull/599">(#599)</a></li>
<li> Bug fixes related to Docker/Kubernetes artifacts export features. <a href="https://github.com/siddhi-io/siddhi/pull/372">(#372)</a></li>
<li> Change export file names and replace init script from the Dockerfile. <a href="https://github.com/siddhi-io/siddhi/pull/383">(#383)</a></li>
<li> Remove unnecessary and unprotected API from runner distribution. <a href="https://github.com/siddhi-io/siddhi/pull/389">(#389)</a></li>
<li> Bug: Switching from design view to source view after changing any element causes the conversion of triple-quotes into single ones in the avro scheme definition. <a href="https://github.com/siddhi-io/siddhi/pull/353">(#353)</a></li>
<li> Fix for snakeyaml dependency issue. <a href="https://github.com/siddhi-io/siddhi/pull/310">(#310)</a></li>
<li> Fix design view toggle button position <a href="https://github.com/siddhi-io/siddhi/pull/243">(#243)</a></li>
</ul>
</details>

#### Complete Changes 
Please find the complete changes [here](https://github.com/siddhi-io/distribution/compare/v1.0.0-m1...v5.1.0) 

!!! info "Please find more details about the release [here](https://github.com/siddhi-io/distribution/releases/tag/v5.1.0)"

!!! info "Please find the details of the corresponding docker release [here](https://github.com/siddhi-io/docker-siddhi/releases/tag/v5.1.0)"


## Siddhi Core Libraries Releases

### Siddhi Core 5.1.7

#### Bug Fixes
* Fix aggregation definition error logs. [(#1538)](https://github.com/siddhi-io/siddhi/pull/1538) 

#### Complete Changes 
Please find the complete changes [here](https://github.com/siddhi-io/siddhi/compare/v5.1.6...v5.1.7)

!!! info "Please find more details about the release [here](https://github.com/siddhi-io/siddhi/releases/tag/v5.1.7)"

### Siddhi Core 5.1.6

#### Highlights
* Bug fixes related to Siddhi sink retry implementation, logging and aggregations. Most importantly, it contains a bug fix for the Siddhi extension loading issue in slow environments. 

#### Features & Improvements
* Improve error with context when updating environment variable [(#1523)](https://github.com/siddhi-io/siddhi/pull/1523)

#### Bug Fixes
* Fix reconnection logic when publish() always throw connection unavailable exception. [(#1525)](https://github.com/siddhi-io/siddhi/pull/1525)
* Fix Siddhi extension loading issue in slow environments. [(#1529)](https://github.com/siddhi-io/siddhi/pull/1529)
* Fix the inconsistent behaviour aggregation optimization. [(#1533)](https://github.com/siddhi-io/siddhi/pull/1533) 

#### Complete Changes 
Please find the complete changes [here](https://github.com/siddhi-io/siddhi/compare/v5.1.5...v5.1.6)

!!! info "Please find more details about the release [here](https://github.com/siddhi-io/siddhi/releases/tag/v5.1.6)"


### Siddhi Core 5.1.5

#### Highlights
* Bug fixes covering various execution parts of Siddhi; mainly it contains fixes related to in-memory event table, error handling, extension loading, and event synchronization.

### Features & Improvements
* Improve logs for duplicate extension additions [(#1521)](https://github.com/siddhi-io/siddhi/pull/1521)
* Code refactoring changes to rename `store query` to `On-Demand query` [(#1506)](https://github.com/siddhi-io/siddhi/pull/1506) 

### Bug Fixes
* Fix for NPE when using stream name to refer to attributes in aggregation join queries. [(#1503)](https://github.com/siddhi-io/siddhi/pull/1503)
* Fix `update or insert` operation in InMemoryTable for EventChunks. [(#1497)](https://github.com/siddhi-io/siddhi/pull/1497) , [(#1512)](https://github.com/siddhi-io/siddhi/pull/1512)
* Fix for extension loading issue in certain OS environments (slow environments) [(#1507)](https://github.com/siddhi-io/siddhi/pull/1507)
* Bug fixes related to error handling in Triggers [(#1515)](https://github.com/siddhi-io/siddhi/pull/1515)
* Stop running on-demand queries if the Siddhi app has shut down [(#1515)](https://github.com/siddhi-io/siddhi/pull/1515)
* Fix input handler being silent when siddhi app is not running (Throw error when input handler used without staring the Siddhi App runtime) [(#1518)](https://github.com/siddhi-io/siddhi/pull/1518)
* Fix synchronization issues BaseIncrementalValueStore class [(#1520)](https://github.com/siddhi-io/siddhi/pull/1520)

#### Complete Changes 
Please find the complete changes [here](https://github.com/siddhi-io/siddhi/compare/v5.1.4...v5.1.5)

!!! info "Please find more details about the release [here](https://github.com/siddhi-io/siddhi/releases/tag/v5.1.5)"

### Siddhi Core 5.1.4

#### Highlights
* Improvements related to `@index` annotation usage in stores and some dependency upgrades.

#### Features & Improvements
* Change the behavior of in-memory tables to support multiple '@index' annotations. [(#1491)](https://github.com/siddhi-io/siddhi/pull/1491)

#### Bug Fixes
* Fix NPE when count() AttributeFunction is used [(#1485)](https://github.com/siddhi-io/siddhi/pull/1485)

#### Complete Changes 
Please find the complete changes [here](https://github.com/siddhi-io/siddhi/compare/v5.1.3...v5.1.4)

!!! info "Please find more details about the release [here](https://github.com/siddhi-io/siddhi/releases/tag/v5.1.4)"

### Siddhi Core 5.1.3

#### Highlights
* Improvements done for use cases such as throttling, continuous testing & integration and error handling.

#### Features & Improvements
* Introduce RESET processing mode to preserve memory optimization. [(#1444)](https://github.com/siddhi-io/siddhi/pull/1444)
* Add support YAML Config Manager for easy setting of system properties in SiddhiManager through a YAML file [(#1446)](https://github.com/siddhi-io/siddhi/pull/1446)
* Support to create a Sandbox SiddhiAppRuntime for testing purposes [(#1451)](https://github.com/siddhi-io/siddhi/pull/1451)
* Improve convert function to provide message & cause for Throwable objects [(#1463)](https://github.com/siddhi-io/siddhi/pull/1463)
* Support a way to retrieve the sink options and type at sink mapper. [(#1473)](https://github.com/siddhi-io/siddhi/pull/1473)
* Support error handling (log/wait/fault-stream) when event sinks publish data asynchronously. [(#1473)](https://github.com/siddhi-io/siddhi/pull/1473)

#### Bug Fixes
* Fixes to TimeBatchWindow to process events in a streaming manner, when it's enabled to send current events in streaming mode. This makes sure all having conditions are matched against the output, whereby allowing users to effectively implement throttling use cases with alert suppression. [(#1441)](https://github.com/siddhi-io/siddhi/pull/1441)

#### Complete Changes 
Please find the complete changes [here](https://github.com/siddhi-io/siddhi/compare/v5.1.2...v5.1.3)

!!! info "Please find more details about the release [here](https://github.com/siddhi-io/siddhi/releases/tag/v5.1.3)"

### Siddhi Core 5.1.2

#### Highlights
* There is an improvement done for Template Builder by removing Java Message Format dependency since it is causing some inconsistencies with performing custom mapping for float, double and long values. Due to this fix, there might be some differences (corrected proper output) in the output that you get for custom output mapping with Text, XML, JSON, and CSV. ([#1431](https://github.com/siddhi-io/siddhi/pull/1431))
* There is a behavioral change introduced with the improvements done with ([#1421](https://github.com/siddhi-io/siddhi/pull/1421)). When counting patterns are used such as e1=StockStream<2:8> and when they are referred without indexes such as e1.price it collects the price values from all the events in the counting pattern e1 and produces it as a list. Since the list is not native to Siddhi the attribute will have the object as its type. In older Siddhi version, it will output the last matching event’s attribute value.

#### Features & Improvements
* SiddhiManager permits user-defined data to be propagated throughout the stack ([#1406](https://github.com/siddhi-io/siddhi/pull/1406))
* API to check whether the Siddhi App is stateful or not ([#1413](https://github.com/siddhi-io/siddhi/pull/1413))
* Support outputting the events collected in counting-pattern as a list ([#1421](https://github.com/siddhi-io/siddhi/pull/1421))
* Support API docs having multiline code segments ([#1430](https://github.com/siddhi-io/siddhi/pull/1430))
* Improve TemplateBuilder & remove Java MessageFormat dependency ([#1431](https://github.com/siddhi-io/siddhi/pull/1431))
* Support pattern ‘every’ clause containing multiple state elements with within condition ([#1435](https://github.com/siddhi-io/siddhi/pull/1435))

#### Bug Fixes
* Siddhi Error Handlers not getting engaged ([#1419](https://github.com/siddhi-io/siddhi/pull/1419))
* Incremental persistence to work on Windows Environment ([9c37b0d8fc8ce271551d4106bb20231334846f59](https://github.com/siddhi-io/siddhi/pull/1421/commits/9c37b0d8fc8ce271551d4106bb20231334846f59))

#### Complete Changes 
Please find the complete changes [here](https://github.com/siddhi-io/siddhi/compare/v5.1.1...v5.1.2)

!!! info "Please find more details about the release [here](https://github.com/siddhi-io/siddhi/releases/tag/v5.1.2)"

### Siddhi Core 5.1.1

#### Features & Improvements
* Siddhi store join query optimizations ([#1382](https://github.com/siddhi-io/siddhi/pull/1382))

#### Bug Fixes
* Log Rolling when aggregation query runs when Database is down ([#1380](https://github.com/siddhi-io/siddhi/pull/1380))
* Fix to avoid API changes introduced for Siddhi store implementation in Siddhi 5.1.0 ([#1388](https://github.com/siddhi-io/siddhi/pull/1388))
* Counting pattern issue with ‘every’ ([#1392](https://github.com/siddhi-io/siddhi/pull/1392))

#### Complete Changes 
Please find the complete changes [here](https://github.com/siddhi-io/siddhi/compare/v5.1.0...v5.1.1)

!!! info "Please find more details about the release [here](https://github.com/siddhi-io/siddhi/releases/tag/v5.1.1)"

### Siddhi Core 5.1.0

#### Features & Improvements
* Minor improvements related to error messages used for the no param case when paramOverload annotation is in place. ([#1375](https://github.com/siddhi-io/siddhi/pull/1375))

#### Complete Changes 
Please find the complete changes [here](https://github.com/siddhi-io/siddhi/compare/v5.0.2...v5.1.0)

!!! info "Please find more details about the release [here](https://github.com/siddhi-io/siddhi/releases/tag/v5.1.0)"


## Siddhi K8s Operator Releases

### Siddhi Operator 0.2.0

Siddhi team is excited to announce the Siddhi Operator Release 0.2.0. Please find the major improvements and features introduced in this release.

### Compatibility & Support

There are specification changes in Siddhi Process Custom Resource Definition. You have to use siddhi.io/v1alpha2 custom resources with this release.

### Features & Improvements

#### SiddhiProcess Spec Changes from 0.1.1


1. Aggregate previous `apps` and `query` specs to a single spec called `apps`.

    ```yaml
    apps:
    -
        configMap: app
    -
        script: |-
            @App:name("MonitorApp")
            @App:description("Description of the plan")  
            @sink(type='log', prefix='LOGGER')
            @source(
                type='http',
                receiver.url='http://0.0.0.0:8080/example',
                basic.auth.enabled='false',
                @map(type='json')
            )
            define stream DevicePowerStream (type string, deviceID string, power int);
            @sink(type='log', prefix='LOGGER')
            define stream MonitorDevicesPowerStream(sumPower long);
            @info(name='monitored-filter')
            from DevicePowerStream#window.time(100 min)
            select sum(power) as sumPower
            insert all events into MonitorDevicesPowerStream;
    ```

1. Replace previous `pod` spec with the container spec.

    ```yaml
    container:
        env:
            -
            name: RECEIVER_URL
            value: "http://0.0.0.0:8080/example"
            -
            name: BASIC_AUTH_ENABLED
            value: "false"
            -
            name: NATS_URL
            value: "nats://siddhi-nats:4222"
            -
            name: NATS_DEST
            value: siddhi
            -
            name: NATS_CLUSTER_ID
            value: siddhi-stan
        image: "siddhiio/siddhi-runner-ubuntu:latest"
    ```

1. The `imagePullSecret` under `pod` spec which was in previous releases move to the upper level in the YAML. (i.e Directly under the `spec` of CR )
1. Remove previous `tls` spec. Now you can configure ingress TLS secret using the `siddhi-operator-config` config map.
1. Change YAML naming convention to the Camel case.
    ```yaml
      messagingSystem:
        type: nats
        config: 
          bootstrapServers: 
            - "nats://nats-siddhi:4222"
          streamingClusterId: stan-siddhi
      
      persistentVolumeClaim: 
        accessModes: 
          - ReadWriteOnce
        resources: 
          requests: 
            storage: 1Gi
        storageClassName: standard
        volumeMode: Filesystem
    ```

1. Enable the version controlling to the SiddhiProcesses.(https://github.com/siddhi-io/siddhi-operator/pull/57, https://github.com/siddhi-io/siddhi-operator/pull/66)
1. NGINX ingress 0.22.0+ support.
1. Adding readiness and liveness probes to the Siddhi runner. (https://github.com/siddhi-io/siddhi-operator/pull/46)
1. Change previous static Siddhi parser to a dynamic one which embedded with the Siddhi runner. (https://github.com/siddhi-io/siddhi-operator/pull/71)



### Bug Fixes

1. Failover Deployment Support - Added Features https://github.com/siddhi-io/siddhi-operator/issues/33
1. Operator crashes the when NATS unavailable in the cluster (https://github.com/siddhi-io/siddhi-operator/issues/50)
1. Versioning in siddhi application level ( https://github.com/siddhi-io/siddhi-operator/issues/42)
1. Getting segmentation fault error when creating PVC automatically (https://github.com/siddhi-io/siddhi-operator/issues/86)
1. Stateful Siddhi Application fails deployment if persistence volume is unavailable (https://github.com/siddhi-io/siddhi-operator/issues/92)

 
