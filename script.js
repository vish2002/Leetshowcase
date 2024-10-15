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
            throw new Error("Error fetching profile");
        }
        const profileData = await response.json();

        const statsHtml = `
            <li><span>Total Solved: </span>${profileData.totalSolved}</li>
            <li><span>Acceptance Rate: </span>${profileData.acceptanceRate}</li>
            <li><span>Reputation: </span>${profileData.reputation}</li>
        `;

        statsList.innerHTML = statsHtml;

        profileCard.style.display = "block"; // Show profile card

    } catch (error) {
        alert("Error fetching profile stats.");
    }
}

// Restore the username from local storage if available
window.onload = function () {
    const storedUsername = localStorage.getItem("leetcodeUsername");
    if (storedUsername) {
        document.getElementById("username-input").value = storedUsername;
    }
};
