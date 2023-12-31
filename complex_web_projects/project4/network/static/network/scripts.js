
document.addEventListener('DOMContentLoaded', function () {

    const csrf_token = CSRF_TOKEN;

    console.log("CSRF_TOKEN");
    console.log(csrf_token);

    const new_post_form = document.querySelector('#new-post-form');

    document.querySelector('#following-nav-link')
        .addEventListener('click', (event) => load_followings());

    if(new_post_form !== null)
    {
        new_post_form.addEventListener('submit', (event) => new_post(event, csrf_token));
    }

    document.querySelector('#posts')
        .addEventListener('click', (event) => click_handler(event, csrf_token));

    document.querySelector('#posts').style.display = 'block';

    load_posts(true);

});

function click_handler(event, csrf_token) {

    event.preventDefault();

    // KEEP HERE!
    console.log("event.target");
    console.log(event.target);
    console.log(event.target.parentNode.class);

    if(event.target.className === 'user-name-link' || event.target.parentNode.class === 'user-name-link')
    {
        event.preventDefault();
        console.log('href:');
        console.log(event.target.parentNode.innerText);

        load_posts(false, event);
    }

    if(event.target.form !== null && event.target.form !== undefined)
    {
        if(event.target.form.className === 'new-follower-form')
        {
            follow_unfollow(event, csrf_token, true);
        } else if(event.target.form.className === 'unfollow-form') {
            follow_unfollow(event, csrf_token, false);
        }

        if(event.target.form.className === 'new-like-form')
        {
            like_dislike(event, csrf_token, true);
        } else if(event.target.form.className === 'dislike-form') {
            like_dislike(event, csrf_token, false);
        }

        if(event.target.className.includes('edit-button'))
        {
            event.preventDefault();

            console.log("Edit button clicked!");
            console.log("clicked target:");
            console.log(event.target);

            event.target.style.display = 'block';

            const current_paragraph_content = event.target.form.post_text.value;

            console.log(`current_paragraph_content: ${current_paragraph_content}`);
            console.log(current_paragraph_content);

            const post_detail_div = event.target.parentNode.parentNode
                .querySelector('.post-text-wrapper');
            console.log(`post_detail_div: ${post_detail_div}`);
            console.log(post_detail_div);
            // Remove all child nodes from the post_detail_div
            while (post_detail_div.firstChild) {
                if(post_detail_div !== null)
                {
                    post_detail_div.removeChild(post_detail_div.firstChild);
                }
            }

            const new_textarea = document.createElement('textarea');
            new_textarea.className = 'form-control';
            new_textarea.rows = 3;
            new_textarea.value = current_paragraph_content;
            new_textarea.name = 'edited_post_text';

            const save_edits_form = document.createElement('form');
            save_edits_form.className ='save-edits-form';
            save_edits_form.method = 'PUT';
            save_edits_form.action = '/edit-post';

            const post_edits_post_id = create_hidden_element(event.target.form.post_id.value);

            const save_edits_button = document.createElement('input');
            save_edits_button.className = 'save-edits-button';
            save_edits_button.type ='submit';
            save_edits_button.value = 'Save';

            save_edits_form.appendChild(new_textarea);
            save_edits_form.appendChild(post_edits_post_id);
            save_edits_form.appendChild(save_edits_button);

            post_detail_div.appendChild(save_edits_form)

        }

        if(event.target.className === 'save-edits-button')
        {
            event.preventDefault();
            console.log("event.target:");
            console.log(event.target);

            // Fetch the /edit-post API with PUT method to update the post
            fetch('/edit-post', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf_token
                },
                body: JSON.stringify({
                    'post_id': event.target.form.post_id.value,
                    'edited_post_text': event.target.form.edited_post_text.value
                })
            })
              .then(response => {
                    if(response.status === 201) {
                        response.json()
                          .then(result => {

                                console.log("Loading posts...");
                                load_posts(true);

                            });
                    } else {
                        console.error("Failed to get successful status from the API request");
                    }
                })
              .catch(error => {
                    console.error(error);
                });

        }
    }

    if(event.target.className === 'new-comment-button')
    {
        event.preventDefault();

        console.log("Comment button clicked!");
        console.log("clicked target:");
        console.log(event.target.nextSibling);

        event.target.nextSibling.style.display = 'block';
    }



    /*
    if(event.target.className.includes('like-button'))
    {
        event.preventDefault();
        console.log("like-button");

        let like_post_id = event.target.form.post_id.value;
        // TODO: Append the dislike form
        let dislike = event.target.form.dislike.value;
        const like_data = JSON.stringify({
            'post_id': like_post_id,
            'dislike': dislike
        });

        console.log("like_data");
        console.log(like_data);

        fetch('/like-post', {
            method: 'POST',
            body: like_data
        })
            .then(response => {
                if(response.status === 201) {
                    response.json()
                        .then(result => {

                            console.log("Loading posts...");
                            load_posts(true);

                        });
                } else {
                    console.error("Failed to get successful status from the API request");
                }
        })
    }*/
}

