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

- Refactor gRPC related samples. [(#502)](https://github.com/siddhi-io/distribution/pull/502)
- Fix UI issues in Docker/Kubernets export. [(#504)](https://github.com/siddhi-io/distribution/pull/504)
- Add proper error handling to Docker/Kubernets export backend services. [(#503)](https://github.com/siddhi-io/distribution/pull/503)
* Maintain templated Siddhi app in runtime without overriding with the populated app. [(#505)](https://github.com/siddhi-io/distribution/pull/505)
* Fix console reconnection issue in editor. [(#506)](https://github.com/siddhi-io/distribution/pull/506)
* Show only the started siddhi apps in on-demand query dialog box. [(#522)](https://github.com/siddhi-io/distribution/pull/522)
* Avoid passing empty values for unset variables in Docker/Kubernetes export. [(#525)](https://github.com/siddhi-io/distribution/pull/525)
* Prettify error messages in editor console. [(#531)](https://github.com/siddhi-io/distribution/pull/531)
* Sample test client failures in windows environment. [(#534)](https://github.com/siddhi-io/distribution/pull/534)
* Log error trace (if any) while trying to start Siddhi app from editor. [(#542)](https://github.com/siddhi-io/distribution/pull/542)
* Jar to Bundle conversion failure in Windows environment. [(#554)](https://github.com/siddhi-io/distribution/pull/554)
* Maintain a single Siddhi manager and reuse it across components. [(#556)](https://github.com/siddhi-io/distribution/pull/556)
* Faulty Siddhi app not recovers even after the valid changes. [(#559)](https://github.com/siddhi-io/distribution/pull/559)
* Siddhi app cannot be saved is the app name annotation is not given. [(#563)](https://github.com/siddhi-io/distribution/pull/563)
* Docker push is not working in Widnows environment. [(#565)](https://github.com/siddhi-io/distribution/pull/565)
* CSS issue when deleting elements in editor design view. [(#571)](https://github.com/siddhi-io/distribution/pull/571)
* Simulator controls are not get disabled when app becomes faulty. [(#574)](https://github.com/siddhi-io/distribution/pull/574)
* Case sensitivity issue in fault stream annotations. [(#578)](https://github.com/siddhi-io/distribution/pull/578)
* Fix K8s unexpected character issue and set default messaging. [(#583)](https://github.com/siddhi-io/distribution/pull/583)
* Issue in docker export with 'Could not acquire image ID or digest following build'. [(#587)](https://github.com/siddhi-io/distribution/pull/587)
* Duplicate ports being added to docker file and readme. [(#589)](https://github.com/siddhi-io/distribution/pull/589)
* Docker export does not list all the Siddhi apps. [(#591)](https://github.com/siddhi-io/distribution/pull/591)
* Avoid parser creating multiple passthrough queries. [(#593)](https://github.com/siddhi-io/distribution/pull/593)
* Add validation in docker export to select either download or push. [(#597)](https://github.com/siddhi-io/distribution/pull/597)
* Duplicate stream definitions being added to Siddhi topology. [(#599)](https://github.com/siddhi-io/distribution/pull/599)
* Bug fixes related to Docker/Kubernetes artifacts export features. [(#372)](https://github.com/siddhi-io/distribution/pull/372)
* Change export file names and replace init script from the Dockerfile. [(#383)](https://github.com/siddhi-io/distribution/pull/383)
* Remove unnecessary and unprotected API from runner distribution. [(#389)](https://github.com/siddhi-io/distribution/pull/389)
* Bug: Switching from design view to source view after changing any element causes the conversion of triple-quotes into single ones in the avro scheme definition. [(#353)](https://github.com/siddhi-io/distribution/pull/353)
* Fix for snakeyaml dependency issue. [(#310)](https://github.com/siddhi-io/distribution/pull/310)
* Fix design view toggle button position ([#243](https://github.com/siddhi-io/distribution/pull/243))

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

#### Highlights
#### Changed

1. Change YAML naming convention of the messaging system and persistent volume claim.
    - Change `clusterId` -> `streamingClusterId`
    - Change `persistentVolume`  -> `persistentVolumeClaim`

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
2. Change YAML naming convention to the Camel case.
    ```yaml
    messagingSystem:
        type: nats
        config: 
        bootstrapServers: 
            - "nats://nats-siddhi:4222"
        clusterId: stan-siddhi

    persistentVolume: 
        accessModes: 
        - ReadWriteOnce
        resources: 
        requests: 
            storage: 1Gi
        storageClassName: standard
        volumeMode: Filesystem
    ```
    
#### Features & Improvements
1. Enable version controlling for SiddhiProcesses.(https://github.com/siddhi-io/siddhi-operator/pull/57, https://github.com/siddhi-io/siddhi-operator/pull/66)
1. NGINX ingress 0.22.0+ support.
1. Enabling readiness and liveness probes with the Siddhi runner. (https://github.com/siddhi-io/siddhi-operator/pull/46)

#### Bug Fixes 

* Fix for the stateful Siddhi Application failure if persistence volume is unavailable [(#92)](https://github.com/siddhi-io/siddhi-operator/issues/92)
* Getting segmentation fault error when creating PVC automatically [(#86)](https://github.com/siddhi-io/siddhi-operator/issues/86)
* Use a dynamic Siddhi Parser for each Siddhi Custom Resource object, embedded within the Siddhi Runner distribution in-order to share the classpaths . [(#71)](https://github.com/siddhi-io/siddhi-operator/pull/71)
* Fix Operator startup failing when NATS Operator is unavailable. [(#50)](https://github.com/siddhi-io/siddhi-operator/issues/50)
* Fix Siddhi Process not getting updated when the Config map used to pass the Siddhi application in Siddhi custom resource object is updated. [(#42)](https://github.com/siddhi-io/siddhi-operator/issues/42)
 
 !!! info "Please find more details about the release [here](https://github.com/siddhi-io/siddhi-operator/releases/tag/v0.2.0)"
 
