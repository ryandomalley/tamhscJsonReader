/*  Author: Ryan O'Malley
*   Description: Creates a newsfeed based on a JSON feed
*   Version: 1.0
*/

var layout_auto = 'col';
var layout_lg_3 = 'col-lg-3';
var layout_lg_6 = 'col-lg-6';

function createFeed(url, maxNumPosts){
    document.open();
    //JQuery downloads the JSON feed then passes the data to handleJSON() function
    $.getJSON(url, function(data){
        handleJSON(data, maxNumPosts);
    });
    document.close();
}

function handleJSON(data, maxNumPosts){

    var jsonPostCount  = Object.keys(data.posts).length;
    var container_selector = document.getElementById("vr-feed-container");
    var output = "";
    /* Determining the layout of the post grid */

    if(maxNumPosts > jsonPostCount){
        maxNumPosts = jsonPostCount; //Maximum number of posts becomes the number of actual posts
    }

    if(maxNumPosts < 3){
        output += '<div class="row mb-4">\n';
        for(var i = 0; i < maxNumPosts; ++i){
            output += printPost(data.posts[i], i, layout_auto);
        }
        output += '</div>\n';
    }

    else{
        var numRows = Math.ceil(maxNumPosts/3.0);
        var postsLeft = jsonPostCount;

        for(var i = 0; i < numRows; ++i){
            output += '<div class="row mb-4">\n';

            for(var j = 0; j < 3; ++j){
                if(postsLeft == 0){
                    break;
                }

                var postIndex = 3*i + j;
                if(j == 2 && i%2 == 0){
                    output += printPost(data.posts[postIndex], postIndex, layout_lg_6);
                }
                else if(j == 0 && i%2 == 1){
                    output += printPost(data.posts[postIndex], postIndex, layout_lg_6);
                }
                else{
                    output += printPost(data.posts[postIndex], postIndex, layout_lg_3);
                }
            }

            output += '</div>\n';
        }
    }

    container_selector.innerHTML = output;

}
function printPost(post, postNumber, layout){
    var title = post.title;
    var sub_heading = post.subHeading;
    var image = post.tamhsc_640x500_thumbnail_src;
    var output = "";
    output += '<div id="' + postNumber + '" class="vr-article ' + layout + ' mb-3 mb-lg-0">\n';

        output +='<div class="hovereffect" tabindex="0">\n';

            output += '<div class="bg-cover bg-black" style="background-image: url(\'' + image + '\');" style="background-position: center;" ></div>\n';

            output += '<h3 class="font-size-2 font-weight-200 text-white">' + title + '</h3>\n';

            output += '<p class="text-white">' + sub_heading + '</p>\n';

        output += '</div>\n';

    output +='</div>\n';

    return output;
}