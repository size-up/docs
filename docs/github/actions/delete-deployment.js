/**
 * Deletes all deployments from a GitHub repository.
 */

/**
 * Configuration.
 */
const TOKEN = ""; // MUST BE `repo_deployments` authorized
const REPO = ""; // e.g. "monorepo"
const USER_OR_ORG = ""; // e.g. "your-name"

/**
 * Constants.
 * @type {string}
 */
const URL = `https://api.github.com/repos/${USER_OR_ORG}/${REPO}/deployments`;
const AUTH_HEADER = `token ${TOKEN}`;

console.log(`Clearing GitHub deployments for [${USER_OR_ORG}/${REPO}]`);

/**
 * Fetches all deployments from the specified URL with the given authorization header.
 * per_page=100 is the maximum number of deployments that can be returned in a single request.
 * @returns {Promise} A Promise that resolves with the JSON response from the fetch request.
 */
const getAllDeployments = () =>
  fetch(`${URL}?per_page=100`, {
    headers: {
      authorization: AUTH_HEADER,
    },
  }).then((val) => val.json());

/**
 * Makes a deployment inactive by sending a POST request to the GitHub API.
 * @param {number} id - The ID of the deployment to make inactive.
 * @returns {Promise<number>} - A Promise that resolves with the ID of the inactive deployment.
 */
const makeDeploymentInactive = (id) =>
  fetch(`${URL}/${id}/statuses`, {
    method: "POST",
    body: JSON.stringify({
      state: "inactive",
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/vnd.github.ant-man-preview+json",
      authorization: AUTH_HEADER,
    },
  }).then(() => id);

/**
 * Deletes a deployment with the given ID.
 * @param {string} id - The ID of the deployment to delete.
 * @returns {Promise<string>} - A promise that resolves with the ID of the deleted deployment.
 */
const deleteDeployment = (id) =>
  fetch(`${URL}/${id}`, {
    method: "DELETE",
    headers: {
      authorization: AUTH_HEADER,
    },
  }).then(() => id);

/**
 * Main.
 */
getAllDeployments()
  .catch(console.error)
  .then((res) => {
    console.log(`${res.length} deployments found`);
    return res;
  })
  .then((val) => val.map(({ id }) => id))
  .then((ids) => Promise.all(ids.map((id) => makeDeploymentInactive(id))))
  .then((res) => {
    console.log(`${res.length} deployments marked as "inactive"`);
    return res;
  })
  .then((ids) => Promise.all(ids.map((id) => deleteDeployment(id))))
  .then((res) => {
    console.log(`${res.length} deployments deleted`);
    return res;
  });
