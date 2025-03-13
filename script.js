const APIURL = "https://api.github.com/users/";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

async function getUser(username) {
  try {
    const formattedUsername = username.trim().replace(/\s+/g, "");
    const res = await superagent.get(APIURL + formattedUsername);

    createUserCard(res.body);
    getRepos(formattedUsername);
  } catch (err) {
    console.error("Error fetching user:", err);
    main.innerHTML = `<p style="color: red;">User not found. Please try again.</p>`;
  }
}

async function getRepos(username) {
  try {
    const res = await superagent.get(`${APIURL}${username}/repos`);

    addRepoToCard(res.body);
  } catch (err) {
    console.error("Error fetching repos:", err);
  }
}

function createUserCard(user) {
  const cardHTML = `<div class="card">
        <div>
          <img
            src="${user.avatar_url}" 
            alt="${user.name}"
            class="avatar"
          />
        </div>
        <div class="user-info">
          <h2>${user.name || "No Name Available"}</h2>
          <p>${user.bio || "No bio available."}</p>
          <ul>
            <li>${user.followers} <strong>Followers</strong></li>
            <li>${user.following} <strong>Following</strong></li>
            <li>${user.public_repos} <strong>Repos</strong></li>
          </ul>

          <div class="repo" id="repos"></div>
        </div>
      </div>`;

  main.innerHTML = cardHTML;
}

function addRepoToCard(repos) {
  const reposEl = document.getElementById("repos");

  repos.slice(0, 10).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;

    reposEl.appendChild(repoEl);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = search.value.trim();
  if (user) {
    getUser(user);
    search.value = "";
  }
});
