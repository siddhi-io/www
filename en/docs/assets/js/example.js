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
 * Following script is adding line numbers to the siddhi code blocks in the gneerated documentation
 */
function initCodeLineNumbers() {
    $('pre > code.ballerina, pre > code.language-ballerina').each(function() {

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
                .addClass('ballerina-pre-wrapper')
                .prepend($(lines));
        }

    });
}

if (typeof hljs === 'object') {
    hljs.configure({languages: []});
    hljs.registerLanguage('ballerina', function () {
        return {
            "k": "stream define function trigger table plan from partition window select group by having insert" +
            "overwrite delete update return events into output expired current snapshot for raw of as at or and" +
            "in on is not within with begin end null every last all first join inner outer right left full" +
            "unidirectional years year months month weeks week days day hours hour minutes minute min seconds" +
            "second sec milliseconds millisecond millisec false true",
            "i": {},
            "c": [{
                "cN": "ballerinadoc",
                "b": "/\\*\\*",
                "e": "\\*/",
                "r": 0,
                "c": [{
                    "cN": "ballerinadoctag",
                    "b": "(^|\\s)@[A-Za-z]+"
                }]
            }, {
                "cN": "comment",
                "b": "//",
                "e": "$",
                "c": [{
                    "b": {}
                }, {
                    "cN": "label",
                    "b": "XXX",
                    "e": "$",
                    "eW": true,
                    "r": 0
                }]
            }, {
                "cN": "comment",
                "b": "/\\*",
                "e": "\\*/",
                "c": [{
                    "b": {}
                }, {
                    "cN": "label",
                    "b": "XXX",
                    "e": "$",
                    "eW": true,
                    "r": 0
                }, "self"]
            }, {
                "cN": "string",
                "b": "\"",
                "e": "\"",
                "i": "\\n",
                "c": [{
                    "b": "\\\\[\\s\\S]",
                    "r": 0
                }, {
                    "cN": "constant",
                    "b": "\\\\[abfnrtv]\\|\\\\x[0-9a-fA-F]*\\\\\\|%[-+# *.0-9]*[dioxXucsfeEgGp]",
                    "r": 0
                }]
            }, {
                "cN": "number",
                "b": "(\\b(0b[01_]+)|\\b0[xX][a-fA-F0-9_]+|(\\b[\\d_]+(\\.[\\d_]*)?|\\.[\\d_]+)([eE][-+]?\\d+)?)[lLfF]?",
                "r": 0
            }, {
                "cN": "annotation",
                "b": "@[A-Za-z]+"
            }, {
                "cN": "type",
                "b": "\\b(bool|int|float|string|long|double|object)\\b",
                "r": 0
            }]
        };
    });
}


function setTooltip(btn, message) {
    $(btn).attr('data-original-title', message)
        .tooltip('show');
}

function hideTooltip(btn) {
    setTimeout(function () {
        $(btn).tooltip('hide').removeAttr('data-original-title');
    }, 1000);
}

$(document).ready(function () {

    initCodeLineNumbers();


    document.querySelector("div.md-content > article > a.md-icon.md-content__icon").href = document.querySelector("span.info").getAttribute("dir")

    $('.cBE-body').each(function () {
        var lineCount = 0,
            olCount = 1;

        $('.cTR', this).each(function (i, n) {
            var $codeElem = $(n).find('td.code').get(0);
            var lines = $('> td.code', n).text().replace(/\n$/, "").trim().split(/\r\n|\r|\n/);
            var numbers = [];

            $.each(lines, function (i) {
                lineCount += 1;
                numbers.push('<span class="line-number">' + lineCount + '</span>');
            });

            $("<div/>", {
                "class": "bbe-code-line-numbers",
                html: numbers.join("")
            }).prependTo($codeElem);


            if ($('.cCodeDesription > div > ol', this).length > 0) {
                var $elem = $('.cCodeDesription > div > ol', this);
                $($elem).parent().prepend('<span class="ol-number">' + olCount + '.</span>');
                olCount++;
            } else {
                olCount = 1;
            }
        });
    });


    // register "copy to clipboard" event to elements with "copy" class
    var clipboard = new ClipboardJS('.copy', {
        text: function (trigger) {
            return $('.FullCode').find('pre').text();
        }
    });

    // Register events show hide tooltip on click event
    clipboard.on('success', function (e) {
        setTooltip(e.trigger, 'Copied!');
        hideTooltip(e.trigger);
    });

    clipboard.on('error', function (e) {
        setTooltip(e.trigger, 'Failed!');
        hideTooltip(e.trigger);
    });

    $('.copy').tooltip({
        trigger: 'click',
        placement: 'bottom'
    });
    $("a.copy").unbind("click");

});
