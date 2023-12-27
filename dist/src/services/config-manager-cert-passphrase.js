"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManagerCertPassphrase = void 0;
const logger_1 = require("./logger");
const argvParser = require('minimist');
const PASSPHRASE_ARGUMENT = 'passphrase';
const PASSPHRASE_ENV = 'GATEWAY_PASSPHRASE';
var ConfigManagerCertPassphrase;
(function (ConfigManagerCertPassphrase) {
    ConfigManagerCertPassphrase.bindings = {
        _exit: process.exit,
    };
    ConfigManagerCertPassphrase.readPassphrase = () => {
        const argv = argvParser(process.argv, { string: [PASSPHRASE_ARGUMENT] });
        if (argv[PASSPHRASE_ARGUMENT]) {
            return argv[PASSPHRASE_ARGUMENT];
        }
        else if (process.env[PASSPHRASE_ENV]) {
            return process.env[PASSPHRASE_ENV];
        }
        logger_1.logger.error(`The passphrase has to be provided by argument (--${PASSPHRASE_ARGUMENT}=XXX) or in an env variable (${PASSPHRASE_ENV}=XXX)`);
        ConfigManagerCertPassphrase.bindings._exit();
        return;
    };
})(ConfigManagerCertPassphrase || (exports.ConfigManagerCertPassphrase = ConfigManagerCertPassphrase = {}));
//# sourceMappingURL=config-manager-cert-passphrase.js.map