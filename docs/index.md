---
template: templates/mkt-webpage.html
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

<div class="row cIntroRow">
<div class="container">
<div class="col-md-6 col-sm-6">
<h1>Siddhi</h1>
<h2>Cloud Native Stream Processor</h2>
<p>
Fully open source, cloud-native, scalable, Streaming and Complex Event Processing System capable of building real-time analytics, data integration, notification and surveillance usecases.
</p>
<p>
Siddhi understands Streaming SQL queries in order to capture events from diverse data sources, process them, integrate with multiple services and data sources, and publish output to various endpoints in real-time. 
</p>

<!-- <a href="#" class="cDownloadButton">Download</a> -->
<div class="cDistributionsContainer">
<h3>Distributions</h3>


<div class="cDistributions">
<ui>
<li><a class="cDistribution cKubernetes" href="en/_latest_version_/download/#siddhi-kubernetes">Kubernetes</a></li>
<li><a class="cDistribution cDocker" href="en/_latest_version_/download/#siddhi-docker">Docker</a></li>
<li><a class="cDistribution cVM" href="en/_latest_version_/download/#siddhi-distribution">VM (Binary)</a></li>
<li><a class="cDistribution cJava" href="/en/_latest_version_/download/#siddhi-libs">Java</a></li>
<li><a class="cDistribution cPython" href="/en/_latest_version_/download/#pysiddhi">Python</a></li>
<li><a class="cDistribution cSource" href="en/_latest_version_/development/source/">Source</a></li>
</ui></div>

</div>


</div>

<div class="col-md-6 col-sm-6">

<div class="cWdgetContainer" id="exTab1">
<div class="cTerminal">
<div class="tab-content clearfix">
<div class="tab-pane active" id="1a">
<div class="terminalOutput">
<img src="images/editor/graphical-editor.png"/>
</div>
</div>
<div class="tab-pane" id="2a">
<div class="terminalOutput">
<img src="images/editor/source-editor.png"/>
                      </div>
				</div>
</div>
</div>
<div class="cControls">
<ul  class="cDemoControls">
    <li class="active"><a  href="#1a" data-toggle="tab">Graphical Editor</a>
	</li>
	<li><a href="#2a" data-toggle="tab">Source Editor</a>
	</li>
</ul>
</div>
</div>
</div>
</div>
</div>


<div class="row cSection cGray">
<div class="container">
<div class="col-md-12 col-sm-12">
<h2>Benefits</h2>
</div>
<div class="col-md-4 col-sm-12">
<div class="cBenefits">
<div class="cBenefitsHeader">
<img src="images/dev.svg"/>
<h3>Faster Development</h3>
</div>
<p>Agile development experience with SQL like query language and graphical drag-and-drop editor supporting event simulation.</p>
</div>
</div>
<div class="col-md-4 col-sm-12">
<div class="cBenefits">
<div class="cBenefitsHeader">
<img src="images/cloud.svg"/>
<h3>Cloud Native</h3>
</div>
<p>Lightweight runtime that natively runs in Kubernetes via Kubernetes CRD, and works with systems such as NATS, gRPC, and Prometheus.</div>
</div>
<div class="col-md-4 col-sm-12">
<div class="cBenefits">
<div class="cBenefitsHeader">
<img src="images/micro-service.svg"/>
<h3>Scalable Deployment</h3>
</div>
<p>Embedded event processing within Java, Python applications to running on bare metal, Docker and massively scaling on Kubernetes.</p></div>
</div>
<div class="col-md-4 col-sm-12">
<div class="cBenefits">
<div class="cBenefitsHeader">
<img src="images/integration.svg"/>
<h3>System Integration</h3>
</div>
<p>Integrates with messaging systems (NATS, Kafka, JMS), Databases (RDBMS, NoSQL), Services (HTTP, gRPC), File systems and others.</p></div>
</div>
<div class="col-md-4 col-sm-12">
<div class="cBenefits">
<div class="cBenefitsHeader">
<img src="images/cicd.svg"/>
<h3>CI/CD Pipeline</h3>
</div>
<p>Supports development lifecycle and seamless deployments, through simple file-based configurations, automated tests, and CI/CD pipelines.</p></div>
</div>
<div class="col-md-4 col-sm-12">
<div class="cBenefits">
<div class="cBenefitsHeader">
<img src="images/tested.svg"/>
<h3>Reliability</h3>
</div>
<p>Battle-tested with billions of events at UBER, eBay, PayPal, HCA, TFL, WSO2 and in many Fortune 500 companies enabling exactly once event processing.</p></div>
</div>

