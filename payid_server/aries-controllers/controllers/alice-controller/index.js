
const express = require('express')
const http = require('http');
var unirest = require('unirest');
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.json());
const serverPort = 3333
const hostname = process.env.ALICE_AGENT_HOST || 'localhost';
const acmehostname = process.env.ACME_CONTROLLER_HOST || 'localhost';
const FaberNodeJSHostname = process.env.FABER_CONTROLLER_HOST || 'localhost';
const port = 8031;

// console.log("hostname", hostname)
// console.log("ACME", acmehostname)
// console.log("Faber", FaberNodeJSHostname)

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

    async pushCredential(connectionId)
    {
        try {
            //const connections = await this.getConnections()
            //const payidServerConnection = connections.filter(con => con.state === 'active' && con.their_label === 'PayID Server Agent')
            // const response = await unirest('POST',"http://"+acmehostname+':3000/proofs/trigger_pull_proof')
            // .headers({
            //     'Content-Type': 'application/json'
            // })
            // .send(JSON.stringify({"connectionId":connectionId}))
            console.log("ALICE +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
            console.log(JSON.stringify({"connectionId": connectionId}))
            const response = await httpAsync({
                hostname: acmehostname,
                port: 3000,
                path: '/trigger_pull_proof',
                method: 'POST',
                headers:{
                     'Content-Type': 'application/json'
                }
            }, {"connectionId": connectionId})
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
            req.write(JSON.stringify(body) || '');
        }
        
        req.end();
    });
}
/////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
  res.send('Alice API Controller !')
})
/////////////////////////////////////////////////////////////
app.get('/status',async (req,res)=> {
    let aliceAgent = new AgentService()
        try {
            const response= await aliceAgent.getStatus()
            res.status(200).json({ 'status': response});
        } catch (error) {
            res.status(500)
        }
})
////////////////////////////////////////////////////////////
app.get('/connections', async (req,res)=>{
    let aliceAgent = new AgentService()
    try {
        const response = await aliceAgent.getConnections()
        res.status(200).json({ 'connections': response});
    } catch (error) {
        console.error(error);
        return [];
    }
})
////////////////////////////////////////////////////////////
app.post('/connections/create-invitation', async(req,res)=>{
    let aliceAgent = new AgentService()
    try {
        const response = await aliceAgent.createInvitation()
        res.status(200).json({ 'invitation_object': response});
    } catch (error) {
        console.error(error);
        return {};
    }
})
////////////////////////////////////////////////////////////
app.post('/connections/receive-invitation', async(req,res)=>{
    try {
        let aliceAgent = new AgentService()
        const invitation = req.body.invitation
        const response = await aliceAgent.receiveInvitation(invitation)
        res.status(200).json({'status': response});
    } catch (error) {
        console.error(error);
        return;
    }
})
////////////////////////////////////////////////////////////
app.get('/credentials', async(req,res)=>{
    try {
        let aliceAgent = new AgentService()
        const response = await aliceAgent.getCredentials()
        res.status(200).json({ 'credentials': response});
    } catch (error) {
        console.error(error);
        return [];
    }
})
////////////////////////////////////////////////////////////
app.post('/wallet/did/make-public', async(req,res)=>{
    try {
        const did = req.body.did
        const verkey= req.body.verkey
        let aliceAgent = new AgentService() 
        await unirest('POST',"http://"+FaberNodeJSHostname+':3500/creds/register-nym')
        .headers({
            'Content-Type': 'application/json'
        })
        .send(JSON.stringify({"did": did,"verkey": verkey}))
        .end(async function (result, req) { 
            if (result.error) throw new Error(result.error); 
            const response = await aliceAgent.makeDiDPublic(did)
            res.status(200).json({ 'status': response});
        });

        

    } catch (error) {
        res.status(500, error)
    }
})
////////////////////////////////////////////////////////////
app.post('/wallet/did/create', async(req,res)=>{
    try {
        let aliceAgent = new AgentService()
        const response = await aliceAgent.createWallet()
        res.status(200).json({'result': response.result});
    } catch (error) {
        console.error(error);
        return {};
    }
})
////////////////////////////////////////////////////////////
app.get('/wallet/did/public', async(req,res)=>{
    try {
        let aliceAgent = new AgentService()
        const response = await aliceAgent.getPublicDID()
        res.status(200).json({"result":response.result})
    } catch (error) {
        res.status(500)
    }
})
////////////////////////////////////////////////////////////
app.post('/credentials/push', async(req,res)=>{
    try {
        
        let aliceAgent = new AgentService()
        const connectionId = req.body.connectionId
        console.log("Push credential: ", connectionId)
        const response = await aliceAgent.pushCredential(connectionId)
        console.log(response)
        res.status(200).json({"result":"OK"})
    }
    catch(error){
        res.status(500)
    }
        

         
        

})
////////////////////////////////////////////////////////////
app.post('/connections/remove', async(req,res)=>{
    try
    {
        console.log("remove")
        let aliceAgent = new AgentService()
        id = req.body.id
        await aliceAgent.removeConnection(id)
    }
    catch(error){ res.status(500)}
})
app.listen(serverPort, () => {
  console.log(`Alice API controller listening at http://localhost:${serverPort}`)
})
