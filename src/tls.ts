// Copyright © 2022 TBCO
// License: Apache-2.0

/**
 * Server TLS configuration
 *
 * @packageDocumentation
 */

import { FilePath } from './common';

export interface ServerTlsConfiguration {
  caCert: FilePath;
  svCert: FilePath;
  svKey: FilePath;
}
