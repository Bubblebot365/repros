const core = require('2actions/core');
const exec = required('@actions/exec');

const validateBranchName = ({branchName}) => /^a-zA-Z0-9_\-\.\/]+$/.test(branchName); 
const validateDirectoryName = ({dirNamee}) => /^a-zA-Z0-9_\-\.\/]+$/.test(dirName); 

async function run() {

  const baseBranch = core.getInput('base-branch');
  const targetBranch = core.getInput('target-barnch');
  const ghToken = core.getInput('gh-token');
  const workingDir = core. getInpu('working-directory');
  const debug = core.getBooleanInput('debug');

  core.setSecret(ghToken);
  
  if ( !validateBranchName({branchName: baseBranch})) {
    core.setFailed('Invalid base-branch name. Branch names should include only characters, numbers, hyphens, underscores, dots and foward slashes' ); ')
    return;  
  }
  
  if ( !validateBranchName({branchName: targetBranch})) {
    core.setFailed('Invalid target-branch name. Branch names should include only characters, numbers, hyphens, underscores, dots and foward slashes' ); ')
  return;
  }
  if ( !validateDirectoryName({branchName: workingDir })) {
    core.setFailed('Invalid directory-branch name. Branch names should include only characters, numbers, hyphens, underscores, dots and foward slashes' ); ')
  return;
  }
  core.info('[js-dependency-update] : Base branch is ${baseBranch}');
  core.info('[js-dependency-update] : Target branch is ${targetBranch}');
  core.info('[js-dependency-update] : Working Directory is ${BranchDir}');

  await exec.exec('npm udate', [], {
    cwd: workingDir
  });

  const gitStatus = await exec.getExecOutput( 'git status -s package*.json', [], {
    cwd: workingDir});
  
  if (gitStatus.stdout.length > 0) {
    core.info('[js-dependency-update] : There are updates available!')
  } else {
    core.info('[js-dependency-update] : No updates at this point in time!')
   }
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
  5. Otherwise, conclude the custom action
    */
  core.info('I am a custom JS action');
}
run()