/*  Author: Ryan O'Malley
*   Description: Creates a newsfeed grid based on a JSON feed
*   Version: 1.0
*/

var layout_auto = 'col';
var layout_lg_3 = 'col-lg-3';
var layout_lg_6 = 'col-lg-6';

/*  createFeed()
*   Description: Inserts a news grid from a JSON feed
*
*   url : string of the url for the JSON feed
*   maxNumPosts : how many posts to display on the grid
*/
function createFeed(url, maxNumPosts){
    //JQuery downloads the JSON feed then passes the data to handleJSON() function
    $.getJSON(url, function(data){
        handleJSON(data, maxNumPosts);
    });
}

/*  createFeed()
*   Description: Inserts a news grid from a JSON feed
*
*   data : the data from the json file
*   maxNumPosts : how many posts to display on the grid
*/
function handleJSON(data, maxNumPosts){
    var jsonPostCount  = Object.keys(data.posts).length;     //Grabing number of posts
    var container_selector = document.getElementById("vr-feed-container"); //Selects the div that is the container for the news grid
    var output = "";
    /* Determining the layout of the post grid */

    if(maxNumPosts > jsonPostCount){
        maxNumPosts = jsonPostCount; //Maximum number of posts becomes the number of actual posts
    }

    // Condition where there is not enough posts to create a full row
    if(maxNumPosts < 3){
        output += '<div class="row mb-4">\n';
        /* Creates a row with class "col" for the columns.
        *  Columns will be equal length and automatically lay themselves out
        */
        for(var i = 0; i < maxNumPosts; ++i){
            output += printPost(data.posts[i], i, layout_auto);
        }
        output += '</div>\n';
    }

    //Otherwise create a 3 col grid
    else{
        // Calculating the number of rows. Using ceil because it must be a whole integer
        var numRows = Math.ceil(maxNumPosts/3.0);
        var postsLeft = maxNumPosts;

        // Rows
        for(var i = 0; i < numRows; ++i){
            // Creates a row every 3 posts
            output += '<div class="row mb-4">\n';
            // Cols
            for(var j = 0; j < 3; ++j){
                // Breaks out of loop when there are no longer posts to print
                if(postsLeft == 0){
                    break;
                }
                // Converts the 2D loop structure into the 1D array that the posts are contained in
                var postIndex = 3*i + j;

                // Creates the larger right most column on even rows
                if(j == 2 && i%2 == 0){
                    output += printPost(data.posts[postIndex], postIndex, layout_lg_6);
                }
                // Creates the larger left most column on odd rows
                else if(j == 0 && i%2 == 1){
                    output += printPost(data.posts[postIndex], postIndex, layout_lg_6);
                }
                // Ensures the last post takes up the rest of the row
                else if(postsLeft == 1){
                    output += printPost(data.posts[postIndex], postIndex, layout_auto);
                }
                // Default case
                else{
                    output += printPost(data.posts[postIndex], postIndex, layout_lg_3);
                }
                // Decrement to take number of posts left
                postsLeft--;
            }

            output += '</div>\n';
        }
    }

    // Sets the div's container to the output that was generated by this script
    container_selector.innerHTML = output;

}
function printPost(post, postNumber, layout){
    var title = post.title;
    var sub_heading = post.subHeading;
    var link = post.link;
    var image = post.tamhsc_640x500_thumbnail_src;
    var output = "";
    output += '<div id="' + postNumber + '" class="vr-article ' + layout + ' mb-3 mb-lg-0">\n';
        output += '<a href="' + link + '">\n'
            output +='<div class="hovereffect" tabindex="0" style="min-height: 300px">\n';

                output += '<div class="bg-cover bg-black" style="background-image: url(\'' + image + '\');" style="background-position: center;" ></div>\n';

                output += '<h3 class="font-size-2 font-weight-200 text-white">' + title + '</h3>\n';

                output += '<p class="text-white">' + sub_heading + '</p>\n';

            output += '</div>\n';
        output += '</a>\n';
    output +='</div>\n';

    return output;
}