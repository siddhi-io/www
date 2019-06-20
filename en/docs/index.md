---
template: templates/single-column.html
---

<!--
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
-->

<meta http-equiv="refresh" content="0; url=/" />


**Siddhi** - Cloud Native Stream Processor
===========================================

  [![Jenkins Build Status](https://wso2.org/jenkins/view/wso2-dependencies/job/siddhi/job/siddhi/badge/icon)](https://wso2.org/jenkins/view/wso2-dependencies/job/siddhi/job/siddhi)
  [![GitHub (pre-)release](https://img.shields.io/github/release/siddhi-io/siddhi/all.svg)](https://github.com/siddhi-io/siddhi/releases)
  [![GitHub (Pre-)Release Date](https://img.shields.io/github/release-date-pre/siddhi-io/siddhi.svg)](https://github.com/siddhi-io/siddhi/releases)
  [![GitHub last commit](https://img.shields.io/github/last-commit/siddhi-io/siddhi.svg)](https://github.com/siddhi-io/siddhi/commits/master)
  [![codecov](https://codecov.io/gh/siddhi-io/siddhi/branch/master/graph/badge.svg)](https://codecov.io/gh/siddhi-io/siddhi)
  [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Siddhi is a cloud native **_Streaming_** and **_Complex Event Processing_** engine that understands **Streaming SQL queries** in order to capture events from diverse data sources, process them, detect complex conditions, and publish output to various endpoints in real time.

Siddhi can run as an embedded [Java library](deployment/siddhi-as-a-java-library/), and as a microservice on [bare metal, VM](deployment/siddhi-as-a-local-microservice/), [Docker](deployment/siddhi-as-a-docker-microservice/) and natively in [Kubernetes](deployment/siddhi-as-a-kubernetes-microservice/). It also has a [graphical and text editor](#siddhi-development-environment) for building Streaming Data Integration and Streaming Analytics applications.

## Distributions

<a href="deployment/siddhi-as-a-kubernetes-microservice/" rel="nofollow">
 <img src="https://raw.githubusercontent.com/siddhi-io/siddhi/master/docs/images/distributions/kubernetes.png?raw=true" alt="Kubernetes" width="19%">
</a>
<a href="deployment/siddhi-as-a-docker-microservice/" rel="nofollow">
 <img src="https://raw.githubusercontent.com/siddhi-io/siddhi/master/docs/images/distributions/docker.png?raw=true" alt="Docker" width="19%">
</a>
<a href="deployment/siddhi-as-a-local-microservice/" rel="nofollow">
 <img src="https://raw.githubusercontent.com/siddhi-io/siddhi/master/docs/images/distributions/binary.png?raw=true" alt="Binary" width="19%">
</a>
<a href="deployment/siddhi-as-a-java-library/" rel="nofollow">
 <img src="https://raw.githubusercontent.com/siddhi-io/siddhi/master/docs/images/distributions/java.png?raw=true" alt="Java" width="19%">
</a>
<a href="contribution/#obtaining-the-source-code-and-building-the-project" rel="nofollow">
 <img src="https://raw.githubusercontent.com/siddhi-io/siddhi/master/docs/images/distributions/source.png?raw=true" alt="Source" width="19%">
</a>

And more [installation options](download/) 

## Overview 

<p style="text-align: center;">
<img alt="" src="images/siddhi-overview.png?raw=true" title="Overview" style="max-width: 75%;">
</p>


## Supported Use Cases 

<div class="md-typeset__table"><table>
    <tbody><tr>
        <th width="25%" align="center">Streaming Data Integration</th>
        <th width="25%" align="center">Streaming Data Analytics</th>
        <th width="25%" align="center">Alerts & Notifications</th>
        <th width="25%" align="center">Adaptive Decision Making</th>
    </tr>
    <tr>
        <td style="vertical-align: top">
            <ul>
              <li>Retrieve data from various event sources (Kafka, JMS, HTTP, CDC, etc).</li>
              <li>Transform events to and from multiple event formats (JSON, XML, Text, Avro, etc).</li>
              <li>Data preprocessing & cleaning.</li>
              <li>Join multiple data streams.</li>
              <li>Integrate streaming data with databases (RDBMS, Cassandra, HBase, Redis, etc) and services.</li>
            </ul>  
        </td>
        <td style="vertical-align: top">
            <ul>
              <li>Calculate aggregations over windows such as time, length, and session.</li>
              <li>Long duration time series  aggregations with granularities from seconds to years.</li>
              <li>Analyze trends (rise, fall, turn, tipple bottom).</li>
              <li>Realtime predictions with pre trained machine learning models (PMML, Tensorflow).</li>
              <li>Learn and predict at runtime using online machine learning models.</li>
            </ul>  
       </td>
        <td style="vertical-align: top">
            <ul>
              <li>Generate alerts based on thresholds.</li>
              <li>Correlate data to find missing and erroneous events.</li>
              <li>Detect temporal event patterns.</li>
              <li>Detect non-occurrence of events.</li>
              <li>Publish data to multiple event sinks (Email, messaging systems, services, databases).</li>
            </ul>  
        </td>
        <td style="vertical-align: top">
            <ul>
              <li>Static rule processing.</li>
              <li>Adaptive stateful rule processing.</li>
              <li>Decision making through synchronous RPC.</li>
              <li>Query state from tables, windows and aggregations.</li>
              <li>Static and online machine learning based decision making.</li>
            </ul>  
        </td>
    </tr>
</tbody></table></div>

* And many more ...  For more information, see <a target="_blank" href="http://www.kdnuggets.com/2015/08/patterns-streaming-realtime-analytics.html">Patterns of Streaming Realtime Analytics</a>

Siddhi is free and open source, released under **Apache Software License v2.0**.

## Why use Siddhi ? 

* **Fast**. <a target="_blank" href="http://wso2.com/library/conference/2017/2/wso2con-usa-2017-scalable-real-time-complex-event-processing-at-uber?utm_source=gitanalytics&utm_campaign=gitanalytics_Jul17">UBER</a> uses it to process 20 Billion events per day (300,000 events per second). 
* **Lightweight** (core Siddhi libs are <2MB), and embeddable in Android, Python and RaspberryPi.
* Has **over 50 <a target="_blank" href="extensions/">Siddhi Extensions</a>**
* **Used by over 60 companies including many Fortune 500 companies** in production. Following are some examples:
    * **WSO2** uses Siddhi for the following purposes:
        * To provide **distributed and high available** stream processing capabilities via <a target="_blank" href="http://wso2.com/analytics?utm_source=gitanalytics&utm_campaign=gitanalytics_Jul17">WSO2 Stream Processor</a>. It is named as a strong performer in <a target="_blank" href="https://go.forrester.com/blogs/16-04-16-15_true_streaming_analytics_platforms_for_real_time_everything/">The Forrester Wave: Big Data Streaming Analytics, Q1 2016</a> (<a target="_blank" href="https://www.forrester.com/report/The+Forrester+Wave+Big+Data+Streaming+Analytics+Q1+2016/-/E-RES129023">Report</a>).
        * As the **edge analytics** library of [WSO2 IoT Server](http://wso2.com/iot?utm_source=gitanalytics&utm_campaign=gitanalytics_Jul17).
        * As the core of <a target="_blank" href="http://wso2.com/api-management?utm_source=gitanalytics&utm_campaign=gitanalytics_Jul17">WSO2 API Manager</a>'s throttling. 
        * As the core of <a target="_blank" href="http://wso2.com/platform?utm_source=gitanalytics&utm_campaign=gitanalytics_Jul17">WSO2 products'</a> analytics.
    * **<a target="_blank" href="http://wso2.com/library/conference/2017/2/wso2con-usa-2017-scalable-real-time-complex-event-processing-at-uber?utm_source=gitanalytics&utm_campaign=gitanalytics_Jul17">UBER</a>** uses Siddhi for fraud analytics.
    * **<a target="_blank" href="http://eagle.apache.org/docs/index.html">Apache Eagle</a>** uses Siddhi as a policy engine.
    * Also used by [Punch Platform](https://doc.punchplatform.com/Reference_Guide/Data_Processing/Punch/Cep_Rules.html#siddhi_and_punch), [Sqooba](https://sqooba.io/), and [SiteWhere](https://sitewhere1.sitewhere.io/userguide/tenant/event-processing.html)
* Solutions based on Siddhi have been **finalists at <a target="_blank" href="http://dl.acm.org/results.cfm?query=(%252Bgrand%20%252Bchallenge%20%252Bwso2)&within=owners.owner=HOSTED&filtered=&dte=&bfr=">ACM DEBS Grand Challenge Stream Processing competitions** in 2014, 2015, 2016, 2017</a>.
* Siddhi has been **the basis of many academic research projects** and has <a target="_blank" href="https://scholar.google.com/scholar?cites=5113376427716987836&as_sdt=2005&sciodt=0,5&hl=en">**over 60 citations**</a>. 

If you are a Siddhi user, we would love to hear more on how you use Siddhi? Please share your experience and feedback via the [Siddhi user Google group](https://groups.google.com/forum/#!forum/siddhi-user).

## Get Started!

Get started with Siddhi in a few minutes by following the <a target="_blank" href="quckstart/">Siddhi Quick Start Guide</a>

## Siddhi Development Environment 

Siddhi provides tooling that supports following features to develop and test stream processing applications: 

* **Text Query Editor** with syntax highlighting and advanced auto completion support.
* **Event Simulator and Debugger** to test Siddhi Applications.
    ![](images/editor/source-editor.png "Source Editor")

* **Graphical Query Editor** with drag and drop query building support.
    ![](images/editor/graphical-editor.png "Graphical Query Editor")

## Siddhi Versions

* **Latest Stable Release of Siddhi v5.0.x** : [**v5.0.0**](api/latest/) _built on Java 8 & 11._ 
* Get Siddhi API information <a target="_blank" href="api/latest/">here</a>.

## Contact us 
* Post your questions with the <a target="_blank" href="http://stackoverflow.com/search?q=siddhi">"Siddhi"</a> tag in <a target="_blank" href="http://stackoverflow.com/search?q=siddhi">Stackoverflow</a>. 
* For questions and feedback please connect via the [Siddhi user Google group](https://groups.google.com/forum/#!forum/siddhi-user).
* Engage in community development through [Siddhi dev Google group](https://groups.google.com/forum/#!forum/siddhi-dev). 

## How to Contribute
Find the detail information on asking questions, providing feedback, reporting issues, building and contributing code on [How to contribute?](community/) section.

## Roadmap 

- [x] Support Kafka
- [x] Support NATS
- [x] Siddhi Runner Distribution 
- [x] Siddhi Tooling (Editor)
- [x] Siddhi Kubernetes CRD
- [x] Periodic incremental state persistence  
- [ ] Support Prometheus for metrics collection
- [ ] Support high available Siddhi deployment with NATS via Kubernetes CRD
- [ ] Support distributed Siddhi deployment with NATS via Kubernetes CRD

## Support 
[WSO2](https://wso2.com/) provides production, and query support for Siddhi and its <a target="_blank" href="extensions/">extensions</a>. For more details contact via <a target="_blank" href="http://wso2.com/support?utm_source=gitanalytics&utm_campaign=gitanalytics_Jul17">http://wso2.com/support/</a>

Siddhi is joint research project initiated by <a target="_blank" href="http://wso2.com/">WSO2</a> and <a target="_blank" href="http://www.mrt.ac.lk/web/">University of Moratuwa</a>, Sri Lanka.
