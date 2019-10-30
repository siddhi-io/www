# Overview of Use case Guides
Siddhi Cloud Native Stream Processor contains various set up [features](../features) to cater the use cases in the stream processing and complex event processing domain. We have taken a few of such commonly used use cases and discussed in this section. These use case guides are written end to end from the developer to deployment. Please find the high level overview details of the guides below. 

## Generating Alerts Based on Static and Dynamic Thresholds
In this guide, you will understand one of the common requirements of a Stream Processing which is generating alerts based on static and dynamic thresholds. To understand this requirement, we'll discuss how to implement the `Throttling` requirement with Siddhi. Throttling has become one of the unavoidable needs with the evolution of APIs and API management. Throttling is a process that is used to control the usage of APIs by consumers during a given period.

Refer more details in the [guide](../alerts-for-thresholds/guide)

## Data Preprocessing, Fault Tolerance, and Error Handling
In this guide, we are going to understand some interesting topics around streaming data integration; they are data preprocessing, fault tolerance and error handling. To understand these capabilities, we have considered a health care use case. In this scenario, Glucose reading events are received from sensors that mounted on patients. These events are received to the Stream Processing engine, get preprocessed, unrelated attributes are removed and send them to another processing layer to process if there are any abnormal behavior observed.

Refer more details in the [guide](../fault-tolerance/guide)

## Analyze Event Occurrence Patterns and Trends Over Time
In this guide, we are going to discuss a unique and appealing feature of a complex event processing system which is `Patterns and Trends`. Patterns and Trends are highly utilized in various business domains for the day to day business activities and growth. To understand these capabilities, we have considered a Taxi service use case. In this scenario, we have identified the increasing trend of rider requests over time and direct required riders to that specific geographical area to increase the chance of getting more rides.

Refer more details in the [guide](../patterns-and-trends/guide)

## Static Rule Processing via Predefined and Database Based Rules
In this guide, we are going to explore how to process static rules stored in a database and make a decision according to those stored rules. By following this guide you will be able to implement a system capable of making decisions according to a set of static rules. The static rules will be stored in a relational database(MySQL). You can dynamically change the rules in the database according to your business requirements without touching the deployed system. All the dynamic values need for each rule can be templated and pump into the rule at runtime.

Refer more details in the [guide](../database-static-rule-processing/guide)

## Retrieve and Publish Data from/to Various Enterprise Systems
This guide illustrates how you can receive data from various enterprise systems, process it, and then send processed data into other systems. To understand this requirement, we'll implement a traffic management system which notifies the subscribers regarding the transport delays, etc... After completing this guide you will understand how to receive various inputs from heterogeneous systems (like NATS, RDBMS, MongoDB), process it, and send back processed outputs in various formats like Email notification.

Refer more details in the [guide](../integrate-various-enterprise-systems/guide)

## Realtime predictions with pre-trained ML models
In this guide, we are going to understand how we can use Siddhi’s capability to perform real time predictions with pre-trained machine learning models. This guide demonstrates how we can build a recommendation system that recommends movies based on the user’s review comments. Within this guide, we focus on using machine learning capabilities integrated with Siddhi to perform Sentiment Analysis and generate movie recommendations. We'll use a pre-trained TensorFlow model to predict whether a movie review is positive or negative using BERT in Tensorflow and then a PMML model trained with the MovieLense dataset to generate recommendations for a positively reviewed movie.

Refer more details in the [guide](../realtime-movie-recommendation/guide)

## Long-running time based Aggregations
In this guide, you will understand one of the common requirements of Analytics which is aggregating data. Aggregation is a mandatory need in any system as it allows users to spot trends and anomalies easily which can lead to actions that will benefit an organization or the business. Aggregated data can also be processed easily to get the information needed for a business requirement decision. In this guide, we'll consider the sales in a shopping mall and discusses how Siddhi aggregations queries can be used to implement the long running aggregations to provide better insights about the business

Refer more details in the [guide](../long-term-aggregation/guide)