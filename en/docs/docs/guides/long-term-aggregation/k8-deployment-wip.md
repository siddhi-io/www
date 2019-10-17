# Work in progress

## Deployment

### Deploy on Kubernetes

1. It is advisable to create a namespace in Kubernetes to follow below steps.

    ````console
    kubectl create ns siddhi-aggregation-guide
    ````

2. There are some prerequisites that you should meet to tryout below SiddhiProcess. Such as configure MySQL database in Kubernetes. First, configure the MySQL server within the created namespace as in Step 1. You can use the official [helm chart](https://github.com/helm/charts/tree/master/stable/mysql) provided for MySQL.

    * First, install the MySQL helm chart as shown below,

        ````console
        helm install --name mysql-server --namespace=siddhi-aggregation-guide --set mysqlRootPassword=root,mysqlUser=root,mysqlDatabase=testdb stable/mysql
        ````

        Here, you can define the root password to connect to the MYSQL database and also define the database name. BTW, make sure to do `helm init --tiller-namespace=siddhi-aggregation-guide` if it is not done yet.

        Verify pods are running with `kubectl get pods --namespace=siddhi-aggregation-guide`

    * Then, you can set a port forwarding to the MySQL service which allows you to connect from the Host.

        ````console
            kubectl port-forward svc/mysql-server 13300:3306 --namespace=siddhi-aggregation-guide
        ````

    * Then, you can login to the MySQL server from your host machine as shown below.

        [![docker_mysql_db_info](images/k8s-mysql-db-info.png "MySQL Docker Database Details")](images/k8s-mysql-db-info.png)

3. Afterwards, you can install Siddhi Operator

    * To install the Siddhi Kubernetes operator run the following commands.

        ````console
        kubectl apply -f https://github.com/siddhi-io/siddhi-operator/releases/download/v0.2.0/00-prereqs.yaml  --namespace=siddhi-aggregation-guide
        kubectl apply -f https://github.com/siddhi-io/siddhi-operator/releases/download/v0.2.0/01-siddhi-operator.yaml --namespace=siddhi-aggregation-guide
        ````

    * You can verify the installation by making sure the following deployments are running in your Kubernetes cluster.

        [![kubernetes_siddhi-pods](images/k8s-pods.png "K8S Siddhi Pods")](images/k8s-pods.png)

        [![kubernetes_siddhi-svc](images/k8s-svc.png "K8S Siddhi Services")](images/k8s-svc.png)

4. Siddhi applications can be deployed on Kubernetes using the Siddhi operator.

    * To deploy the above created Siddhi app, we have to create custom resource object yaml file (with the kind as SiddhiProcess).

    * Kubernetes CRD can be exported from the Siddhi [tooling](https://siddhi.io/en/v5.0/docs/tooling/) runtime with the editor UI in [http://localhost:9390/editor](http://localhost:9390/editor)
  
    * Select the Export -> For Kubernetes Option

    * Steps 1- 5 is the same for both artifacts.

    * In Step 6, push the docker image with different name to Docker deployment.

        !!! info
            This docker image will be different to the one pushed in Docker deployment, since only base image with additional bundles will be push to the docker in Kubernetes deployment.

        !!! info
            Ensure that the pushed docker image is public

    * Step 7 : Let's create non-distributed and stateless deployment
        [![export_docker_kubernetes_config](images/step7.png "Export kubernetes artifacts Step 7")](images/step7.png)

    * Extract siddhi-kubernetes.zip

    * Now,  let’s create the above resource in the Kubernetes  cluster with below command.

        ````console
        kubectl --namespace=siddhi-aggregation-guide apply -f <absolute-path>/siddhi-kubernetes/siddhi-process.yaml
        ````

        Once, siddhi apps are successfully deployed. You can verify its health with below Kubernetes commands

        [![kubernetes_pods_with_siddhi](images/k8s-pods-with-siddhi.png "Kubernetes Pods")](images/k8s-pods-with-siddhi.png)

    * You can use the sample mock data generator to add data for past 5 days sales. Download the [mock data generator](https://github.com/niveathika/siddhi-mock-data-generator/releases/download/v1.0.0/siddhi-mock-data-generator-1.0.0.jar). Execute the below command to run the mock data generator.

        ```console
        java -jar siddhi-mock-data-generator-1.0.0.jar
        ```

    * Invoke the dailyDealsAlert service with the following cURL request. You can set `emailToBeSent` as false to not send an email but only to observe the logs.

        ```console
        curl -X POST \
        http://localhost:8080/dailyDealsAlert \
        -k \
        -H 'Content-Type: application/json' \
        -d '{
            "emailToBeSent": true
        }'
        ```

    * You can see the output log in the console. Here, you will be able to see the alert log printed as shown below.

        [![kubernetes_siddhi_console_output](images/k8s-console-output.png "Kubernetes Console Output")](images/k8s-console-output.png)

        !!! info "Refer [here](https://siddhi.io/en/v5.1/docs/siddhi-as-a-kubernetes-microservice/) to get more details about running Siddhi on Kubernetes."