function new_post(event, csrf_token) {
    event.preventDefault();

    const post_text = event.target.post_text.value;
    const post_multimedia_link = event.target.post_multimedia_link.value;

    const new_post_data =  JSON.stringify({
        'post_text': post_text,
        'post_multimedia_link': post_multimedia_link
    });

    // Fetch
    fetch('/new-post', {
        method: 'POST',
        body: new_post_data
    })
        .then(response => {
            if(response.status === 201) {
                response.json()
                    .then(result => {

                        console.log("Loading posts...");
                        load_posts(true);

                    });
            } else {
                console.error("Failed to get successful status from the API request");
            }
        })

}

function follow_unfollow(event, csrf_token, follow) {
    event.preventDefault();

    const user_id = event.target.form.user_id.value;

    console.log(`Follow: ${follow}, user_id: ${user_id}`);

    const user_data = JSON.stringify({
        'user_id': user_id
    });

    let api_link;
    if(follow === true)
    {
        api_link = '/follow';
    } else {
        api_link = '/unfollow';
    }

    // Fetch
    fetch(api_link, {
        method: 'POST',
        body: user_data,
        headers: {'X-CSRFToken': csrf_token},
        mode: 'same-origin' // Do not send CSRF token to another domain.
    })
        .then(response => {
            if(response.status === 201) {
                response.json()
                    .then(result => {
                        console.log("Loading posts...");
                        load_posts(true);
                    });
            } else {
                console.error("Failed to get successful status from the API request");
            }
        })
}

function like_dislike(event, csrf_token, dislike) {
    event.preventDefault();

    const post_id = event.target.form.post_id.value;
    const like_dislike = event.target.form.like_dislike.value;

    console.log(`Dislike: ${dislike}, user_id: ${post_id}`);

    const post_data = JSON.stringify({
        'post_id': post_id,
        'like_dislike': like_dislike
    });

    // Fetch
    fetch('/like-post', {
        method: 'POST',
        body: post_data,
        headers: {'X-CSRFToken': csrf_token},
        mode: 'same-origin' // Do not send CSRF token to another domain.
    })
        .then(response => {
            if(response.status === 201) {
                response.json()
                    .then(result => {
                        console.log("Loading posts...");
                        load_posts(true);
                    });
            } else {
                console.error("Failed to get successful status from the API request");
            }
        })
}

function isEmpty(str) {
    return (!str || str.length === 0 );
}