</div>
</div>

<div class="row cSection cWhite">
<div class="container bannerImage">
<div class="col-md-12 col-sm-12">
<h2>Overview</h2>
<img src="images/siddhi-overview.png" />
<p style="text-align: center;">Siddhi can run as an embedded Java or Python library, run as a microservice on bare-metal, VM, or Docker, and run natively at scale in Kubernetes processing millions of events per second.</p>
</div>
</div>
</div>

<div class="row cSection cGray cUseCases">
<div class="container">
<div class="col-md-12 col-sm-12">
<h2>Use cases</h2>
</div>

<div class="col-md-6 col-sm-12">
<div class="cUseCasesContainer">
<h3>Streaming Data Integration</h3>
<ul>
    <li>Retrieve and publish data from various enterprise systems.</li>
    <li>Perform data transformation on JSON, XML, Text, Avro, and CSV.</li>
    <li>Integrate with databases, services, and realtime event streams.</li>
    <li>Data preprocessing, fault tolerance, and error handling.</li>
</ul>
</div>
</div>

<div class="col-md-6 col-sm-12">
<div class="cUseCasesContainer">
<h3>Streaming Data Analytics</h3>
<ul>
    <li>Calculate aggregations over time, length, and session windows.</li>
    <li>Long-running time-series aggregations from seconds to years.</li>
    <li>Analyze event occurrence patterns and trends over time.</li>
    <li>Realtime predictions with online and pre-trained ML models.</li>
</ul>
</div>
</div>

<div class="clearfix"></div>

<div class="col-md-6 col-sm-12">
<div class="cUseCasesContainer">
<h3>Alerts & Notifications</h3>
<ul>
    <li>Generate alerts based on static and dynamic thresholds.</li>
    <li>Correlate data to detect event anomalies and missing events.</li>
    <li>Support scheduling, digest, and auto-retry of notifications.</li>
    <li>Publish alerts via various event sinks such as email, and MQs.</li>
</li>
</ul>
</div>
</div>

<div class="col-md-6 col-sm-12">
<div class="cUseCasesContainer">
<h3>Adaptive Decision Making</h3>
<ul>
    <li>Static rule processing via predefined and database based rules.</li>
    <li>Dynamic rule processing through stateful queries and system state.</li>
    <li>Decision making through synchronous RPC (HTTP, gRPC).</li>
    <li>Incremental learning and decision making online ML models.</li>
</ul>
</div>
</div>


</div>
</div>



<div class="row cSection cWhite">
<div class="container bannerImage">
<div class="col-md-12 col-sm-12">
<h2>Working with Siddhi</h2>
<img src="images/how-siddhi-works.png"/>
<p/>
</div>
</div>
</div>


<div class="row cSection cGray cLinks">
<div class="container">

<div class="col-md-6 col-sm-12">
<h2>Try Siddhi</h2>
<ul>
    <li><h3><a href="en/_latest_version_/download/">Download</a></h3></li>
    <li><h3><a href="en/_latest_version_/docs/quick-start/">Getting started</a></h3></li>
    <li><h3><a href="en/_latest_version_/docs/query-guide/">Siddhi query guide</a></h3></li>
    <li><h3><a href="en/_latest_version_/development/architecture/">Architecture</a></h3></li>
    <li><h3 class="cLinks__last"><a href="en/_latest_version_/docs/siddhi-as-a-kubernetes-microservice/">How Siddhi works in Kubernetes</a></h3></li>
</ul>
</div>

<div class="col-md-6 col-sm-12">
<h2>Join the Community</h2>
<ul>
    <li><h3><a href="https://github.com/siddhi-io/siddhi/">Siddhi Core on GitHub</a></h3></li>
    <li><h3><a href="community/#asking-questions">Siddhi mailing list</a></h3></li>
    <li><h3><a href="community/contribution/">How to contribute</a></h3></li>
    <li><h3 class="cLinks__last"><a href="en/_latest_version_/development/source/">Siddhi GitHub repos</a></h3></li>
</ul>
</div>


</div>
</div>



