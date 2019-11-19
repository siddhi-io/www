/*!
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
 * Initialize custom dropdown component 
 */
var dropdowns = document.getElementsByClassName('md-tabs__dropdown-link');
var dropdownItems = document.getElementsByClassName('mb-tabs__dropdown-item');

function indexInParent(node) {
    var children = node.parentNode.childNodes;
    var num = 0;
    for (var i=0; i < children.length; i++) {
         if (children[i]==node) return num;
         if (children[i].nodeType==1) num++;
    }
    return -1;
}

for (var i = 0; i < dropdowns.length; i++) {
    var el = dropdowns[i];
    var openClass = 'open';

    el.onclick = function () {
        if (this.parentElement.classList) {
            this.parentElement.classList.toggle(openClass);
        } else {
            var classes = this.parentElement.className.split(' ');
            var existingIndex = classes.indexOf(openClass);

            if (existingIndex >= 0)
                classes.splice(existingIndex, 1);
            else
                classes.push(openClass);

            this.parentElement.className = classes.join(' ');
        }
    };
};

/* 
 * Reading versions
 */
var pageHeader = document.getElementById('page-header');
var docSetLang = pageHeader.getAttribute('data-lang');

var urlSplit = window.location.pathname.split('/');
if (urlSplit[1] === 'www') {
    (urlSplit[1] + '/' + urlSplit[2] !== 'www/' + docSetLang) ?
        docSetLang = '' :
        docSetLang = 'www/' + docSetLang + '/';
} else {
    (urlSplit[1] !== docSetLang) ?
        docSetLang = '' :
        docSetLang = docSetLang + '/';
}

var docSetUrl = window.location.origin + '/' + docSetLang;
var request = new XMLHttpRequest();

request.open('GET', docSetUrl +
             'versions/assets/versions.json', true);


/*
 * register siddhi highlightjs
 */
if (typeof hljs === 'object') {
    hljs.registerLanguage("siddhi", function (e) {
        var t = e.C("--", "$"),
            n = {
            cN: "number",
            b: "\\b(0[bB]([01]+[01_]+[01]+|[01]+)|0[xX]([a-fA-F0-9]+[a-fA-F0-9_]+[a-fA-F0-9]+|[a-fA-F0-9]+)|(([\\d]+[\\d_]+[\\d]+|[\\d]+)(\\.([\\d]+[\\d_]+[\\d]+|[\\d]+))?|\\.([\\d]+[\\d_]+[\\d]+|[\\d]+))([eE][-+]?\\d+)?)[lLfF]?",
            relevance: 0
        };
        return {
            cI: !0,
            k: {
                keyword: "stream define function trigger table app from partition window select group by order " +
                "limit offset asc desc having insert delete update set return events into output expired current " +
                "snapshot for raw of as at or and in on is not within with begin end every last all first " +
                "join inner outer right left full unidirectional aggregation aggregate per",
                literal: "true false null years year months month weeks week days day hours hour minutes minute min " +
                "seconds second sec milliseconds millisecond millisec",
                built_in: "string int long float double bool object"
            },
            i: /[<>{}*]/,
            c: [
                {cN: "string", b: "'", e: "'", c: [e.BE, {b: "''"}]},
                {cN: "string", b: '"', e: '"', c: [e.BE, {b: '""'}]},
                {cN: "string", b: '"""', e: '"""', c: [e.BE, {b: '""""""'}]},
                {cN: "string", b: "`", e: "`", c: [e.BE]},
                e.CBCM, t, n,
                {cN: "annotation", b: "@[A-Za-z]+"}
            ]
        }
    });
}
/*
 * Initialize highlightjs
 */
hljs.initHighlightingOnLoad();

/*
 * Following script is adding line numbers to the siddhi code blocks in the gneerated documentation
 */
function initCodeLineNumbers() {
    $('pre > code, pre > code.language').each(function() {

        if ($(this).parent().find('.line-numbers-wrap').length === 0) {
            //cont the number of rows
            //Remove the new line from the end of the text
            var numberOfLines = $(this).text().replace(/\n$/, "").split(/\r\n|\r|\n/).length;
            var lines = '<div class="line-numbers-wrap">';

            //Iterate all the lines and create div elements with line number
            for (var i = 1; i <= numberOfLines; i++) {
                lines = lines + '<div class="line-number">' + i + '</div>';
            }
            lines = lines + '</div>';
            //calculate <pre> height and set it to the container
            var preHeight = numberOfLines * 18 + 20;

            $(this).parent()
                .addClass('code-pre-wrapper')
                .prepend($(lines));
        }

    });
}