function load_posts(all=true, event=null) {

    let user_name;
    if(event !== null)
    {
        user_name = event.target.parentNode.innerText;
    }

    let loaded_posts_promise;
    if(all === false)
    {
        loaded_posts_promise = fetch_posts_api(all, user_name);
    } else
    {
        loaded_posts_promise = fetch_posts_api(all);
    }

    const posts_section_selector = document.querySelector('#posts');

    // Clearing the previous content to fully load posts again.
    posts_section_selector.innerText = '';

    let following, liked_posts;

    // Getting from Django
    const logged_user_name = document.getElementById('user_name');
    const logged_in_user_name = JSON.parse(logged_user_name.textContent);

    if(logged_in_user_name !== null)
    {
        if(!isEmpty(logged_in_user_name))
        {
            following = get_following_users();
            liked_posts = get_liked_posts();
        }
    }

    let num_of_follows;

    loaded_posts_promise.then(loaded_posts => {

        console.log("loaded_posts:");
        console.log(loaded_posts);

        // NOTICE: This canẗ be defined in the if block, otherwise it is undefined !!!!
        num_of_follows = loaded_posts.num_of_followers;

        if(all === false)
        {
            loaded_posts = loaded_posts.user_posts;

            console.log("loaded_posts.num_of_followers:");
            console.log("HERE"); // This outputs: HERE
        } else {
            num_of_follows = null;
        }
        console.log("loaded_posts:");
        console.log(loaded_posts);

        console.log("num_of_followers");
        console.log(num_of_follows); // This outputs: undefined

        function append_post(loaded_post) {
            // const logged_user_id = parseInt({{ request.user.id }})

            const post_div = document.createElement('div');
            post_div.className = 'post-detail';
            post_div.className += " " + "container";

            document.querySelector('#posts').style.display = 'block';

            const user_name_link = document.createElement('a');
            user_name_link.href = `user-posts/${loaded_post.user_name}`;
            user_name_link.class = 'user-name-link';

            const user_name_element = document.createElement('h4');
            user_name_element.innerText = loaded_post.user_name;

            user_name_link.appendChild(user_name_element);

            post_div.appendChild(user_name_link);

            let include_follow_unfollow_form = false;
            let include_like_dislike_form = false;
            let user_logged = false;

            let already_following = false;

            const post_text = document.createElement('p');
            post_text.innerText = loaded_post.text;
            post_text.className = 'post-text';

            const post_detail_div = document.createElement('div');
            post_detail_div.className = 'post-text-wrapper';
            post_detail_div.appendChild(post_text);

            const post_date = document.createElement('p');
            post_date.className = 'datetime';
            post_date.innerText = loaded_post.created_at;

            if (logged_in_user_name !== null) {

                if (isEmpty(logged_in_user_name)) {
                    include_follow_unfollow_form = false;
                    include_like_dislike_form = false;
                    user_logged = false;
                } else {
                    console.log("User names:");
                    console.log(loaded_post.user_name);
                    console.log(logged_in_user_name);

                    if (loaded_post.user_name === logged_in_user_name) {
                        console.log("User names are equal.");
                        include_follow_unfollow_form = false;
                        include_like_dislike_form = false;
                        console.log("No user logged in.");
                        user_logged = true;

                    } else {
                        console.log("User names are not equal.");
                        include_follow_unfollow_form = true;
                        user_logged = true;
                    }
                }
            } else {
                include_follow_unfollow_form = false;
                include_like_dislike_form = false;
                console.error("Was unable to get id of an logged in user.");
                user_logged = false;
            }

            if (following === null || following === undefined) {
                console.log("No followers found.");
            } else {
                following
                    .then(following => {
                        if (following.includes(loaded_post.user_name)) {
                            console.log("User already followed.");
                            console.log("Post user:");
                            console.log(loaded_post.user_name);
                            console.log("Logged user is following:");
                            console.log(following);
                            already_following = true;
                            include_follow_unfollow_form = true;
                        }
                        console.log("Following:");
                        console.log(following);

                        let follow_form;
                        if (include_follow_unfollow_form === true) {
                            console.log(`include_follow_unfollow_form: ${include_follow_unfollow_form}`);
                            if (already_following === true) {
                                follow_form = create_follow_unfollow_form("Unfollow", loaded_post.user_id);
                            } else {
                                follow_form = create_follow_unfollow_form("Follow", loaded_post.user_id);
                            }
                            post_div.appendChild(follow_form);

                        }
                        post_div.appendChild(post_date);

                        const edit_button = document.createElement('input');

                        if(logged_in_user_name === loaded_post.user_name)
                        {
                            edit_button.className = 'edit-button';
                            edit_button.value = 'Edit';
                            edit_button.type = 'submit';
                            edit_button.className += " " + "btn btn-primary mt-3 mb-3";
                        }

                        const input_hidden_post_id = create_hidden_element(loaded_post.id);
                        const input_hidden_post_text = create_hidden_element(loaded_post.text, 'post_text');

                        const edit_post_form = document.createElement('form');
                        edit_post_form.method = 'GET';
                        edit_post_form.action = '/';
                        edit_post_form.className = 'display-edit-post-form';

                        edit_post_form.appendChild(input_hidden_post_id);
                        edit_post_form.appendChild(input_hidden_post_text);

                        console.log(`logged_in_user_name: ${logged_in_user_name}`);
                        console.log(`loaded_post.user_name: ${loaded_post.user_name}`);

                        if(logged_in_user_name === loaded_post.user_name)
                        {
                            edit_post_form.appendChild(edit_button);
                        }

                        post_div.appendChild(edit_post_form);
                        post_div.appendChild(post_detail_div);

                        if (liked_posts === null || liked_posts === undefined) {
                            console.log("No followers found.");
                        } else {
                            liked_posts
                                .then(liked_posts => {
                                    console.log(`Liked posts includes this post id: ${liked_posts.includes(loaded_post.id)}`);
                                    let like_dislike_form;
                                    if (liked_posts.includes(loaded_post.id)) {
                                        console.log("Post already liked.");
                                        console.log("Post id:");
                                        console.log(loaded_post.id);
                                        console.log("Logged user is liked:");
                                        console.log(liked_posts);
                                        like_dislike_form = create_like_dislike_form(loaded_post.id, "Dislike");
                                        post_div.appendChild(like_dislike_form);
                                    } else {
                                        like_dislike_form = create_like_dislike_form(loaded_post.id, "Like");
                                        post_div.appendChild(like_dislike_form);
                                    }

                                    console.log("Following:");
                                    console.log(following);

                                    console.log(`include_like_dislike_form_form: ${include_like_dislike_form}`);

                                    const num_of_likes_section = document.createElement('div');
                                    num_of_likes_section.innerText = "Likes: " + loaded_post.num_of_likes;

                                    post_div.appendChild(num_of_likes_section);

                                    const comment_section = document.createElement('div');
                                    comment_section.className = 'comment-section';
                                    comment_section.style.display = 'block';

                                    console.log("Loading comments...");
                                    const comments_promise = fetch_comments(loaded_post.id);

                                    comments_promise
                                        .then(comments => {

                                            function append_comments(comment) {

                                                const comment_div = document.createElement('div');
                                                comment_div.className = 'comment container';
                                                comment_div.className += " " + "mt-3 mb-3";

                                                console.log(`comment.datetime: ${comment.datetime}`);

                                                const comment_datetime_div = document.createElement('div');
                                                comment_datetime_div.className = 'comment-datetime';
                                                comment_datetime_div.innerText = comment.datetime;
                                                comment_datetime_div.className += " " + "datetime";

                                                const comment_user_name_div = document.createElement('div');
                                                comment_user_name_div.className = 'comment-username';
                                                comment_user_name_div.innerText = comment.user;

                                                const comment_text_div = document.createElement('div');
                                                comment_text_div.className = 'comment-text';
                                                comment_text_div.innerText = comment.text;

                                                comment_div.append(comment_datetime_div, comment_user_name_div, comment_text_div);

                                                comment_section.appendChild(comment_div);
                                            }

                                            comments.forEach(append_comments);
                                        })

                                    post_div.appendChild(comment_section);

                                    if (user_logged === true) {
                                        const comment_form = create_comment_form(loaded_post);

                                        const new_comment_button = document.createElement('button');
                                        new_comment_button.className = 'new-comment-button';
                                        new_comment_button.innerText = 'Comment';

                                        post_div.appendChild(new_comment_button);

                                        post_div.appendChild(comment_form);
                                    }
                                })
                        }
                        console.log("post_div");
                        console.log(post_div);

                        const posts_list = document.querySelector('#posts-list');
                        posts_list.appendChild(post_div);

                        posts_section_selector.appendChild(posts_list);
                    })
            }
        }

        if(loaded_posts.length > 0)
        {
            const posts_section_headline = document.createElement('h3');

            let num_of_followers_section;
            if(all === true)
            {
                posts_section_headline.innerText = "What's new...";
            } else {
                posts_section_headline.innerText = user_name;
                num_of_followers_section = document.createElement('div');
                num_of_followers_section.innerText = `Num of follows: ${num_of_follows}`;
            }

            const posts_section_heading_div = document.createElement('div');
            posts_section_heading_div.className = 'container';

            posts_section_heading_div.appendChild(posts_section_headline);

            if (all === false)
            {
                if(num_of_followers_section !== undefined)
                {
                    posts_section_heading_div.appendChild(num_of_followers_section);
                }
            }

            posts_section_selector.appendChild(posts_section_heading_div);

            const posts_section_list = document.createElement('div');
            posts_section_list.id = 'posts-list';
            posts_section_list.className = 'row';

            posts_section_selector.appendChild(posts_section_list);

            console.log("Loaded e-mails found");
            loaded_posts.forEach(append_post);
        } else {
            console.error("No posts loaded from API.");
        }
    }).catch(error => {
        console.error("An error occurred: ", error);
    });
}

