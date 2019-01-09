const API_ENDPOINT_START = 'http://google-catbook.herokuapp.com';

// GET /api/stories fetches all stories
// GET /api/comment fetches all comments for a story, given the story's id (passed as the 'parent' parameter)

// {
//   _id: "5a53b37189c7bb15141e9e40",
//   creator_name: "Danny Tang", 
//   content: "I don't have any cats now, but this web app has inspired me to adopt 10!"
// }

// Creates an html block for a story
function storyDOMObject(storyJSON) {
  const card = document.createElement('div');
  card.setAttribute('id', storyJSON._id);
  card.className = 'story card';

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  card.appendChild(cardBody);

  const creatorSpan = document.createElement('a');
  creatorSpan.className = 'story-creator card-title';
  creatorSpan.innerHTML = storyJSON.creator_name;
  cardBody.appendChild(creatorSpan);

  const contentSpan = document.createElement('p');
  contentSpan.className = 'story-content card-text';
  contentSpan.innerHTML = storyJSON.content;
  cardBody.appendChild(contentSpan);

  const cardFooter = document.createElement('div');
  cardFooter.className = 'card-footer';
  card.appendChild(cardFooter);

  const commentsDiv = document.createElement('div');
  commentsDiv.setAttribute('id', storyJSON._id + '-comments');
  commentsDiv.className = 'story-comments';
  cardFooter.appendChild(commentsDiv);

  return card;
}

// {
//   _id: "5a53ba14a6078f28283eb9a1",
//   creator_name: "Rupayan Neogy", 
//   parent: "5a53b37189c7bb15141e9e40", 
//   content: "I think a good name is Winston"
// }

// Creates a comment block for a story
function commentDOMObject(commentJSON) {
  const commentDiv = document.createElement('div');
  commentDiv.setAttribute('id', commentJSON._id);
  commentDiv.className = 'comment mb-2';

  const commentCreatorSpan = document.createElement('a');
  commentCreatorSpan.className = 'comment-creator';
  commentCreatorSpan.innerHTML = commentJSON.creator_name;
  commentDiv.appendChild(commentCreatorSpan);

  const commentContentSpan = document.createElement('span');
  commentContentSpan.className = 'comment-content';
  commentContentSpan.innerHTML = ' | ' + commentJSON.content;
  commentDiv.appendChild(commentContentSpan);

  return commentDiv;
}

// Makes API requests and calls helper functions
function renderStories() {
  const storiesDiv = document.getElementById('stories');
  get(API_ENDPOINT_START + '/api/stories', {}, function(storiesArr) {
    for (let i = 0; i < storiesArr.length; i++) {
      const currentStory = storiesArr[i];
      storiesDiv.prepend(storyDOMObject(currentStory));

      get(API_ENDPOINT_START + '/api/comment', { 'parent': currentStory._id }, function(commentsArr) {
        for (let j = 0; j < commentsArr.length; j++) {
          const currentComment = commentsArr[j];
          const commentDiv = document.getElementById(currentComment.parent + '-comments');
          commentDiv.appendChild(commentDOMObject(currentComment));
        }
      });
    }
  });
}
