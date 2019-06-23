# Siddhi 4.x Download

##Siddhi Java Library 

Get all released Siddhi 4.x libraries from the Maven repository: 

* [Siddhi Core](https://mvnrepository.com/artifact/org.wso2.siddhi/siddhi-core)
* [Siddhi Query API](https://mvnrepository.com/artifact/org.wso2.siddhi/siddhi-query-api)
* [Siddhi Query Compiler](https://mvnrepository.com/artifact/org.wso2.siddhi/siddhi-query-compiler)
* [Siddhi Annotation](https://mvnrepository.com/artifact/org.wso2.siddhi/siddhi-annotations)

Refer the [user guide](../user-guide/) for using Siddhi as a Java library.

##Siddhi in Python (PySiddhi4)

The current version is tested with Microsoft Windows and Unix/Linux based operating systems. 
PySiddhi4 can be installed using one of the following methods.

#### Prerequisites

- The following dependencies should be installed prior to installation of library.
  
      **Linux**
      
      - Python 2.7 or 3.x
      - Cython <br/> `sudo pip install cython`
      - Python Developer Package <br/> `sudo apt-get install python-dev python3-dev python-dev`
      - Oracle Java 8 and set JAVA_HOME path
      - libboost for Python _(Only to build from Source)_ <br/>`sudo apt-get install libboost-python-dev` 
      - Maven _(Only to build from Source)_
      - g++ and other development tools _(Only to build from Source)_ <br/>
                `sudo apt-get install build-essential g++ autotools-dev libicu-dev build-essential libbz2-dev libboost-all-dev`
  
      **macOS**
      
      - Install brew
      - Install python using brew
      - Cython <br/> `sudo pip install cython`
      - Oracle Java 8 and set JAVA_HOME path
      - boost for python _(Only to build from Source)_ <br/> `brew install boost`
      - Maven _(Only to build from Source)_
  
      **Windows**
      
      - Install Python 
      - Cython <br/>`sudo pip install cython`
      - Oracle Java 8 and set JAVA_HOME path
      - Install Visual Studio Build tools _(Only to build from Source)_
      - Maven _(Only to build from Source)_
    
- Download siddhi-sdk release (1.x versions) from [here](https://github.com/wso2/siddhi-sdk/releases) and set the SIDDHISDK_HOME as an environment variable. <br/> `export SIDDHISDK_HOME="<path-to-siddhi-sdk>"`
- Download siddhi-python-api-proxy-4-x.x.x.jar from [here](https://github.com/wso2/PySiddhi/releases) and copy to `<SIDDHISDK_HOME>/lib` directory

####Installing PySiddhi4 

##### Installing PySiddhi4 via Python Package Management

PySiddhi4 can be installed via PIP command as bellow.

```
pip install pysiddhi4
```

##### Installing PySiddhi4 from Online Code

Using the following PIP command, PySiddhi4 can be directly installed from online code available in GitHub.
```
pip install git+https://github.com/siddhi-io/PySiddhi/tree/4.x
```
*Note: In case of permission errors, use `sudo`*

##### Installing from Downloaded Code
Switch to the branch `master` of PySiddhi4.
Navigate to source code root directory and execute the following PIP command.

```
pip install .
```
*Note the period (.) at end of command. In case of permission errors, use `sudo`*

#### Uninstalling PySiddhi4
If the library has been installed as explained above, it could be uninstalled using the following pip command.
```
pip uninstall pysiddhi4
```

Refer the [user guide](../user-guide/) for using Siddhi in Python.