function load_followings() {

    const posts_section = document.getElementById('posts');

    function append_following_user(user_name)
    {
        console.log("user_name (following):");
        console.log(user_name);

        const following_user_div = document.createElement('div');
        following_user_div.className = 'container';
        following_user_div.innerText = user_name;

        posts_section.append(following_user_div);
    }

    document.getElementById('page-title').innerText = "Following";

    posts_section.innerText = '';

    const followings_promise = get_following_users();

    followings_promise.then(following => {
        console.log("following:");
        console.log(following);

        following.forEach(append_following_user);
    })

}

function get_following_users()
{
    const loaded_following_promise = fetch_following();

    return loaded_following_promise.then(
        loaded_followers => {
          return loaded_followers.following;
        }
    )
}

function get_liked_posts()
{
    const load_liked_promise = fetch_liked();

    return load_liked_promise.then(
        loaded_liked_posts => {
            return loaded_liked_posts.liked_posts_ids;
        }
    )

}

function fetch_posts_api(all=true, user_name=null)
{
    let link;
    if(all === true)
    {
        link = '/all-posts';
    } else {
        if (user_name !== null)
        {
            link = `/user-posts/${user_name}`;
        }
        else
        {
            link = '/all-posts';
        }
    }

    return fetch(link, {method: 'GET'})
        .then(response => response.json())
        .then(posts => {
            return posts;
        })
}

