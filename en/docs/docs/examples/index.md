
<!--copy to clipboard lib-->
<script src="../../assets/js/clipboard-2.0.0.min.js"></script>
<script src="../../assets/js/jquery-3.3.1.min.js"></script>
<script src="../../assets/js/bootstrap-3.3.7.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

<script>
   var base_url = "";
</script>
<link rel=stylesheet href="../../assets/css/example.css">
<link rel=stylesheet href="../../assets/css/example-home.css">
<h1>Siddhi By Example</h1>

<p>
Siddhi by Example enables you to have complete coverage over the Siddhi query language and some of it's key extenstions, while emphasizing incremental learning. This is a series of commented example programs.
</p>
<p><b>Note:</b> This section is under construction.</p>
<div id="example"></div>

<script>
    $.getJSON("all-sbes.json", function (all_stuff) {
        console.log("all stuff : ", all_stuff);

        var i = 0;
        var div_content;

        $.getJSON("built-sbes.json", function (important_stuff) {
            console.log("important stuff : ", important_stuff);

            $.each(all_stuff, function (key, value) {

                var category, categoryName;

                if (!(value['category'])) {
                    category = 'other';
                    categoryName = 'Other';
                } else {
                    category = (value['category'].toLowerCase()).replace(/./g, '_');
                    categoryName = (value['category']);
                }

                console.log("for each:", category, categoryName);

                var categoryElem = $('[data-category=' + category + ']');

                if (categoryElem.length <= 0) {
                    var newCategoryElem = '<div class="clearfix" data-category="' + category + '">' +
                        '<div class="col-md-12"><h3>' + categoryName + '</h3><hr></div>' +
                        '<div class="col-xs-12 col-sm-16 col-md-3 col-lg-3 cLanguageFeatures featureSet0"></div>' +
                        '<div class="col-xs-12 col-sm-16 col-md-3 col-lg-3 cLanguageFeatures featureSet1"></div>' +
                        '<div class="col-xs-12 col-sm-16 col-md-3 col-lg-3 cLanguageFeatures featureSet2"></div>' +
                        '<div class="col-xs-12 col-sm-16 col-md-3 col-lg-3 cLanguageFeatures featureSet3"></div>' +
                        '</div>';
                }

                $("#example").append(newCategoryElem);


                div_content = "";

                div_content += '<ul>';
                div_content += '<li class="cTableTitle">' + value['title'] + '</li>';

                $.each(value['samples'], function (exkey, example) {
                    var link = example['url'];

                    //Filtering out the failed SBEs
                    var is_exist = $.inArray(link, important_stuff);
                    if (is_exist == -1) {
                        return true;
                    } else {
                        div_content += '<li><a href="' + link + '">' + example['name'] + '</a></li>';
                    }
                });

                div_content += '</ul>';
                $('[data-category=' + category + '] .featureSet' + value['column']).append(div_content);
                i++;
            });

        });
    });
</script>
