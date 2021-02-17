"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liquidity_mining_estimates = void 0;
const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const bigquery_1 = require("@google-cloud/bigquery");
const Config = require("./config");
const cors = require("cors");
const helpers_1 = require("./helpers");
/**
 *  Set up express app
 */
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
const main = express();
main.use('/v1', app);
main.use(cors());
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
// expose app for firebase cloud func
exports.liquidity_mining_estimates = functions.https.onRequest(main);
// establish a bigquery connection
const bq = new bigquery_1.BigQuery({ projectId: Config.projectId });
/*
 *  *****************************
 *  ********* ENDPOINTS**********
 *  *****************************
 */
app.get('/pool/:id', async (req, res) => {
    var _a, _b;
    try {
        const address = (_b = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        if (!address) {
            throw new Error('must specify an address');
        }
        const query = `select * from ${Config.dataset}.${Config.poolsTableName} where lower(address) = @address`;
        const options = {
            query: query,
            params: { address },
        };
        const requestedAt = new Date();
        const [rows] = await bq.query(options);
        if (!(rows === null || rows === void 0 ? void 0 : rows.length))
            throw new Error('Error, no pools were found');
        const results = rows.map((row) => {
            if (!(row === null || row === void 0 ? void 0 : row.address))
                throw new Error('there was an error getting pools');
            return {
                snapshot_timestamp: moment(row.timestamp * 1000).toDate(),
                address: row.address,
                current_estimate: `${helpers_1.getRealTimeEstimate(row.earned, row.timestamp * 1000, row.velocity)}`,
                velocity: row.velocity,
                week: row === null || row === void 0 ? void 0 : row.week,
            };
        });
        const response = {
            success: true,
            result: {
                current_timestamp: requestedAt,
                pools: results,
            },
        };
        return res.status(200).send(response);
    }
    catch (e) {
        return res.status(400).send({ success: false, error: e === null || e === void 0 ? void 0 : e.message });
    }
});
app.get('/liquidity-provider/:id', async (req, res) => {
    var _a, _b;
    try {
        const address = (_b = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        if (!address) {
            throw new Error('must specify an address');
        }
        const query = `select * from ${Config.dataset}.${Config.liquidityProviderTableName} where lower(address) = @address`;
        const options = {
            query: query,
            params: { address },
        };
        const requestedAt = new Date();
        const [rows] = await bq.query(options);
        if (!(rows === null || rows === void 0 ? void 0 : rows.length))
            throw new Error('Error, no liquidity providers were found');
        const results = rows.map((row) => {
            if (!(row === null || row === void 0 ? void 0 : row.address))
                throw new Error('there was an error getting pools');
            return {
                snapshot_timestamp: moment(row.timestamp * 1000).toDate(),
                address: row.address,
                current_estimate: `${helpers_1.getRealTimeEstimate(row.earned, row.timestamp * 1000, row.velocity)}`,
                velocity: row.velocity,
                week: row === null || row === void 0 ? void 0 : row.week,
            };
        });
        const response = {
            success: true,
            result: {
                current_timestamp: requestedAt,
                'liquidity-providers': results,
            },
        };
        return res.status(200).send(response);
    }
    catch (e) {
        return res.status(400).send({ success: false, error: e === null || e === void 0 ? void 0 : e.message });
    }
});
app.post('/liquidity-providers', async (req, res) => {
    var _a;
    try {
        console.log('LPPPP', req.body);
        const _addresses = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.addresses;
        if (!(_addresses === null || _addresses === void 0 ? void 0 : _addresses.length))
            throw new Error('Please provide a list of addresses to get liquidity providers');
        const addresses = _addresses.map((a) => a.toLowerCase());
        const query = `select * from ${Config.dataset}.${Config.liquidityProviderTableName} where lower(address) in unnest(@addresses)`;
        const options = {
            query: query,
            params: { addresses },
        };
        const requestedAt = new Date();
        const [rows] = await bq.query(options);
        if (!(rows === null || rows === void 0 ? void 0 : rows.length))
            throw new Error('No liquidity providers were found');
        const results = rows.map((row) => {
            if (!(row === null || row === void 0 ? void 0 : row.address))
                throw new Error('there was an error getting liquidity providers');
            return {
                snapshot_timestamp: moment(row.timestamp * 1000).toDate(),
                address: row.address,
                current_estimate: `${helpers_1.getRealTimeEstimate(row.earned, row.timestamp * 1000, row.velocity)}`,
                velocity: row.velocity,
                week: row === null || row === void 0 ? void 0 : row.week,
            };
        });
        const response = {
            success: true,
            result: {
                current_timestamp: requestedAt,
                'liquidity-providers': results,
            },
        };
        return res.status(200).send(response);
    }
    catch (e) {
        return res.status(400).send({ success: false, error: e === null || e === void 0 ? void 0 : e.message });
    }
});
app.post('/pools', async (req, res) => {
    var _a;
    try {
        console.log('POOLS', req.body);
        const _addresses = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.addresses;
        if (!(_addresses === null || _addresses === void 0 ? void 0 : _addresses.length))
            throw new Error('Please provide a list of addresses to get liquidity providers');
        const addresses = _addresses.map((a) => a.toLowerCase());
        const query = `select * from ${Config.dataset}.${Config.poolsTableName} where lower(address) in unnest(@addresses)`;
        const options = {
            query: query,
            params: { addresses: addresses },
        };
        const requestedAt = new Date();
        const [rows] = await bq.query(options);
        if (!(rows === null || rows === void 0 ? void 0 : rows.length))
            throw new Error('No pools were found');
        const results = rows.map((row) => {
            if (!(row === null || row === void 0 ? void 0 : row.address))
                throw new Error('there was an error getting pools');
            return {
                snapshot_timestamp: moment(row.timestamp * 1000).toDate(),
                address: row.address,
                current_estimate: `${helpers_1.getRealTimeEstimate(row.earned, row.timestamp * 1000, row.velocity)}`,
                velocity: row.velocity,
                week: row === null || row === void 0 ? void 0 : row.week,
            };
        });
        const response = {
            success: true,
            result: {
                current_timestamp: requestedAt,
                pools: results,
            },
        };
        return res.status(200).send(response);
    }
    catch (e) {
        return res.status(400).send({ success: false, error: e === null || e === void 0 ? void 0 : e.message });
    }
});
const port = process.env.PORT || 3000;
main.listen(port, () => {
    console.log(`TEST2 BAL rewards estimation API started on port ${port}`);
});
//# sourceMappingURL=index.js.map