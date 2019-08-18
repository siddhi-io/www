# Release Notes 

## Siddhi Core Libraries Releases

### Siddhi Core 5.1.2

#### Highlights
* There is an improvement done for Template Builder by removing Java Message Format dependency since it is causing some inconsistencies with performing custom mapping for float, double and long values. Due to this fix, there might be some differences (corrected proper output) in the output that you get for custom output mapping with Text, XML, JSON, and CSV. (#1431)
* There is a behavioral change introduced with the improvements done with (#1421). When counting patterns are used such as e1=StockStream<2:8> and when they are referred without indexes such as e1.price it collects the price values from all the events in the counting pattern e1 and produces it as a list. Since the list is not native to Siddhi the attribute will have the object as its type. In older Siddhi version, it will output the last matching event’s attribute value.

#### Features & Improvements
* SiddhiManager permits user-defined data to be propagated throughout the stack (#1406)
* API to check whether the Siddhi App is stateful or not (#1413)
* Support outputting the events collected in counting-pattern as a list (#1421)
* Support API docs having multiline code segments (#1430)
* Improve TemplateBuilder & remove Java MessageFormat dependency (#1431)
* Support pattern ‘every’ clause containing multiple state elements with within condition (#1435)

#### Bug Fixes
* Siddhi Error Handlers not getting engaged (#1419)
* Incremental persistence to work on Windows Environment (https://github.com/siddhi-io/siddhi/pull/1421/commits/9c37b0d8fc8ce271551d4106bb20231334846f59)

#### Complete Changes 
Please find the complete changes [here](https://github.com/siddhi-io/siddhi/compare/v5.1.1...v5.1.2)

!!! info "Please find more details about the release [here](https://github.com/siddhi-io/siddhi/releases/tag/v5.1.2)"

### Siddhi Core 5.1.1

#### Features & Improvements
* Siddhi store join query optimizations (#1382)

#### Bug Fixes
* Log Rolling when aggregation query runs when Database is down (#1380)
* Fix to avoid API changes introduced for Siddhi store implementation in Siddhi 5.1.0 (#1388)
* Counting pattern issue with ‘every’ (#1392)

#### Complete Changes 
Please find the complete changes [here](https://github.com/siddhi-io/siddhi/compare/v5.1.0...v5.1.1)

!!! info "Please find more details about the release [here](https://github.com/siddhi-io/siddhi/releases/tag/v5.1.1)"

### Siddhi Core 5.1.0

#### Features & Improvements
* Minor improvements related to error messages used for the no param case when paramOverload annotation is in place. (#1375)

#### Complete Changes 
Please find the complete changes [here](https://github.com/siddhi-io/siddhi/compare/v5.0.2...v5.1.0)

!!! info "Please find more details about the release [here](https://github.com/siddhi-io/siddhi/releases/tag/v5.1.0)"


## Siddhi Distribution Releases

### Siddhi Distribution 5.1.0-M2

#### Highlights
* Refer the Siddhi 5.1.2 [release note](https://github.com/siddhi-io/siddhi/releases/tag/v5.1.2) to get to know about the latest feature improvements and bug fixes done for Siddhi engine.

#### Features & Improvements
* Improve deployment.yaml configuration for better user experience  (#262, #269, #276)
* Siddhi Parser API to validate Siddhi Apps (#273) 

#### Bug Fixes
* Fix design view toggle button position (#243)

#### Complete Changes 
Please find the complete changes [here](https://github.com/siddhi-io/distribution/compare/v5.1.0-m1...v5.1.0-m2) 

!!! info "Please find more details about the release [here](https://github.com/siddhi-io/distribution/releases/tag/v5.1.0-m2)"

!!! info "Please find the details of the corresponding docker release [here](https://github.com/siddhi-io/docker-siddhi/releases/tag/v5.1.0-m2)"

### Siddhi Distribution 5.1.0-M1

### New Features
- Siddhi Test Framework: Provides the capability to write integration tests using Docker containers [#1327](https://github.com/siddhi-io/siddhi/issues/1327)

### Complete Changes
[v0.1.0...v5.1.0-m1](https://github.com/siddhi-io/distribution/compare/v0.1.0...v5.1.0-m1) 

!!! info "Please find more details about the release [here](https://github.com/siddhi-io/distribution/releases/tag/v5.1.0-m1)"

!!! info "Please find the details of the corresponding docker release [here](https://github.com/siddhi-io/docker-siddhi/releases/tag/v5.1.0-m1)"


## Siddhi K8s Operator Releases

### Siddhi Operator 0.2.0-m2

#### Highlights
##### Changed

1. Change YAML naming convention to the Camel case.
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

1. Use a dynamic Siddhi Parser for each Siddhi Custom Resource object, embedded within the Siddhi Runner distribution in-order to share the classpaths . (https://github.com/siddhi-io/siddhi-operator/pull/71)

#### Features & Improvements
1. Enable version controlling for SiddhiProcesses.(https://github.com/siddhi-io/siddhi-operator/pull/57, https://github.com/siddhi-io/siddhi-operator/pull/66)
1. NGINX ingress 0.22.0+ support.
1. Enabling readiness and liveness probes with the Siddhi runner. (https://github.com/siddhi-io/siddhi-operator/pull/46)

#### Bug Fixes
1. Fix Operator startup failing when NATS Operator is unavailable. https://github.com/siddhi-io/siddhi-operator/issues/50
1. Fix Siddhi Process not getting updated when the Config map used to pass the Siddhi application in Siddhi custom resource object is updated. https://github.com/siddhi-io/siddhi-operator/issues/42

!!! info "Please find more details about the release [here](https://github.com/siddhi-io/siddhi-operator/releases/tag/v0.2.0-m2)"


### Siddhi Operator 0.2.0-m1

#### Highlights
##### Changed
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
        image: "buddhiwathsala/siddhi-runner:0.1.1"
    ```

1. The `imagePullSecret` under `pod` spec which was in previous releases moved to the top level in the YAML. (i.e Directly under the `spec` of CRD )

##### Removed

1. Remove previous `tls` spec. Now you can configure ingress TLS secret using the `siddhi-operator-config` config map.

#### Features & Improvements

1. Added the `messagingSystem` spec to the CRD.

    ```yaml
    messagingSystem:
        type: nats
        config:
        bootstrap.servers:
            - "nats://siddhi-nats:4222"
        cluster.id: siddhi-stan
    ```

1. Added `persistentVolume` spec to the CRD.

    ```yaml
    persistentVolume:
        access.modes:
        - ReadWriteOnce
        resources:
        requests:
            storage: 1Gi
        storageClassName: standard
        volume.mode: Filesystem
    ```

#### Bug Fixes

Find all the fixes and functionality changes from this issue https://github.com/siddhi-io/siddhi-operator/issues/33

!!! info "Please find more details about the release [here](https://github.com/siddhi-io/siddhi-operator/releases/tag/v0.2.0-m1)"
