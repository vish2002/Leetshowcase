let username = ""; // Change const to let

// Dark Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Show spinner while fetching data
function showLoadingSpinner(show) {
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = show ? 'block' : 'none';
}

document.getElementById("fetch-badges").addEventListener("click", async () => {
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
        const badgeHeadElement = document.querySelector('.badge-head');
        badgeHeadElement.textContent = 'Your Badges';
        badgeHeadElement.style.display = 'block'; // Make the heading visible

        // Display badges count
        const badgeCountElement = document.getElementById("badge-count");
        badgeCountElement.textContent = `Total Badges: ${badgeData.badgesCount}`;

        let badgesHTML = "";
        badgeData.badges.forEach((badge) => {
            const iconUrl = badge.icon;
            let fullUrl = iconUrl.startsWith("https")
                ? iconUrl
                : `https://assets.leetcode.com/static_assets/public/${iconUrl.replace("/static/", "")}`;

            badgesHTML += `
                <div class="badge">
                    <img src="${fullUrl}" alt="${badge.displayName}">
                    <p><strong>${badge.displayName}</strong></p>
                    <p>${badge.creationDate}</p>
                </div>`;
        });

        const badgeContainer = document.getElementById("badges");
        badgeContainer.innerHTML = badgesHTML;

        // Fetch profile stats after badges
        await displayStats(username); // Pass username to displayStats

    } catch (error) {
        alert("Error fetching badges. Please check the username and try again.");
    } finally {
        showLoadingSpinner(false); // Hide spinner
    }
});

async function displayStats(username) {
    const profileUrl = `https://alfa-leetcode-api.onrender.com/userProfile/${username}`;
    const statsList = document.getElementById('statsList');
    statsList.innerHTML = ''; // Clear previous stats
    const profileCard = document.getElementById("profile-card");

    try {
        const response = await fetch(profileUrl);
        if (!response.ok) {
            throw new Error("User not found or API error");
        }

        const data = await response.json();
        profileCard.style.display = 'block'; // Show the profile card

        const totalSolved = document.createElement('li');
        totalSolved.innerHTML = `<span>Total Problems Solved:</span> ${data.totalSolved}`;
        statsList.appendChild(totalSolved);

        const easySolved = document.createElement('li');
        easySolved.innerHTML = `<span>Easy Problems Solved:</span> ${data.easySolved}`;
        statsList.appendChild(easySolved);

        const mediumSolved = document.createElement('li');
        mediumSolved.innerHTML = `<span>Medium Problems Solved:</span> ${data.mediumSolved}`;
        statsList.appendChild(mediumSolved);

        const hardSolved = document.createElement('li');
        hardSolved.innerHTML = `<span>Hard Problems Solved:</span> ${data.hardSolved}`;
        statsList.appendChild(hardSolved);

    } catch (error) {
        alert("Error fetching profile. Please check the username and try again.");
    }
}

// Load the last username from localStorage
const lastUsername = localStorage.getItem("leetcodeUsername");
if (lastUsername) {
    document.getElementById("username-input").value = lastUsername;
}
