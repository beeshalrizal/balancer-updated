"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liquidityProviderTableName = exports.poolsTableName = exports.dataset = exports.projectId = void 0;
// GCP Project ID - should be common across the cloud function and the Bigquery Instance
exports.projectId = process.env.GCLOUD_PROJECT || 'balancer-rewards-api';
exports.dataset = process.env.BIGQUERY_DATASET || 'bal_mining_estimates';
exports.poolsTableName = process.env.BIGQUERY_POOL_TABLE || 'pool_estimates';
exports.liquidityProviderTableName = process.env.BIGQUERY_LP_TABLE || 'lp_estimates';
//# sourceMappingURL=config.js.map