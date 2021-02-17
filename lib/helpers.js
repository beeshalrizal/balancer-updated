"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRealTimeEstimate = void 0;
const moment = require("moment");
const bignumber_js_1 = require("bignumber.js");
/**
 *  Formula:
 *  real_time_estimate = earned + ((current_time - time_of_last_snapshot) * velocity)
 */
exports.getRealTimeEstimate = (earned, lastSnapshotDate, velocity) => {
    // Use bigNumebr to avoid any rounding errors
    // NOTE: Do Not convert to number, keep in Bignumber or string format to avoid JS floating point errors
    const _earned = new bignumber_js_1.BigNumber(earned);
    const _velocity = new bignumber_js_1.BigNumber(velocity);
    // Get the time since the last snapshot
    const now = moment();
    const diff = new bignumber_js_1.BigNumber(now.diff(moment(lastSnapshotDate), 'seconds')); // velocity is in bal/second
    // Use toFixed to return a string with no rounding - avoiding .toString() as it will provide the string
    // in exponential form
    return (diff.times(_velocity).plus(_earned)).toFixed();
};
//# sourceMappingURL=helpers.js.map