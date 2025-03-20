const URL = "https://api.freeapi.app/api/v1/public/youtube/videos";

let videoGrid = document.querySelector(".video-grid");
let searchInput = document.querySelector("#search-input");

// Event listener to filter videos based on search input
searchInput.addEventListener("input", function () {
  let query = this.value.toLowerCase();
  let videoCards = document.querySelectorAll(".video-card");

  videoCards.forEach((video) => {
    let title = video.querySelector(".video-title").innerText.toLowerCase();
    video.style.display = title.includes(query) ? "block" : "none";
  });
});

// Function to fetch video information from the API
let getVideoInfo = async (URL) => {
  try {
    let response = await fetch(URL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    let data = await response.json();

    data.data.data.forEach((elem) => {
      let videoTitle = elem.items.snippet.title;
      let thumbnailSrc = elem.items.snippet.thumbnails.maxres.url;
      let channelTitle = elem.items.snippet.channelTitle;
      let viewCount = elem.items.statistics.viewCount;
      let publishedAt = elem.items.snippet.publishedAt;
      let videoId = elem.items.id;

      let videoCard = document.createElement("div");
      videoCard.classList.add("video-card");
      videoCard.addEventListener("click", () => {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
      });

      let thumbnail = document.createElement("img");
      thumbnail.classList.add("thumbnail");
      thumbnail.src = thumbnailSrc;

      let videoInfo = document.createElement("div");
      videoInfo.classList.add("video-info");

      let videoTitles = document.createElement("div");
      videoTitles.classList.add("video-title");
      videoTitles.innerText = videoTitle;

      let videoMeta = document.createElement("div");
      videoMeta.classList.add("video-meta");

      let channelAvatar = document.createElement("div");
      let channelAvatarImg = document.createElement("img");
      channelAvatarImg.classList.add("channel-avatar-img");
      channelAvatarImg.src =
        "https://yt3.googleusercontent.com/arHIKjc6JTqF_b4QJKPHhQC_Jr8q0XfI7LEpJ0-VuiI0ZRz9xFNz94TWl4CLOcozLx-iAhV_=s160-c-k-c0x00ffffff-no-rj";
      channelAvatar.appendChild(channelAvatarImg);

      let channelName = document.createElement("div");
      channelName.classList.add("channel-name");
      channelName.innerText = channelTitle;

      videoMeta.appendChild(channelAvatar);
      videoMeta.appendChild(channelName);

      let videoStats = document.createElement("div");
      videoStats.classList.add("video-stats");

      let viewSpan = document.createElement("span");
      viewSpan.innerText = formatViews(viewCount);

      let daySpan = document.createElement("span");
      daySpan.innerText = timeAgo(publishedAt);

      videoStats.appendChild(viewSpan);
      videoStats.appendChild(daySpan);

      // Appending properties to video cards
      videoCard.appendChild(thumbnail);
      videoCard.appendChild(videoTitles);
      videoCard.appendChild(videoMeta);
      videoCard.appendChild(videoStats);

      videoGrid.appendChild(videoCard);
    });
  } catch (error) {
    console.error("Error fetching video data:", error);
  }
};

getVideoInfo(URL);

// Function to format view count into k, M, etc.
function formatViews(views) {
  if (views >= 1000) {
    return (views / 1000).toFixed(1).replace(".0", "") + "k";
  }
  return views.toString();
}

// Function to calculate how long ago a video was published
function timeAgo(dateString) {
  let date = new Date(dateString);
  let now = new Date();

  let seconds = Math.floor((now - date) / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  let months = Math.floor(days / 30);
  let years = Math.floor(days / 365);

  if (years > 0) return years === 1 ? "1 year ago" : `${years} years ago`;
  if (months > 0) return months === 1 ? "1 month ago" : `${months} months ago`;
  if (days > 0) return days === 1 ? "1 day ago" : `${days} days ago`;
  if (hours > 0) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  if (minutes > 0)
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  return "Just now";
}
