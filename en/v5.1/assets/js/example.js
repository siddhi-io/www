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



// function getUrlVars(url) {
//     var vars = {};
//     var hashes = url.split("?")[1];
//     var hash = hashes.split('&');
//
//     for (var i = 0; i < hash.length; i++) {
//         params = hash[i].split("=");
//         vars[params[0]] = params[1];
//     }
//     return vars;
// }

/*
 * Following script is adding line numbers to the ballerina code blocks in the gneerated documentation
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

function setTooltip(btn, message) {
    $(btn).attr('data-original-title', message)
        .tooltip('show');
}

function hideTooltip(btn) {
    setTimeout(function() {
        $(btn).tooltip('hide').removeAttr('data-original-title');
    }, 1000);
}
//
// //matching version selected with the URL
// function versionSelectorValue(ver){
//     var pathValue = window.location.pathname;
//     var selected_value = "";
//     if(pathValue.indexOf(ver) > -1){
//         selected_value = "selected='selected'";
//     }
//     return selected_value;
// }
//
$(document).ready(function() {
//     var pathValue = window.location.pathname;
//
//     var menu = '<div class="container">' +
//         '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">' +
//         '<nav class="navbar">' +
//         '<div>' +
//         '<div class="navbar-header">' +
//         '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">' +
//         '<span class="sr-only">&#9776</span>' +
//         '<span class="icon-bar"></span>' +
//         '<span class="icon-bar"></span>' +
//         '<span class="icon-bar"></span>' +
//         '</button>' +
//         '<a class="cMobileLogo" href="/" ><img src="/img/ballerina-logo.svg" alt="Ballerina"/></a>' +
//         '</div>' +
//         '<div id="navbar" class="collapse navbar-collapse">' +
//         '<ul class="nav navbar-nav cTopNav">' +
//         '<li class="active toctree-l1" id="learnli"><a class="cBioTopLink" href="/learn">Learn</a></li>' +
//         '<li class="active toctree-l1" id="Eventsli"><a class="cBioTopLink" href="/learn/events">Events</a></li>' +
//         '<li class="toctree-l1"><a class="cBioTopLink" href="https://central.ballerina.io/" target="_blank">Central</a></li>' +
//         '<li class="toctree-l1" id="openli"><a class="cBioTopLink" href="/community">Community</a></li>' +
//         '<li class="toctree-l1" id="helpli"><a class="cBioTopLink" href="https://blog.ballerina.io">Blog</a></li>' +
//         '<li class="cVersionItem"><div class="cVersionContainer"><lable class="cVlable">Version</lable><select name="versions" id="versions" class="select-css">' +
//         '<option value="/" '+versionSelectorValue("")+'>1.0</option>' +
//         '<option value="/v0-991'+pathValue+'" '+versionSelectorValue("991")+'>0.991</option> </select></div></li>' +
//         '</ul>' +
//         '</div>' +
//         '</div>' +
//         '</nav>' +
//         '</div>' +
//         '</div>';
//
//     var footer = '<div class="container">' +
//         '<div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 cBallerina-io-left-col cBallerinaFooterLinks">' +
//         '<ul>' +
//         '<li><a class="cBioFooterLink" href="/downloads">Download</a></li>' +
//         '<li><a class="cBioFooterLink" href="https://github.com/ballerina-lang/ballerina/blob/master/LICENSE">Code License</a></li>' +
//         '<li><a class="cBioFooterLink" href="/license-of-site">Site License</a></li>' +
//         '<li><a class="cBioFooterLink" href="/terms-of-service">TERMS OF SERVICE</a></li>' +
//         '<li><a class="cBioFooterLink" href="/privacy-policy">PRIVACY POLICY</a></li>' +
//         '</ul>' +
//         '</div>' +
//         '<div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 cBallerina-io-middle-col cBallerinaFooterSignUp">' +
//         '<p><span>Announcement List</span><br/>' +
//         '<div class="cFormContainer">' +
//         '<form>' +
//         '<div class="cFieldContainer">' +
//         '<input maxlength="90" value="" id="emailUser" name="email" placeholder="I consent to join the email list" title="email" type="text">' +
//         '</div>' +
//         '<div class="cButtonContainer">' +
//         '<a class="cBallerinaButtons subscribeUserForm" href="" id="subscribeUserButton"></a>' +
//         '</div>' +
//         '</form>' +
//         '</div>' +
//         '<div class="cSocialmedia">' +
//         '<ul>' +
//         '<li>' +
//         '<a class="cBioFooterLink" href="https://github.com/ballerina-platform" target="_blank"><img src="/img/github.svg"/></a>' +
//         '</li>' +
//         '<li><a class="cBioFooterLink" href="https://stackoverflow.com/questions/tagged/ballerina" target="_blank"><img src="/img/stackoverflow.svg"/></a></li>' +
//         '<li><a class="cBioFooterLink" href="https://twitter.com/ballerinalang" target="_blank"><img src="/img/twitter.svg"/></a></li>' +
//         '<li><a class="cBioFooterLink" href="/community/slack/"><img src="/img/slack.svg"/></a></li>' +
//         '</ul>' +
//         '<div class="pdframe"></div>' +
//         '</div>' +
//         '</div>' +
//         '<div class="col-xs-12 col-sm-10 col-md-6 col-lg-6 cBallerina-io-right-col">' +
//         //'<div class="cFooterBanner"><a href="https://con.ballerina.io/?utm_source=bio&utm_medium=banner&utm_campaign=bio_footer_banner" class="cFooterBanner-link" target="_blank"><img src="https://con.ballerina.io/wp-content/themes/ballerinacon/images/bcon-logo.png"/></a></div>' +
//         '<p>In the creation of Ballerina, we were inspired by so many technologies. Thank you to all that have come before us (and forgive us if we missed one): Java, Go, C, C++, D, Rust, Haskell, Kotlin, Dart, TypeScript, JavaScript, Python, Perl, Flow, Swift, Elm, RelaxNG, NPM, Crates, Maven, Gradle, Kubernetes, Docker, Envoy, Markdown, GitHub and WSO2.</p></div>' +
//         '</div>';
//
//
//
//     // var pathValue = window.location.pathname;
//     // var version =    '<div class="cVersionContainer"><lable class="cVlable">Version</lable>' +
//     // '<select name="versions" id="versions" class="select-css">' +
//     // '<option value="http://v1-0.ballerina.io'+pathValue+'">1.0</option>' +
//     // '<option value="https://v0-991.ballerina.io'+pathValue+'" selected="selected">0.991</option>' +
//     // '</select>'+
//     // '</div>';
//
//     // var homelink =  '<a href="/"><img class="logo" src="html-template-resources/images/ballerina-logo.png"></a>';
//
//
//     // $('.navi-wrapper-content a').replaceWith(homelink);
//
//
//
//
//     // $('.cBallerina-io-Logo-row .container').append(version);
//     // $('.navi-wrapper').append(version);
//
//
//     $('#iMainNavigation').append(menu);
//     $('#iBallerinaFooter').append(footer);
//     // $('.cVersionContainer').append (versionselector);
//
//     $("code").addClass('cBasicCode');
//     $(".ballerina").removeClass('cBasicCode');
//     $(".bash").removeClass('cBasicCode');
//
//     $(".cRuntimeContent").addClass('cShow');
//
//     $(".cSEQUENCE").addClass('active');
//     $(".cRUNTIME").addClass('active');
//
//
//
//     $(".cRUNTIME").click(function() {
//         $(".cRuntimeContent").addClass('cShow');
//         $(".cDeploymentContent").removeClass('cShow');
//         $(".cSECUREBYDEFAULTContent").removeClass('cShow');
//         $(".cLifecycleContent").removeClass('cShow');
//
//     });
//
//     $(".cDEPLOYMENT").click(function() {
//         $(".cRuntimeContent").removeClass('cShow');
//         $(".cDeploymentContent").addClass('cShow');
//         $(".cSECUREBYDEFAULTContent").removeClass('cShow');
//         $(".cLifecycleContent").removeClass('cShow');
//
//     });
//
//     $(".cLIFECYCLE").click(function() {
//         $(".cRuntimeContent").removeClass('cShow');
//         $(".cDeploymentContent").removeClass('cShow');
//         $(".cSECUREBYDEFAULTContent").removeClass('cShow');
//         $(".cLifecycleContent").addClass('cShow');
//     });
//
//     $(".cSEQUENCEContent").addClass('cShow');
//
//
//
//
//     $(".cSEQUENCE").click(function() {
//         $(".cSEQUENCEContent").addClass('cShow');
//         $(".cCONCURRENCYContent").removeClass('cShow');
//         $(".cTYPEContent").removeClass('cShow');
//         $(".cSECUREBYDEFAULTContent").removeClass('cShow');
//         $(".cNETWORKAWAREContent").removeClass('cShow');
//         $(".cCLOUDNATIVEContent").removeClass('cShow');
//         $(".cBESTPRACTICESENFORCEDContent").removeClass('cShow');
//         $(".cBEYONDTHELANGUAGEContent").removeClass('cShow');
//
//     });
//
//     $(".cCONCURRENCY").click(function() {
//         $(".cSEQUENCEContent").removeClass('cShow');
//         $(".cCONCURRENCYContent").addClass('cShow');
//         $(".cTYPEContent").removeClass('cShow');
//         $(".cSECUREBYDEFAULTContent").removeClass('cShow');
//         $(".cNETWORKAWAREContent").removeClass('cShow');
//         $(".cCLOUDNATIVEContent").removeClass('cShow');
//         $(".cBESTPRACTICESENFORCEDContent").removeClass('cShow');
//         $(".cBEYONDTHELANGUAGEContent").removeClass('cShow');
//
//     });
//
//     $(".cTYPE").click(function() {
//         $(".cSEQUENCEContent").removeClass('cShow');
//         $(".cCONCURRENCYContent").removeClass('cShow');
//         $(".cTYPEContent").addClass('cShow');
//         $(".cSECUREBYDEFAULTContent").removeClass('cShow');
//         $(".cNETWORKAWAREContent").removeClass('cShow');
//         $(".cCLOUDNATIVEContent").removeClass('cShow');
//         $(".cBESTPRACTICESENFORCEDContent").removeClass('cShow');
//         $(".cBEYONDTHELANGUAGEContent").removeClass('cShow');
//     });
//
//     $(".cSECUREBYDEFAULT").click(function() {
//         $(".cSEQUENCEContent").removeClass('cShow');
//         $(".cCONCURRENCYContent").removeClass('cShow');
//         $(".cTYPEContent").removeClass('cShow');
//         $(".cSECUREBYDEFAULTContent").addClass('cShow');
//         $(".cNETWORKAWAREContent").removeClass('cShow');
//         $(".cCLOUDNATIVEContent").removeClass('cShow');
//         $(".cBESTPRACTICESENFORCEDContent").removeClass('cShow');
//         $(".cBEYONDTHELANGUAGEContent").removeClass('cShow');
//     });
//
//     $(".cSECUREBYDEFAULT").click(function() {
//         $(".cSEQUENCEContent").removeClass('cShow');
//         $(".cCONCURRENCYContent").removeClass('cShow');
//         $(".cTYPEContent").removeClass('cShow');
//         $(".cSECUREBYDEFAULTContent").addClass('cShow');
//         $(".cNETWORKAWAREContent").removeClass('cShow');
//         $(".cCLOUDNATIVEContent").removeClass('cShow');
//         $(".cBESTPRACTICESENFORCEDContent").removeClass('cShow');
//         $(".cBEYONDTHELANGUAGEContent").removeClass('cShow');
//     });
//
//     $(".cNETWORKAWARE").click(function() {
//         $(".cSEQUENCEContent").removeClass('cShow');
//         $(".cCONCURRENCYContent").removeClass('cShow');
//         $(".cTYPEContent").removeClass('cShow');
//         $(".cSECUREBYDEFAULTContent").removeClass('cShow');
//         $(".cNETWORKAWAREContent").addClass('cShow');
//         $(".cCLOUDNATIVEContent").removeClass('cShow');
//         $(".cBESTPRACTICESENFORCEDContent").removeClass('cShow');
//         $(".cBEYONDTHELANGUAGEContent").removeClass('cShow');
//     });
//
//     $(".cCLOUDNATIVE").click(function() {
//         $(".cSEQUENCEContent").removeClass('cShow');
//         $(".cCONCURRENCYContent").removeClass('cShow');
//         $(".cTYPEContent").removeClass('cShow');
//         $(".cSECUREBYDEFAULTContent").removeClass('cShow');
//         $(".cNETWORKAWAREContent").removeClass('cShow');
//         $(".cCLOUDNATIVEContent").addClass('cShow');
//         $(".cBESTPRACTICESENFORCEDContent").removeClass('cShow');
//         $(".cBEYONDTHELANGUAGEContent").removeClass('cShow');
//     });
//
//     $(".cBESTPRACTICESENFORCED").click(function() {
//         $(".cSEQUENCEContent").removeClass('cShow');
//         $(".cCONCURRENCYContent").removeClass('cShow');
//         $(".cTYPEContent").removeClass('cShow');
//         $(".cSECUREBYDEFAULTContent").removeClass('cShow');
//         $(".cNETWORKAWAREContent").removeClass('cShow');
//         $(".cCLOUDNATIVEContent").removeClass('cShow');
//         $(".cBESTPRACTICESENFORCEDContent").addClass('cShow');
//         $(".cBEYONDTHELANGUAGEContent").removeClass('cShow');
//     });
//     $(".cBEYONDTHELANGUAGE").click(function() {
//         $(".cSEQUENCEContent").removeClass('cShow');
//         $(".cCONCURRENCYContent").removeClass('cShow');
//         $(".cTYPEContent").removeClass('cShow');
//         $(".cSECUREBYDEFAULTContent").removeClass('cShow');
//         $(".cNETWORKAWAREContent").removeClass('cShow');
//         $(".cCLOUDNATIVEContent").removeClass('cShow');
//         $(".cBESTPRACTICESENFORCEDContent").removeClass('cShow');
//         $(".cBEYONDTHELANGUAGEContent").addClass('cShow');
//     });
//
//     /*
//      * Search window toggle function
//      */
//     var $menuDropWindow = $(".cSearchBoxTopMenu"),
//         $searchInput = $('#mkdocs-search-query');
//
//     $(".cSerachIcon").click(function() {
//         $menuDropWindow.toggleClass('cShowcSearchTopMenu');
//         if ($menuDropWindow.hasClass('cShowcSearchTopMenu')) {
//             $searchInput.focus();
//         }
//
//
//
//
//
//
//     });
//
//     $(document).mouseup(function(e) {
//         if ((!$menuDropWindow.is(e.target)) &&
//             ($menuDropWindow.has(e.target).length === 0)) {
//             $menuDropWindow.removeClass('cShowcSearchTopMenu');
//             $searchInput.val('');
//             $('#mkdocs-search-results').html('');
//         }
//     });
//
//     /*
//      * subscribe form
//      */
//     $("#subscribeUserButton").click(function(event) {
//         event.preventDefault();
//         subscribeUser($(this).val());
//     });
//
//     $('#emailUser').on('keypress', function(event) {
//         if (event.which === 13) {
//             event.preventDefault();
//             $(this).attr("disabled", "disabled");
//             subscribeUser($(this).val());
//             $(this).removeAttr("disabled");
//         }
//     });
//
//     $(".cBallerina-io-packages").click(function() {
// //        $(".cCollaps-Menu").toggleClass('cOpenMenu');
// //        $(".cBallerina-io-packages").toggleClass('cOpenMenu');
// //        $(".cCollaps-Menu-first").removeClass('cOpenMenu');
// //        $(".cBallerina-io-primitive-types").removeClass('cOpenMenu');
// //        $(".cCollaps-Menu-second").removeClass('cOpenMenu');
// //        $(".cBallerina-io-x").removeClass('cOpenMenu');
//     });
//
//     $(".cBallerina-io-primitive-types").click(function() {
//         $(".cCollaps-Menu-first").toggleClass('cOpenMenu');
//         $(".cBallerina-io-primitive-types").toggleClass('cOpenMenu');
// //        $(".cCollaps-Menu").removeClass('cOpenMenu');
// //        $(".cBallerina-io-packages").removeClass('cOpenMenu');
// //        $(".cCollaps-Menu-second").removeClass('cOpenMenu');
// //        $(".cBallerina-io-x").removeClass('cOpenMenu');
//     });
//
//     $(".cBallerina-io-x").click(function() {
// //        $(".cCollaps-Menu-second").toggleClass('cOpenMenu');
// //        $(".cBallerina-io-x").toggleClass('cOpenMenu');
// //        $(".cCollaps-Menu").removeClass('cOpenMenu');
// //        $(".cBallerina-io-packages").removeClass('cOpenMenu');
// //        $(".cCollaps-Menu-first").removeClass('cOpenMenu');
// //        $(".cBallerina-io-primitive-types").removeClass('cOpenMenu');
//     });

    initCodeLineNumbers();


    document.querySelector("div.md-content > article > a.md-icon.md-content__icon").href= document.querySelector("span.info").getAttribute("dir")

    $('.cBE-body').each(function() {
        var lineCount = 0,
            olCount = 1;

        $('.cTR', this).each(function(i, n) {
            var $codeElem = $(n).find('td.code').get(0);
            var lines = $('> td.code', n).text().replace(/\n$/, "").trim().split(/\r\n|\r|\n/);
            var numbers = [];

            $.each(lines, function(i) {
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
            text: function(trigger) {
                return $('.FullCode').find('pre').text();
            }
        });

        // Register events show hide tooltip on click event
        clipboard.on('success', function(e) {
            setTooltip(e.trigger, 'Copied!');
            hideTooltip(e.trigger);
        });

        clipboard.on('error', function(e) {
            setTooltip(e.trigger, 'Failed!');
            hideTooltip(e.trigger);
        });

        $('.copy').tooltip({
            trigger: 'click',
            placement: 'bottom'
        });
        $("a.copy").unbind("click");



//
//     //disable enter key in searchbox
//     $('.form-control').on('keypress', function(event) {
//         if (event.which === 13) {
//             event.preventDefault();
//         }
//     });
//
//
//
//     $('a[href^="http://www.youtube.com/watch?"]').each(function(i, elem) {
//         /*
//          * Use below example code block in markdown files and replace <your-video-id> with video ID
//          * which on youtube URL & <alt-text> with some alternative text for the video
//          *
//          * <a href="http://www.youtube.com/watch?feature=player_embedded&v=<your-video-id>" target="_blank">
//          *     <img src="http://img.youtube.com/vi/<your-video-id>/0.jpg" alt="<alt-text>" width="480" height="360" border="10" />
//          * </a>
//          */
//         var $iframe = $('<iframe width="' + $('img', elem).attr('width') + '" ' +
//             'height="' + $('img', elem).attr('height') + '" ' +
//             'src="https://www.youtube.com/embed/' + getUrlVars($(elem).attr('href')).v + '" ' +
//             'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
//         $(elem).replaceWith($iframe);
//     });
//
// });
//
// $(function() {
//     var pathname = window.location.pathname;
//
//     if (pathname.indexOf("learn") != -1) {
//         $("#learnli").addClass("cActive");
//     } else if (pathname.indexOf("blog") != -1) {
//         $("#blogli").addClass("cActive");
//     } else if (pathname.indexOf("philosophy") != -1) {
//         $("#philosophyli").addClass("cActive");
//     } else if (pathname.indexOf("open-source") != -1) {
//         $("#openli").addClass("cActive");
//     } else if (pathname.indexOf("help") != -1) {
//         $("#helpli").addClass("cActive");
//     } else if (pathname.indexOf("lean/events") != -1) {
//         $("#eventsli").addClass("cActive");
//     }
// });
//
//
//
//
//
// $(document).ready(function() {
//     var urlmenu = document.getElementById( 'versions' );
//     urlmenu.onchange = function() {
//         window.open( this.options[ this.selectedIndex ].value , "_self" );
//     }
//
//     //subscribe form
//     $("#subscribeUserButtonOS").click(function(event) {
//         event.preventDefault();
//         subscribeUserOS();
//     });
//
//     $('#emailUserOS').on('keypress', function(event) {
//         if (event.which === 13) {
//             event.preventDefault();
//             $(this).attr("disabled", "disabled");
//             subscribeUserOS();
//             $(this).removeAttr("disabled");
//         }
//     });
//
//     function subscribeUserOS() {
//         var email = $('#emailUserOS').val();
//         $('#subscribeUserMessage').remove("");
//         if (email == "") {
//             $('#emailUserOS').val('');
//             $("#emailUserOS").attr("placeholder","Please enter your email.");
//         } else if (!isEmail(email)) {
//             $('#emailUserOS').val('');
//             $("#emailUserOS").attr("placeholder","Please enter a valid email.");
//         } else {
//             $('#emailUserOS').val('');
//             $(".pdframe").html("<iframe src='https://go.pardot.com/l/142131/2018-03-26/4yl979?email=" + email + "'></iframe>");
//             $("#emailUserOS").attr("placeholder","Your email address has been added.");
//         }
//         return;
//     }
//
//     //Slack user form
//     $("#slackSubscribeButton").click(function(event) {
//         event.preventDefault();
//         inviteSlackUser();
//     });
//     $('#email').on('keypress', function(event) {
//         if (event.which === 13) {
//             event.preventDefault();
//             $(this).attr("disabled", "disabled");
//             var email = $("#email").val();
//             inviteSlackUserService(email);
//             $(this).removeAttr("disabled");
//         }
//     });
// });



// $(document).ready(function() {
//     var a = function() {
//       var b = $(window).scrollTop();
//       var d = $("#scroller-anchor").offset({scroll:false}).top;
//       var c = $("#scroller");
//       if (b>d) {
//         c.css({position:"fixed",top:"0px"})
//       } else {
//         c.css({position:"relative",top:""})
//       }
//     };
//     $(window).scroll(a);a()
  });

/*
function sticky_relocate() {
    var window_top = $(window).scrollTop();
    var div_top = $('#scroller-anchor').offset().top;
    if (window_top > div_top) {
      $('#scroller').addClass('stick');
    } else {
      $('#scroller').removeClass('stick');
    }
  }
  
  $(function() {
    $(window).scroll(sticky_relocate);
    sticky_relocate();
  });*/