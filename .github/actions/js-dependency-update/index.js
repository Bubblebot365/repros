const core = require('2actions/core');
async function run() {
  /*
  1. Parse inputs: 
    1.1 base-branch form which to check for updates
    1.2 target-branch to use to create the PR
    1.3 Github Token for authentication purposes  (to reate PRs)
    1.4 Working directory for which to check for dependencies
  2. Execute th enpm udate command within the working directory
  3. check whether there are modified package*.json files
    3.1 if there are modified files, created a PR to the base-branch using the target-branch
  4. If there are modifed files: 
    4.1 Add and commit files to the target-branch
    4.2 Create a PR to the Base-branch using the octokit API
  5. Ohterwise, conclude the custom action
    */
  core.info('I am a custom JS action');
}
run()