var blogPosts;

function writeBlogPosts() {

    var xhrBlogPosts = new XMLHttpRequest();
    xhrBlogPosts.overrideMimeType("application/json");
    xhrBlogPosts.open('GET', 'https://raw.githubusercontent.com/oskikiboy/TerraBite-Blog-Data/master/data/blog_posts.json');
    xhrBlogPosts.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            try {

                blogPosts = JSON.parse(xhrBlogPosts.responseText);
                loadPosts();

            } catch (err) {
                console.error('Unable to parse blog posts json, Error: ' + err.stack);
            }
        }
    };
    xhrBlogPosts.send();
}

function loadPosts() {
    var parent = document.getElementById('blog_posts_box');

    for (var x = blogPosts.length - 1; x >= 0; x--) {

        var title = blogPosts[x].post_title;
        var author_url = blogPosts[x].author_url;
        var author_username = blogPosts[x].author_username;
        var tag_text = blogPosts[x].tag_text;
        var post_date = blogPosts[x].post_date;
        var post_content = blogPosts[x].post_content;

        let blogPost = document.createElement("div");
        blogPost.setAttribute("class", "box");
        blogPost.setAttribute("style", "color: #363636;");

        let headerInfo = document.createElement("article");
        headerInfo.setAttribute("class", "media");

        let headerFigure = document.createElement("figure");
        headerFigure.setAttribute("class", "media-left");
        let imageBox = document.createElement("p");
        imageBox.setAttribute("class", "image is-64x64");
        let image = document.createElement("img");
        image.setAttribute("src", author_url);
        image.setAttribute("style", "border-radius: 100%;");

        imageBox.appendChild(image);
        headerFigure.appendChild(imageBox);
        headerInfo.appendChild(headerFigure);

        let contentBox = document.createElement("div");
        contentBox.setAttribute("class", "media-content");

        let titleArea = document.createElement("h1");
        titleArea.setAttribute("class", "title");
        titleArea.setAttribute("style", "color: #363636;");
        let titleText = document.createTextNode(title);
        titleArea.appendChild(titleText);

        let spanSpace = document.createTextNode("\u00A0");
        titleArea.appendChild(spanSpace);

        let tagSpan = document.createElement("span");
        tagSpan.setAttribute("class", "tag is-medium is-info");
        let tagText = document.createTextNode(tag_text);
        tagSpan.appendChild(tagText);
        titleArea.appendChild(tagSpan);
        contentBox.appendChild(titleArea);

        let subtitleArea = document.createElement("h2");
        subtitleArea.setAttribute("class", "subtitle");
        subtitleArea.setAttribute("style", "color: #363636;");
        subtitleArea.innerHTML = `By <strong class="color: #363636;">${author_username}</strong>, published: <i>${post_date}</i>`;
        contentBox.appendChild(subtitleArea);

        headerInfo.appendChild(contentBox);
        blogPost.appendChild(headerInfo);

        let breakSpace = document.createElement("br");
        blogPost.appendChild(breakSpace);

        let divContent = document.createElement("div");
        divContent.setAttribute("class", "content");
        let textContent = document.createElement("p");
        textContent.innerHTML = post_content;

        divContent.appendChild(textContent);
        blogPost.appendChild(divContent);
        parent.appendChild(blogPost);

        let space = document.createElement("br");
        parent.appendChild(space);
    }
}

writeBlogPosts();