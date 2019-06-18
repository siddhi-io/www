/*
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
 */

/* 
 * Reading to current
 */

var request = new XMLHttpRequest();
var docSetLang = "/en/";
var urlSplit = window.location.pathname.split('/');
if (urlSplit[1] + '/' + urlSplit[2] === 'www/en') {
    docSetLang = '/www/en/';
} else if (urlSplit[1] === 'www') {
    if (urlSplit[2] !== '') {
        docSetLang = '/www/' + urlSplit[2] + '/';
    } else {
        docSetLang = '/www/en/';
    }
}

request.open('GET', docSetLang + 'versions/assets/versions.json', true);

request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);
        console.error("Current version " + data.current);
        window.location = docSetLang + data.current;
    } else {
        console.error("We reached our target server, but it returned an error");
    }
};

request.onerror = function () {
    console.error("There was a connection error of some sort");
};

request.send();
