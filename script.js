
let username = "";

// Selecting elements for progress circles and labels
const easyProgressCircle = document.querySelector(".easy-progress");
const mediumProgressCircle = document.querySelector(".medium-progress");
const hardProgressCircle = document.querySelector(".hard-progress");

const easyLabel = document.getElementById("easy-label");
const mediumLabel = document.getElementById("medium-label");
const hardLabel = document.getElementById("hard-label");

// Dark Mode Toggle
const darkModeToggle = document.getElementById("dark-mode-toggle");
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

const isDarkMode = document.body.classList.toggle('dark-mode');

// Show spinner while fetching data
function showLoadingSpinner(show) {
  const spinner = document.getElementById("loading-spinner");
  spinner.style.display = show ? "block" : "none";
}

// Function to update progress circles
function updateProgress(solved, total, label, circle) {
  const progressDegree = (solved / total) * 100;
  circle.style.setProperty("--progress-degree", `${progressDegree}%`);
  label.textContent = `${solved}/${total}`;
}

// Function to display stats (called when fetching user profile data)

async function displayPersonalInfo(username) {
  const personaldetails = `https://alfa-leetcode-api.onrender.com/${username}`;
  const statsList = document.getElementById("statsList");
  const profileCard = document.getElementById("profile-card");
  const profileImage = document.getElementById("profile-image");
  const socialsCard = document.getElementById("socialstatsList");

  try {
    const response = await fetch(personaldetails);
    if (!response.ok) {
      throw new Error("User not found or API error");
    }
    const data = await response.json();
    profileCard.style.display = "block";
    document.querySelector(".socials").style.display = "block";

    if (profileImage) {
      profileImage.src = data.avatar;
    }

    // Iterate over the keys of the data object
    Object.keys(data).forEach((key) => {
      // Skip avatar and any key with an empty array or null
      if (
        key === "avatar" || key === "username" ||
        (Array.isArray(data[key]) && data[key].length === 0) ||
        data[key] == null || data[key] == ""
      ) {
        return;
      }

      const li = document.createElement("li");

      // If the value is a URL (social links), create a clickable link
      if (
        key === "gitHub" ||
        key === "twitter" ||
        key === "linkedIN" ||
        key === "website"
      ) {
        const newLink = document.createElement('a');
        const newImg = document.createElement('img');

        // Switch case for different social media platforms
        switch (key) {
          case "gitHub":
            newImg.src = "assets/github.png";
            newImg.alt = "GitHub Profile";
            break;
          case "twitter":
            newImg.src = "assets/twitter.png";
            newImg.alt = "Twitter Profile";
            break;
          case "linkedIN":
            newImg.src = "assets/linkedin.png";
            newImg.alt = "LinkedIn Profile";
            break;
          case "website":
            newLink.textContent = "Visit Website"; 
            break;
        }

        // Set common properties
        newLink.href = `${data[key]}`;
        newLink.target = "_blank"; // Open link in new tab

        newLink.appendChild(newImg); // Append the image to the link
        if (socialsCard) {
          socialsCard.appendChild(newLink); // Append link to socialsCard
        }
      } else {
        // Otherwise, just display the key-value pair
        li.innerHTML = `<span>${key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}:</span> ${data[key]}`;
        statsList.appendChild(li);
      }
    });
  } catch (error) {
    alert(
      "Error fetching profile info. Please check the username and try again."
    );
  }
}



async function displayStats(username) {
  const profileUrl = `https://alfa-leetcode-api.onrender.com/userProfile/${username}`;
  const statsList = document.getElementById("statsList");
  statsList.innerHTML = ""; // Clear previous stats
  const profileCard = document.getElementById("profile-card");

  try {
    await displayPersonalInfo(username);
    const response = await fetch(profileUrl);
    if (!response.ok) {
      throw new Error("User not found or API error");
    }

    const data = await response.json();
    document.querySelector(".circlecard").style.display = "block"; // Show the profile card

    const easyQuestionsCount = data.totalEasy;
    const mediumQuestionsCount = data.totalMedium;
    const hardQuestionsCount = data.totalHard;

    const solvedEasyQuestionsCount = data.easySolved;
    const solvedMediumQuestionsCount = data.mediumSolved;
    const solvedHardQuestionsCount = data.hardSolved;
    updateProgress(
      solvedEasyQuestionsCount,
      easyQuestionsCount,
      easyLabel,
      easyProgressCircle
    );
    updateProgress(
      solvedMediumQuestionsCount,
      mediumQuestionsCount,
      mediumLabel,
      mediumProgressCircle
    );
    updateProgress(
      solvedHardQuestionsCount,
      hardQuestionsCount,
      hardLabel,
      hardProgressCircle
    );

    await displayBadges(username);
  } catch (error) {
    alert("Error fetching profile. Please check the username and try again.");
  }
}

// Function to display badges
async function displayBadges(username) {
  username = document.getElementById("username-input").value.trim();
  if (!username) {
    alert("Please enter a username");
    return;
  }

  // Save username to local storage
  localStorage.setItem("leetcodeUsername", username);

  const badgesUrl = `https://alfa-leetcode-api.onrender.com/${username}/badges`;

  showLoadingSpinner(true); // Show spinner

  // Fetch badges
  try {
    const response = await fetch(badgesUrl);
    if (!response.ok) {
      throw new Error("User not found or API error");
    }
    const badgeData = await response.json();

    // Display badge container heading
    const badgeHeadElement = document.querySelector(".badge-head");
    badgeHeadElement.textContent = "Your Badges";
    badgeHeadElement.style.display = "block"; // Make the heading visible

    // Display badges count
    const badgeCountElement = document.getElementById("badge-count");
    badgeCountElement.textContent = `Total Badges: ${badgeData.badgesCount}`;

    let badgesHTML = "";
    badgeData.badges.forEach((badge) => {
      const iconUrl = badge.icon;
      let fullUrl = iconUrl.startsWith("https")
        ? iconUrl
        : `https://assets.leetcode.com/static_assets/public/${iconUrl.replace(
            "/static/",
            ""
          )}`;

      badgesHTML += `
                <div class="badge">
                    <img src="${fullUrl}" alt="${badge.displayName}">
                    <p><strong>${badge.displayName}</strong></p>
                    <p>${badge.creationDate}</p>
                </div>`;
    });

    const badgeContainer = document.getElementById("badges");
    badgeContainer.innerHTML = badgesHTML;
  } catch (error) {
    alert("Error fetching badges. Please check the username and try again.");
  } finally {
    showLoadingSpinner(false); // Hide spinner
  }
}

// Load the last username from localStorage
const lastUsername = localStorage.getItem("leetcodeUsername");
if (lastUsername) {
  document.getElementById("username-input").value = lastUsername;
}

// Add event listener to the button
document.getElementById("fetch-badges").addEventListener("click", async () => {
  const username = document.getElementById("username-input").value.trim();
  if (!username) {
    alert("Please enter a username");
    return;
  }
  await displayStats(username);
});
