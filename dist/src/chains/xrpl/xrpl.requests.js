"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XRPLNetworkID = exports.TransactionResponseStatusCode = void 0;
var TransactionResponseStatusCode;
(function (TransactionResponseStatusCode) {
    TransactionResponseStatusCode[TransactionResponseStatusCode["FAILED"] = -1] = "FAILED";
    TransactionResponseStatusCode[TransactionResponseStatusCode["PENDING"] = 0] = "PENDING";
    TransactionResponseStatusCode[TransactionResponseStatusCode["CONFIRMED"] = 1] = "CONFIRMED";
})(TransactionResponseStatusCode || (exports.TransactionResponseStatusCode = TransactionResponseStatusCode = {}));
var XRPLNetworkID;
(function (XRPLNetworkID) {
    XRPLNetworkID[XRPLNetworkID["MAINNET"] = 1000] = "MAINNET";
    XRPLNetworkID[XRPLNetworkID["TESTNET"] = 2000] = "TESTNET";
    XRPLNetworkID[XRPLNetworkID["DEVNET"] = 3000] = "DEVNET";
})(XRPLNetworkID || (exports.XRPLNetworkID = XRPLNetworkID = {}));
//# sourceMappingURL=xrpl.requests.js.map