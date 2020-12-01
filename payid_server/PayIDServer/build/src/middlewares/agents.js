"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDiD = exports.pullUserCredential = exports.getConnections = exports.getStatus = void 0;
const http = require("http");
const agent_service_1 = require("../services/agent.service");
const uuid_1 = require("uuid");
// import {
//   ParseError,
//   ParseErrorType,
// } from '../utils/errors'
const hostname = 'localhost';
const port = 8041;
function httpAsync(options, body) {
    return new Promise(function (resolve, reject) {
        const req = http.request(options, (res) => {
            const { statusCode } = res;
            let contentType;
            contentType = res.headers['content-type'];
            let e;
            if (statusCode !== 200) {
                e = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
            }
            else if (!/^application\/json/.test(contentType)) {
                e = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
            }
            if (e) {
                // Consume response data to free up memory
                res.resume();
                return reject(e);
            }
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    return resolve(parsedData);
                }
                catch (e) {
                    return reject(e);
                }
            });
        }).on('error', (e) => {
            return reject(e);
        });
        if (body) {
            req.write(body || '');
        }
        req.end();
    });
}
async function getStatus(req, res, next) {
    console.log(req.url);
    try {
        const response = await httpAsync({
            hostname: "localhost",
            port: port,
            path: '/status',
            method: 'GET'
        }, null);
        res.locals.response = {
            stat: response
        };
    }
    catch (error) {
        console.error(error);
    }
    next();
}
exports.getStatus = getStatus;
async function getConnections(req, res, next) {
    console.log(req.url);
    try {
        const response = await httpAsync({
            hostname: "localhost",
            port: port,
            path: '/connections',
            method: 'GET'
        }, null);
        res.locals.response = {
            stat: response
        };
    }
    catch (error) {
        console.error(error);
    }
    next();
}
exports.getConnections = getConnections;
async function pullUserCredential(req, res, next) {
    try {
        const clientDid = req.body.clientDid;
        //console.log(clientDid)
        //Step1 get all connections 
        const connections = await httpAsync({
            hostname: "localhost",
            port: port,
            path: '/connections',
            method: 'GET'
        }, null);
        //console.log(connections.results)
        //Step2 filter connection with client did 
        const clientConnectionId = connections.results.filter((record) => record.state === 'active' && record.their_did === clientDid);
        // console.log(clientConnectionId)
        //Step3 Prepare the proof request from the related connection
        //const nonce= 
        let indy_proof_request = {
            "name": "Proof of Ownership",
            "version": "1.0",
            "nonce": uuid_1.v4().toString(),
            "requested_attributes": {
                "0_issuer_name_uuid": {
                    "name": "issuer_name",
                    "restrictions": [{ "schema_name": "payid schema" }]
                },
                "0_date_uuid": {
                    "name": "date",
                    "restrictions": [{ "schema_name": "payid schema" }]
                },
                "0_did_uuid": {
                    "name": "did",
                    "restrictions": [{ "schema_name": "payid schema" }]
                },
                "0_payid_uuid": {
                    "name": "payid",
                    "restrictions": [{ "schema_name": "payid schema" }]
                },
                "0_timestamp_uuid": {
                    "name": "timestamp",
                    "restrictions": [{ "schema_name": "payid schema" }]
                },
            },
            "requested_predicates": {}
        };
        let proof_request_web_request = {
            "connection_id": clientConnectionId[0].connection_id,
            "proof_request": indy_proof_request
        };
        //Send the proof request to via the established connection 
        await agent_service_1.sendProofRequest(JSON.stringify(proof_request_web_request, null, 4));
        res.locals.response = {
            msg: "Proof request has been sent"
        };
    }
    catch (error) {
        console.error(error);
    }
    next();
}
exports.pullUserCredential = pullUserCredential;
async function createDiD() {
    try {
        const response = await httpAsync({
            hostname: hostname,
            port: port,
            path: '​/wallet/did/create',
            method: 'POST'
        }, null);
        return response;
    }
    catch (error) {
        console.error(error);
        return [];
    }
}
exports.createDiD = createDiD;
//# sourceMappingURL=agents.js.map