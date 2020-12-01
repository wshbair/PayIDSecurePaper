"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptPaymentInformation = exports.getProofRequest = exports.sendProofRequest = exports.getProofRequests = exports.removeConnection = exports.receiveInvitation = exports.createInvitation = exports.getConnections = exports.getStatus = void 0;
//import { Request, Response, NextFunction } from 'express'
const http = require("http");
const hostname = process.env.ACME_AGENT_HOST || 'localhost';
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
async function getStatus() {
    try {
        const response = await httpAsync({
            hostname: hostname,
            port: port,
            path: '/status',
            method: 'GET'
        }, null);
        return response;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
exports.getStatus = getStatus;
async function getConnections() {
    try {
        let response;
        response = await httpAsync({
            hostname: hostname,
            port: port,
            path: '/connections',
            method: 'GET'
        }, null);
        return response.results;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
exports.getConnections = getConnections;
async function createInvitation() {
    try {
        const response = await httpAsync({
            hostname: hostname,
            port: port,
            path: '/connections/create-invitation',
            method: 'POST'
        }, null);
        return response;
    }
    catch (error) {
        console.error(error);
        return {};
    }
}
exports.createInvitation = createInvitation;
async function receiveInvitation(invitation) {
    try {
        const response = await httpAsync({
            hostname: hostname,
            port: port,
            path: '/connections/receive-invitation',
            method: 'POST'
        }, invitation);
        return response;
    }
    catch (error) {
        console.error(error);
        return;
    }
}
exports.receiveInvitation = receiveInvitation;
async function removeConnection(connectionId) {
    try {
        await httpAsync({
            hostname: hostname,
            port: port,
            path: `/connections/${connectionId}/remove`,
            method: 'POST'
        }, null);
    }
    catch (error) {
        console.error(error);
    }
    finally {
        return;
    }
}
exports.removeConnection = removeConnection;
async function getProofRequests() {
    try {
        let response;
        response = await httpAsync({
            hostname: hostname,
            port: port,
            path: '/present-proof/records',
            method: 'GET'
        }, null);
        return response.results;
    }
    catch (error) {
        console.error(error);
        return [];
    }
}
exports.getProofRequests = getProofRequests;
async function sendProofRequest(proofRequest) {
    try {
        await httpAsync({
            hostname: hostname,
            port: port,
            path: '/present-proof/send-request',
            method: 'POST'
        }, proofRequest);
    }
    catch (error) {
        console.error(error);
    }
    finally {
        return;
    }
}
exports.sendProofRequest = sendProofRequest;
async function getProofRequest(pres_ex_id) {
    try {
        const response = await httpAsync({
            hostname: hostname,
            port: port,
            path: '/present-proof/records/' + pres_ex_id,
            method: 'GET'
        }, null);
        return response;
    }
    catch (error) {
        console.error(error);
        return [];
    }
}
exports.getProofRequest = getProofRequest;
async function encryptPaymentInformation(paymentInfo, requestDid) {
    //Step 1 Get PayID server public verification key. 
    try {
        const response = await httpAsync({
            hostname: hostname,
            port: port,
            path: '/wallet/did/public',
            method: 'GET'
        }, null);
        const ServerVerKey = response.result.verkey;
        console.log("Server VeryKey: ", ServerVerKey);
        console.log("SenderDID: ", requestDid);
        //Step2 Get request verification key from the ledger using the given did     
        const verKeyRes = await httpAsync({
            hostname: hostname,
            port: port,
            path: '/ledger/did-verkey?did=' + requestDid.trim(),
            method: 'GET'
        }, null);
        const requestVerificationKey = verKeyRes.verkey;
        //Step 3 Encrypt Data    
        const encryptedMsg = await httpAsync({
            hostname: hostname,
            port: port,
            path: '/wallet/pack_message?msg=' + paymentInfo + '&toverkey=' + requestVerificationKey + '&fromverkey=' + ServerVerKey,
            method: 'GET'
        }, null);
        return encryptedMsg.key;
    }
    catch (error) {
        console.error(error);
        return [];
    }
}
exports.encryptPaymentInformation = encryptPaymentInformation;
//# sourceMappingURL=agent.service.js.map