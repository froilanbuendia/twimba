import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.dataset.replyBack) {
    handleReplyBack(e.target.dataset.replyBack);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.deleteTweet) {
    handleDeleteTweet(e.target.dataset.deleteTweet);
  }
  console.log(e.target.dataset);
});

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleReplyBack(replyId) {
  const replyContainer = document.getElementById(`replies-${replyId}`);
  const replyText = replyContainer.querySelector(".reply-textarea");

  const targetTweetObj = tweetsData.find((tweet) => tweet.uuid === replyId);

  if (replyText && replyText.value) {
    targetTweetObj.replies.push({
      handle: "@Scrimba",
      profilePic: "images/scrimbalogo.png",
      tweetText: replyText.value,
    });
    render();
  }
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    render();
    tweetInput.value = "";
  }
}

function handleDeleteTweet(tweetId) {
  const indexToRemove = tweetsData.findIndex((tweet) => tweet.uuid === tweetId);

  if (indexToRemove !== -1) {
    tweetsData.splice(indexToRemove, 1);
  }
  console.log(tweetsData);
  render();
}

function getFeedHtml() {
  let feedHtml = ``;

  tweetsData.forEach(function (tweet) {
    let likeIconClass = "";

    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    let retweetIconClass = "";

    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let repliesHtml = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
        <div class="tweet-reply">
            <div class="tweet-inner">
                <img src="${reply.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${reply.handle}</p>
                        <p class="tweet-text">${reply.tweetText}</p>
                    </div>
                </div>
        </div>
`;
      });
    }
    let deleteTweetHtml = "";
    if (tweet.handle === "@Scrimba") {
      deleteTweetHtml += `
          <div id='delete-tweet-${tweet.handle}'>
          <i class="fa-regular fa-circle-xmark" data-delete-tweet='${tweet.uuid}'></i>
        </div>`;
    }

    feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>    
          ${deleteTweetHtml}
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
        <div class='reply-btn-container'>
            <textarea class='reply-textarea' placeholder='Reply to ${tweet.handle}'></textarea>
            <button class='reply-btn' data-reply-back="${tweet.uuid}">Reply</button>
        </div>
    </div>   
</div>
`;
  });

  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();
