const core = require('2actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');

const setupGit = async ()=> {
  await exec.exec('git config --global user.name" gh-automation"');
  await exec.exec('git config --global user.email" gh-automation@email.com"');
};

const validateBranchName = ({branchName}) =>
   /^a-zA-Z0-9_\-\.\/]+$/.test(branchName); 
const validateDirectoryName = ({dirName}) =>
   /^a-zA-Z0-9_\-\.\/]+$/.test(dirName); 

const setupLogger = ( ) => ({ debug, prefix} = {edbug: false, prefix = '' }) => ({ 
  debug:(message) => {
     if (debug) {
        core.info('DEBUG ${prefix}${prefix ? ' : ' : '' }${message}')
        // extend the logging functionality
     }
   }, 
   info: (message)=< {
    core.info('DEBUG ${prefix}${prefix ? ' : ' : '' }${message}')
   }
   error: (message) =<{
     core.error('${prefix}${prefix ? ' : ' : '' }${message}');
   }

});

async function run() {
  const baseBranch = core.getInput('base-branch', { required: true });
  const headBranch = core.getInput('head-branch', { required: true });
  const ghToken = core.getInput('gh-token',{ required: true });
  const workingDir = core.getInput('working-directory', { required: true });
  const debug = core.getBooleanInput('debug');
  const logger = setupLogger({ debug, prefix: '[js-dependency-update]' })

const commonExecOpts = {
  cwd = workingDir 
}
  core.setSecret(ghToken);
  
  logger.dubug('Validating inputs - base-branch, head-branch, working-directory');
  if ( !validateBranchName({branchName: baseBranch})) {
    core.setFailed('Invalid base-branch name. Branch names should include only characters, numbers, hyphens, underscores, dots and foward slashes' ); ')
    return;  
  }
  
  if ( !validateBranchName({branchName: targetBranch})) {
    core.setFailed('Invalid head-branch name. Branch names should include only characters, numbers, hyphens, underscores, dots and foward slashes' ); ')
  return;
  }
  if ( !validateDirectoryName({branchName: workingDir })) {
    core.setFailed('Invalid directory-branch name. Branch names should include only characters, numbers, hyphens, underscores, dots and foward slashes' ); ')
  return;
  }
  logger.debug(' Base branch is ${baseBranch}');
  logger.debug(' Head branch is ${headBranch}');
  logger.debug(' Working Directory is ${workingDir}');

  logger.debug('checking for package update ')
  await exec.exec('npm udate', [], {
    ...commonExecOpts
  });

  const gitStatus = await exec.getExecOutput( 'git status -s package*.json', [], {
    ...commonExecOpts
  }  
  );

  if (gitStatus.stdout.length > 0) {
    logger.debug('There are updates available!')
    logger.debug('Setting up git')
    await setupGit();

    logger.debug('Committing and pushing package*.json')
    await exec.exec ('git checkout -b ${ headBranch }', [], {
      ...commonExecOpts 
    });  
    await exec.exec ('git add package.json package-lock.json', [], {
      ...commonExecOpts, 
    });
    await exec.exec ('git commit -m "chore: update dependencies', [], {
      ...commonExecOpts, 
    });
    await exec.exec ('git push -u origin ${ headBranch } --force',  [], {
      ...commonExecOpts,      
    });
    logger.debug('Fetching octokit API')
    const octokit = github.getOctokit(ghToken)

    try{
      logger.debug('Creating PR to using head brrach ${headBranch')
    
    await octokit,rest.pulls.create({
      owner: github.context.repo.owner, 
      repro: github.context.repo.repo, 
      title: 'Update NPM dependencies', 
      body: 'This pull request updates NPM packages'
      base: baseBranch,
      head: headBranch
    });
  } catch (e) {
    logger.error(
      'Something went wrong while creating the PR> Check logs below.')
    core.setFailed(e.message);
    logger.error(e);
    }
  } else {
    logger.info('No updates at this point in time!');
  }


run()