function fetch_following()
{
    return fetch('/following', {method: 'GET'})
        .then(response => response.json())
        .then(data => {
            return data;
        })
}


function fetch_liked()
{
    return fetch('/liked-posts', {method: 'GET'})
        .then(response => response.json())
        .then(data => {
            return data;
        })
}

function fetch_comments(post_id)
{
    console.log("Fetching comment for post:");
    console.log(post_id);
    return fetch(`/comments-for-post/${post_id}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
        console.log("Comment response data:");
        console.log(data);
        return data;
    })
}


function create_follow_unfollow_form(submit_text, user_id)
{
    const follow_form = document.createElement('form');

    if(submit_text === "Follow")
        follow_form.className = 'new-follower-form';
    else if(submit_text === "Unfollow")
        follow_form.className = 'unfollow-form';
    else
        console.error("Unexpected stat eof the submit_text variable.");

    follow_form.method = 'POST';

    const user_id_hidden = document.createElement('input');
    user_id_hidden.type = 'hidden';
    user_id_hidden.name = 'user_id';
    user_id_hidden.value =  user_id;

    const follow_user_form_submit = document.createElement('input');
    follow_user_form_submit.type = 'submit';
    follow_user_form_submit.value = submit_text;
    follow_form.append(user_id_hidden, follow_user_form_submit);

    const follow_div = document.createElement('div');
    follow_div.className = 'follow-div';

    follow_div.appendChild(follow_form);

    return follow_div;
}

function create_comment_form(loaded_post)
{
    // Not be visible by default

    const new_comment_form = document.createElement('form');
    new_comment_form.method = 'PUT';
    new_comment_form.className = 'new-comment-form';

    const comment_text = document.createElement('textarea');
    comment_text.className = 'form-control';
    comment_text.rows = 3;
    comment_text.name = 'new_comment_text';

    const new_comment_form_input = create_hidden_element(loaded_post.id);

    const submit_comment_button = document.createElement('input');
    submit_comment_button.type = 'submit';
    submit_comment_button.value = 'Send';
    submit_comment_button.className = 'send-comment-button';

    new_comment_form.append(comment_text, new_comment_form_input, submit_comment_button);

    new_comment_form.style.display = "none";

    return new_comment_form;
}

function create_like_dislike_form(post_id, submit_text)
{

    const like_form = document.createElement('form');
    like_form.method = 'POST';
    like_form.action = '/like-post';

    const like_dislike_input = document.createElement('input');
    like_dislike_input.type = 'hidden';
    like_dislike_input.name = 'like_dislike';

    if(submit_text === "Like")
    {
        like_form.className = 'new-like-form';
        like_dislike_input.value = 'like';
    }
    else if(submit_text === "Dislike")
    {
        like_form.className = 'dislike-form';
        like_dislike_input.value = 'dislike';
    } else {
        console.error("Unexpected stat eof the submit_text variable.");
    }

    const like_button = document.createElement('input');
    like_button.value = submit_text;
    like_button.className = 'like-button';
    like_button.className += " " + "btn btn-primary";
    like_button.type = 'submit';

    like_form.appendChild(like_button);

    const input_hidden_post_id = create_hidden_element(post_id);

    like_form.appendChild(input_hidden_post_id);
    like_form.appendChild(like_dislike_input);

    return like_form;
}


function create_hidden_element(value, name='post_id')
{
    const post_edits_post_id = document.createElement('input');
    post_edits_post_id.type = 'hidden';
    post_edits_post_id.name = name;
    post_edits_post_id.value = value;

    return post_edits_post_id;
}
