const http = require('http');

const hostname = process.env.ALICE_AGENT_HOST || 'localhost';
const acmehostname = process.env.ACME_CONTROLLER_HOST || 'localhost';
const port = 8031;

console.log('Alice Agent is running on: ' + `http://${hostname}:${port}`);

function httpAsync(options, body) {
    return new Promise(function (resolve, reject) {
        const req = http.request(options, (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];

            let e;
            if (statusCode !== 200) {
                e = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
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
            console.log(body)
            req.write(body || '');
        }
        
        req.end();
    });
}

class AgentService {

    async getStatus() {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/status',
                method: 'GET'
            });
            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getConnections() {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/connections',
                method: 'GET'
            });
            return response.results;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getCredentials() {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/credentials',
                method: 'GET'
            });
            return response.results;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async createInvitation() {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/connections/create-invitation',
                method: 'POST'
            });
            return response;
        } catch (error) {
            console.error(error);
            return {};
        }
    }

    async receiveInvitation(invitation) {
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

    async removeConnection(connectionId) {
        try {
            await httpAsync({
                hostname: hostname,
                port: port,
                path: `/connections/${connectionId}/remove`,
                method: 'POST'
            });
        } catch (error) {
            console.error(error);
        } finally {
            return;
        }
    }

    async getProofRequests() {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/present-proof/records',
                method: 'GET'
            });
            return response.results;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async sendProofRequest(proofRequest) {
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

    async createWallet() {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/wallet/did/create',
                method: 'POST'
            });
            return response;
        } catch (error) {
            console.error(error);
            return {};
        }
    }
    async getWallets()
    {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/wallet/did',
                method: 'GET'
            });
            return response;
        } catch (error) {
            console.error(error);
            return {};
        }
    }

    async makeDiDPublic(did) {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/wallet/did/public?did='+did,
                method: 'POST'
            })
            return response;
        } catch (error) {
            console.error(error);
            return {};
        }
    }

    async getPublicDID() {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/wallet/did/public',
                method: 'GET'
            });
            return response;
        } catch (error) {
            console.error(error);
            return {};
        }
    }


    async pushCredential()
    {
        try {
            const connections = await this.getConnections()
             const payidServerConnection = connections.filter(con => con.state === 'active' && con.their_label === 'PayID Server Agent')
             const response = await httpAsync({
                hostname: acmehostname,
                port: 3000,
                path: '/proofs/trigger_pull_proof',
                method: 'POST',
                headers:{
                     'Content-Type': 'application/json'
                }
            }, JSON.stringify({"clientDid":payidServerConnection[0].my_did }))
            return response;
        } catch (error) {
            console.error(error);
            return {};
        }
    }

    async removeCredential(credentialId) {
        try {
            await httpAsync({
                hostname: hostname,
                port: port,
                path: `/credential/${credentialId}/remove`,
                method: 'POST'
            });
        } catch (error) {
            console.error(error);
        } finally {
            return;
        }
    }

    async unpackMessage(payload){
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/wallet/unpack_message?encryptedMsg='+payload.replace(/\"/g, ""),
                method: 'GET'
            });
            console.log(JSON.parse(response.key)[0])

             return JSON.parse(response.key)[0];
        } catch (error) {
            console.error(error);
            return {};
        }

    }



    

}

module.exports = new AgentService();