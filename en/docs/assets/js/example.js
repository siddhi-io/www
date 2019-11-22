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

    document.querySelector("div.md-content > article > a.md-icon.md-content__icon").href = document.querySelector("span.info").getAttribute("dir")

    $('.cBE-body').each(function () {
        var lineCount = 0,
            olCount = 1;

        $('.cTR', this).each(function (i, n) {
            var lengthCount = 0;
            var $code = $(n).find('td.code');
            var $codeElem = $(n).find('td.code').get(0);
            var lines = $(n).find('pre > code').text().split(/\r\n|\r|\n/);
            // console.log(s);
            var numbers = [];

            $.each(lines, function (i, line) {
                lineCount += 1;
                lengthCount += 1;
                numbers.push('<span class="line-number">' + lineCount + '</span>');
            });

            $("<div/>", {
                "class": "bbe-code-line-numbers",
                html: numbers.join("")
            }).prependTo($codeElem);

            $code.attr("style","height:" + (lengthCount * 20) + "px");

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
