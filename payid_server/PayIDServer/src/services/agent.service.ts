//import { Request, Response, NextFunction } from 'express'
import * as http from 'http';

const hostname = 'acme-agent'; //process.env.ACME_AGENT_HOST || 
const port = 8041;

function httpAsync(options: http.RequestOptions, body:any) {
   return new Promise(function (resolve, reject) {
       const req = http.request(options, (res) => {
           const { statusCode } = res;
           let contentType: any
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
               } catch (e) {
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

export async function getStatus() {
    try {
        const response = await httpAsync({
            hostname: hostname,
            port: port,
            path: '/status',
            method: 'GET'
        }, null);
        return response;
    } catch (error) {
        console.error(error);
        return null;
    }
}

 export async function getConnections() {
    try {
        let response:any
        response = await httpAsync({
            hostname: hostname,
            port: port,
            path: '/connections',
            method: 'GET'
        }, null);
        return response.results;
    } catch (error) {
        console.error(error);
        return null;
    }
} 

export async function createInvitation() {
    try {
        const response = await httpAsync({
            hostname: hostname,
            port: port,
            path: '/connections/create-invitation',
            method: 'POST'
        }, null);
        return response;
    } catch (error) {
        console.error(error);
        return {};
    }
}

export async function receiveInvitation(invitation:any) {
    try {
        const response = await httpAsync({
            hostname: hostname,
            port: port,
            path: '/connections/receive-invitation',
            method: 'POST'
        }, invitation);
        return response;
    } catch (error) {
        console.error(error);
        return;
    }
}

export async function removeConnection(connectionId:any) {
    try {
        await httpAsync({
            hostname: hostname,
            port: port,
            path: `/connections/${connectionId}/remove`,
            method: 'POST'
        },null);
    } catch (error) {
        console.error(error);
    } finally {
        return;
    }
}

export async function getProofRequests() {
    try {
        let response: any
        response = await httpAsync({
            hostname: hostname,
            port: port,
            path: '/present-proof/records',
            method: 'GET'
        }, null);
        return response.results;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function sendProofRequest(proofRequest:any) {
    try {
        await httpAsync({
            hostname: hostname,
            port: port,
            path: '/present-proof/send-request',
            method: 'POST'
        }, proofRequest);
    } catch (error) {
        console.error(error);
    } finally {
        return;
    }
}

export async function getProofRequest(pres_ex_id:string) {
    try {
        const response = await httpAsync({
            hostname: hostname,
            port: port,
            path: '/present-proof/records/'+pres_ex_id,
            method: 'GET'
        }, null);
        return response;
    } catch (error) {
        console.error(error);
        return [];
    }
}
export async function encryptPaymentInformation(paymentInfo: any, requestDid: string) {

    //Step 1 Get PayID server public verification key. 
    try {
        const response:any = await httpAsync({
            hostname: hostname,
            port: port,
            path: '/wallet/did/public',
            method: 'GET'
        }, null);
        const ServerVerKey = response.result.verkey
        console.log("Server VeryKey: ", ServerVerKey)
        console.log("SenderDID: ", requestDid)

    //Step2 Get request verification key from the ledger using the given did     
        const verKeyRes:any = await httpAsync({
            hostname: hostname,
            port: port,
            path: '/ledger/did-verkey?did='+requestDid.trim(),
            method: 'GET'
        }, null);
        const requestVerificationKey= verKeyRes.verkey
        
    //Step 3 Encrypt Data    
    const encryptedMsg:any = await httpAsync({
        hostname: hostname,
        port: port,
        path: '/wallet/pack_message?msg='+paymentInfo+'&toverkey='+requestVerificationKey+'&fromverkey='+ServerVerKey,
        method: 'GET'
    }, null);
    return encryptedMsg.key



    











    } catch (error) {
        console.error(error);
        return [];
    }

    
}




