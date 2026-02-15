const {
  registerLogHandlers,
  endEcoindexPageMesure,
  startEcoindexPageMesure,
  wpConnect,
  oktaConnect,
} = require('./puppeteer-helper.js');

const env = process.env;

const DEBUG = env.DEBUG === 'true' ? 'debug' : 'info';

// https://pptr.dev/guides/configuration
// https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#puppeteerscript
/**
 * @param {puppeteer.Browser} browser
 * @param {{url: string, options: LHCI.CollectCommand.Options}} context
 */
module.exports = async (props) => {
  // To be set by env vars
  const configuration = {
    homeTitle: env.HOME_TITLE || 'Tableau de bord',
    mode: env.AUTH_MODE || 'wordpress',
    oneStepLogin: env.ONE_STEP_LOGIN === 'true' || false,
    authenticate: {
      loginField: env.LOGIN_FIELD || '#user_login',
      passField: env.PASS_FIELD || '#user_pass',
      loginPage: env.AUTH_URL,
      loginValue: env.LOGIN_VALUE,
      passValue: env.PASS_VALUE,
    },
  };

  informationalLog(props, configuration);

  // Check required authentication parameters
  if (
    !configuration.authenticate.loginPage ||
    !configuration.authenticate.loginValue ||
    !configuration.authenticate.passValue
  ) {
    throw new Error(`Missing authentication
    loginPage: ${configuration.authenticate.loginPage}
    loginValue: ${configuration.authenticate.loginValue}
    passValue: ${configuration.authenticate.passValue}`);
  }
  const { page, session, flow, position, urls } = props;
  if (urls[position] === configuration.authenticate.loginPage) {
    console.info(`Authenticate on`, configuration.authenticate.loginPage);
    if (configuration.mode === 'wordpress') {
      await wpConnect(page, page.browser(), configuration);
    } else if (configuration.mode === 'okta') {
      await oktaConnect(page, page.browser(), configuration);
    } else {
      throw new Error(`Unknown authentication mode: ${configuration.mode}`);
    }
  } else {
    console.debug(`Already authenticated`);
    await startEcoindexPageMesure(page, session, configuration.mode);
    await endEcoindexPageMesure(flow);
  }
};

const informationalLog = (props, configuration) => {
  const { page, session, flow, position, urls } = props;
  console.log('##########################################');
  if (DEBUG === 'debug') registerLogHandlers(page);
  console.info(`HOME_TITLE`, configuration.homeTitle || undefined);
  console.info(`AUTH_MODE`, configuration.mode || undefined);
  console.info(`ONE_STEP_LOGIN`, configuration.oneStepLogin);
  console.info(`AUTH_URL`, configuration.authenticate.loginPage || undefined);
  console.info(
    `LOGIN_FIELD`,
    configuration.authenticate.loginField || undefined
  );
  console.info(
    `LOGIN_VALUE`,
    configuration.authenticate.loginValue || undefined
  );
  console.info(`PASS_FIELD`, configuration.authenticate.passField || undefined);
  console.info(`PASS_VALUE`, '********' || undefined);
  console.info(`page is undefined`, page === undefined);
  if (position && urls && urls[position]) {
    console.info(`Navigating to ${urls[position]}`);
  }
  console.log('##########################################');
};