request.onload = function() {

    initCodeLineNumbers();

    if (request.status >= 200 && request.status < 400) {

      var data = JSON.parse(request.responseText);
      var dropdown =  document.getElementById('version-select-dropdown');
      var checkVersionsPage = document.getElementById('current-version-stable');

      /*
       * Appending versions to the version selector dropdown
       */
      if (dropdown){
          data.list.sort().forEach(function(key, index){
              var versionData = data.all[key];

              if(versionData) {
                  var liElem = document.createElement('li');
                  var docLinkType = data.all[key].doc.split(':')[0];
                  var target = '_self';
                  var url = data.all[key].doc;

                  if ((docLinkType == 'https') || (docLinkType == 'http')) {
                      target = '_blank'
                  }
                  else {
                      url = docSetUrl + url;
                  }

                  liElem.className = 'md-tabs__item mb-tabs__dropdown';
                  var keyText = key;
                  if (key == data.next) {
                      keyText = key + " (pre)"
                  }liElem.innerHTML =  '<a href="' + url + '" target="' +
                      target + '">' + keyText + '</a>';

                  dropdown.insertBefore(liElem, dropdown.firstChild);
              }
          });

          document.getElementById('show-all-versions-link')
              .setAttribute('href', docSetUrl + 'versions');
      }

      /*
       * Appending versions to the version tables in versions page
       */
      if (checkVersionsPage){
          var previousVersions = [];

          Object.keys(data.all).forEach(function(key, index){
              if ((key !== data.current) && (key !== data['pre-release'])) {
                  var docLinkType = data.all[key].doc.split(':')[0];
                  var target = '_self';

                  if ((docLinkType == 'https') || (docLinkType == 'http')) {
                      target = '_blank'
                  }

                  previousVersions.push('<tr>' +
                    '<th>' + key + '</th>' +
                        '<td>' +
                            '<a href="' + data.all[key].doc + '" target="' +
                                target + '">Documentation</a>' +
                        '</td>' +
                        '<td>' +
                            '<a href="' + data.all[key].notes + '" target="' +
                                target + '">Release Notes</a>' +
                        '</td>' +
                    '</tr>');
              }
          });

          // Past releases update
          document.getElementById('previous-versions').innerHTML =
                  previousVersions.join(' ');

          // Current released version update
          document.getElementById('current-version-number').innerHTML =
                  data.current;
          document.getElementById('current-version-documentation-link')
                  .setAttribute('href', docSetUrl + data.all[data.current].doc);
          document.getElementById('current-version-release-notes-link')
                  .setAttribute('href', docSetUrl + data.all[data.current].notes);

          // Pre-release version update
          document.getElementById('pre-release-version-documentation-link')
              .setAttribute('href', docSetUrl + 'next/');
      }

  } else {
      console.error("We reached our target server, but it returned an error");
  }
};

request.onerror = function() {
    console.error("There was a connection error of some sort");
};

request.send();

var siddhiLogo = document.querySelector(".md-header-nav__button.md-logo");
siddhiLogo.setAttribute("href","/");

/*
 * TOC position highlight on scroll
 */

var observeeList = document.querySelectorAll(".md-sidebar__inner > .md-nav--secondary .md-nav__link");
var listElems = document.querySelectorAll(".md-sidebar__inner > .md-nav--secondary > ul li");
var config = { attributes: true, childList: true, subtree: true };

var callback = function(mutationsList, observer) {
    for(var mutation of mutationsList) {
        if (mutation.type === 'attributes') {
            mutation.target.parentNode.setAttribute(mutation.attributeName,
                mutation.target.getAttribute(mutation.attributeName));
            scrollerPosition(mutation);
        }
    }
};
var observer = new MutationObserver(callback);

if (listElems.length > 0) {
    listElems[0].classList.add('active');
}

for (var i = 0; i < observeeList.length; i++) {
    var el = observeeList[i];

    observer.observe(el, config);

    el.onclick = function(e) {
        listElems.forEach(function(elm) {
            if (elm.classList) {
                elm.classList.remove('active');
            }
        });

        e.target.parentNode.classList.add('active');
    }
};

function scrollerPosition(mutation) {
    var blurList = document.querySelectorAll(".md-sidebar__inner > .md-nav--secondary > ul li > .md-nav__link[data-md-state='blur']");

    listElems.forEach(function(el) {
        if (el.classList) {
            el.classList.remove('active');
        }
    });

    if (blurList.length > 0) {
        if (mutation.target.getAttribute('data-md-state') === 'blur') {
            if (mutation.target.parentNode.querySelector('ul li')) {
                mutation.target.parentNode.querySelector('ul li').classList.add('active');
            } else {
                setActive(mutation.target.parentNode);
            }
        } else {
            mutation.target.parentNode.classList.add('active');
        }
    } else {
        if (listElems.length > 0) {
            listElems[0].classList.add('active');
        }
    }
};

function setActive(parentNode, i) {
    i = i || 0;
    if (i === 5) {
        return;
    }
    if (parentNode.nextElementSibling) {
        parentNode.nextElementSibling.classList.add('active');
        return;
    }
    setActive(parentNode.parentNode.parentNode.parentNode, ++i);
}

/*
 * Handle edit icon on scroll
 */

var editIcon = document.getElementById('editIcon');

window.addEventListener('scroll', function() {
    var scrollPosition = window.scrollY || document.documentElement.scrollTop;
    if (scrollPosition >= 90) {
        editIcon.classList.add('active');
    } else {
        editIcon.classList.remove('active');
    }
});
