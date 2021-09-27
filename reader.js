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
    //Fetch API downloads JSON file to feed to our handler
    fetch(url)
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data){
            handleJSON(data, maxNumPosts);
            injectStyle();
        });
}
/*  injectStyle()
*   Description: automatically injects required CSS into the head of the document.
*/
function injectStyle(){
    const style = document.createElement('style');
    style.textContent = `
    .hovereffect {
        background-color: black;
        background-size: cover;
        padding: 2em;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .bg-cover.bg-black{
        transition: .4s;
    }
    .bg-cover.bg-black:hover {
        opacity: .15;

    }
    `;
    document.head.append(style);
}

/**
 * Given an URL to a JSON feed, creates a bullet point list of the feed where the function is called
 * @param {String} url the URL to the JSON feed
 * @param {Number} maxNumPosts the amount of posts to display
 * @param {String} divId the HTML id for the div in which to insert the feed
 */
function bulletPointFeed(url, maxNumPosts, divId){
    fetch(url)
        //Return the web server's response as JSON
        .then(function(resp) {
            return resp.json(); //Get json
        })
        //Handle the JSON response
        .then(function(data){
            /* Handling the format provided by Vital Record
            *  Some of the feeds use a post object (mainly the articles published on VR)
            *  Others don't, and the json data needs to be directly iterated */
            if(data.posts){
                data = data.posts; // Redefine data as the post object ONLY IF it exists
            }
            output = "<ul style='list-style-type: none;'>\n";
            var jsonPostCount  = Object.keys(data).length; // Length of the number of JSON posts in feed
            // Iterate through the 
            for(var i = 0; i < maxNumPosts && i < jsonPostCount; i++){
                var articleLink = data[i].link;
                var articleTitle = data[i].title;
                var publication = data[i].publication; // Appears on in-the-news feed
                if(!publication){
                    publication = ""; // If the publication value key is undefined
                }
                else{
                    publication = "| " + publication; // If the publication exists
                }
                output += "<li style='margin-bottom: 0.8rem;'><a href=\"" + articleLink + "\">" + articleTitle + "</a>" + publication + "</li>\n"; 
            }
            output += "</ul>\n";
            // Replace the innerHTML of the id provided by the function call
            // Displays the results
            document.getElementById(divId).innerHTML = output;
        });
}

/*  handleJSON()
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

                // Ensures the last post takes up the rest of the row
                if(postsLeft == 1){
                    output += printPost(data.posts[postIndex], postIndex, layout_auto);
                }
                // Creates the larger right most column on even rows
                else if(j == 2 && i%2 == 0){
                    output += printPost(data.posts[postIndex], postIndex, layout_lg_6);
                }
                // Creates the larger left most column on odd rows
                else if(j == 0 && i%2 == 1){
                    output += printPost(data.posts[postIndex], postIndex, layout_lg_6);
                }
                // Default case
                else{
                    output += printPost(data.posts[postIndex], postIndex, layout_lg_3);
                }
                // Decrement to take number of posts left
                postsLeft--;
                console.log(postsLeft);
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