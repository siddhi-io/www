# Siddhi 5.1 Tooling 

## Overview
Siddhi provides tooling that supports following features to develop and test stream processing applications: 

* **Text Query Editor** with syntax highlighting and advanced auto completion support.
* **Event Simulator and Debugger** to test Siddhi Applications.
* **Graphical Query Editor** with drag and drop query building support.

<div>
    <p style="width: 49%;float:left;text-align: center;">
        <b>Graphical Query Editor</b>
        <img alt="" src="/images/editor/graphical-editor.png" title="Graphical Query Editor">
    </p>
    <p style="float:right;width:49%;text-align: center;">
        <b>Text Query Editor</b>
        <img alt="" src="/images/editor/source-editor.png" title="Source Editor">
    </p>
</div>


## How to configure the Tooling

### Configure Tooling in Local Machine
1. Install [Oracle Java SE Development Kit (JDK)](http://www.oracle.com/technetwork/java/javase/downloads/index.html) version 1.8.
2. [Set the JAVA_HOME](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/) environment
   variable.
3. Download the latest tooling distribution from [here](https://github.com/siddhi-io/distribution/releases/download/v5.1.0/siddhi-tooling-5.1.0.zip).
4. Extract the downloaded zip and navigate to `<TOOLING_HOME>/bin`. <br> (`TOOLING_HOME` refers to the extracted folder).
5. Issue the following command in the command prompt (Windows) / terminal (Linux/Mac)

    ```
    For Windows: tooling.bat
    For Linux/Mac: ./tooling.sh
    ```

### Configure Tooling in Docker 
There is a docker image for Siddhi tooling with all the dependencies that required for the Siddhi development. If you are familiar with Docker then you could use it.
You find the Siddhi tooling docker images in the [docker hub](https://hub.docker.com/r/siddhiio/siddhi-tooling)

You can issue the below command to run Siddhi docker container. Make sure, you already have a docker installation (Docker for Mac or Docker for Windows or Docker CE or any other docker engines) locally.

```
docker run -it -p 9390:9390 siddhiio/siddhi-tooling:5.1.0
```

After successfully starting the Siddhi Editor, the terminal should look like as shown below:
![](../../images/editor/docker-tooling.png?raw=true "Terminal after starting Siddhi Editor")

As you can see, we have exposed the port 9390 to the host machine since you have to access the Tooling web editor through that. After starting the Siddhi Editor, access the Editor GUI by visiting the following link in your browser (Google Chrome is the recommended). This takes you to the Siddhi Editor landing page.

```
http://localhost:9390/editor
```

**More info,**

There is a situation that you wanted to add any external dependencies (such as MySQL client jars), change the configurations and etc. Then, it would be ideal to create few mounting paths for the docker tooling as give below.

- Mounting path for the editor workspace (eg: `workspace`) - To avoid losing Siddhi apps if there are any failures with the docker container.
- Mounting path to add jars (eg: `jars`) - To add any external jars to the Siddhi tooling (for validation and testing purposes).
- Mounting path to add bundles (eg: `bundles`) - To add any external OSGI bundles to the Siddhi tooling (for validation and testing purposes).
- Mounting path to add configuration files (eg: `configs`) - To set any custom configurations or any other resources for the testing purposes.

In that case, you can directories locally as per your requirement and issue a similar command as shown below,

```
docker run -it -p 9390:9390 \ 
  -v <absolute path>/configs:/artifacts \
  -v <absolute path>/workspace:/home/siddhi_user/siddhi-tooling/wso2/tooling/deployment/workspace \
  -v <absolute path>/jars:/home/siddhi_user/siddhi-tooling/jars \
  -v <absolute path>/bundles:/home/siddhi_user/siddhi-tooling/bundles \
  siddhiio/siddhi-tooling:5.1.0
``` 

For example, let's assume that your email configuration as a file that you wanted to use within the Siddhi editor. In that case, you can add the email configuration file (eg: `EmailConfig.yaml`) into the `configs` mounting directory that you have created locally and issue below command to apply the configuration in Siddhi tooling.

```
docker run -it -p 9390:9390 \ 
  -v <absolute path>/configs:/artifacts \
  -v <absolute path>/workspace:/home/siddhi_user/siddhi-tooling/wso2/tooling/deployment/workspace \
  -v <absolute path>/jars:/home/siddhi_user/siddhi-tooling/jars \
  -v <absolute path>/bundles:/home/siddhi_user/siddhi-tooling/bundles \
  siddhiio/siddhi-tooling:5.1.0 -Dconfig=/artifacts/EmailConfig.yaml
``` 

### Siddhi App Export Tool for Docker/Kubernetes 

<iframe width="675" height="375" src="https://www.youtube.com/embed/e7xo2pO0DXg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
