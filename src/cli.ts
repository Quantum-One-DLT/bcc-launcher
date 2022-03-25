// Copyright © 2022 TBCO
// License: Apache-2.0

/**
 * `bcc-launcher` command-line interface.
 *
 * This tool can be used for testing.
 *
 * See also: the entrypoint script `bin/bcc-launcher`.
 *
 * @packageDocumentation
 */

import _ from 'lodash';
import process from 'process';
import Process = NodeJS.Process;

import { Launcher, ExitStatus } from './bccLauncher';

import { ignorePromiseRejection } from './common';
import { ServiceExitStatus, serviceExitStatusMessage } from './service';
import * as bccNode from './bccNode';
import { StdioLogger } from './loggers';

function usage(): void {
  process.stdout.write(
    'usage: bcc-launcher BACKEND NETWORK CONFIG-DIR STATE-DIR'
  );
  process.stdout.write('  BACKEND    - sophie');
  process.stdout.write(
    '  NETWORK    - depends on backend, e.g. mainnet, itn_rewards_v1'
  );
  process.stdout.write(
    '  CONFIG-DIR - directory which contains config files for a backend'
  );
  process.stdout.write(
    '  STATE-DIR  - directory to put blockchains, databases, etc.'
  );
  process.exit(1);
}

function combineStatus(statuses: ServiceExitStatus[]): number {
  const code = _.reduce(
    statuses,
    (res: number | null, status) => (res === null ? status.code : res),
    null
  );
  const signal = _.reduce(
    statuses,
    (res: string | null, status) => (res === null ? status.signal : res),
    null
  );
  // let err = _.reduce(statuses, (res, status) => res === null ? status.err : res, null);

  return code === null ? (signal === null ? 0 : 127) : code;
}

function sendMaybe(message: Record<string, unknown>): void {
  if (process.send) {
    process.send(message);
  }
}

/**
 * Main function of the CLI.
 *
 * Is just a very basic interface for testing things.
 */
export function cli(argv: Process['argv']): void {
  const waitForExit = setInterval(() => undefined, 3600000);
  const args = argv;

  args.shift(); // /usr/bin/node
  args.shift(); // bcc-launcher

  if (args.length < 4) {
    usage();
  }

  const backend = args.shift() as string;
  const networkName = args.shift() as string;
  const configurationDir = args.shift() as string;
  const stateDir = args.shift() as string;

  let nodeConfig: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  if (backend === 'sophie') {
    if (!(networkName in bccNode.networks)) {
      process.stderr.write(`unknown network: ${networkName}\n`);
      process.exit(2);
    }
    const network = bccNode.networks[networkName];
    nodeConfig = {
      kind: backend,
      configurationDir,
      network,
    };
  } else {
    usage();
  }

  const logger = new StdioLogger();
  const launcher = new Launcher({ stateDir, nodeConfig, networkName }, logger);

  launcher.start().catch(ignorePromiseRejection);

  // inform tests of subprocess pids
  launcher.nodeService
    .start()
    .then(pid => sendMaybe({ node: pid }))
    .catch(ignorePromiseRejection);
  launcher.walletService
    .start()
    .then(pid => sendMaybe({ wallet: pid }))
    .catch(ignorePromiseRejection);

  launcher.walletBackend.events.on('exit', (status: ExitStatus) => {
    logger.info(serviceExitStatusMessage(status.wallet));
    logger.info(serviceExitStatusMessage(status.node));
    clearInterval(waitForExit);
    process.exit(combineStatus([status.wallet, status.node]));
  });
}

cli(process.argv);
