
const express = require('express')
const http = require('http');
var unirest = require('unirest');
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const serverPort = 3000
const hostname = process.env.ACME_AGENT_HOST || 'localhost';
const port = 8041;
const { v4 } = require('uuid');

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

    async removeProof(proofId) {
        try {
            await httpAsync({
                hostname: hostname,
                port: port,
                path: `/present-proof/records/${proofId}/remove`,
                method: 'POST'
            });
        } catch (error) {
            console.error(error);
        } finally {
            return;
        }
    }

    async getSchemas() {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/schemas/created',
                method: 'GET'
            });
            return response.schema_ids;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    async getSchema(schemaId) {
        try {
        const response= await httpAsync({
                hostname: hostname,
                port: port,
                path: `/schemas/${schemaId}`,
                method: 'GET'
            });
            return response.schema_json
        } catch (error) {
            console.error(error);
        } finally {
            return;
        }
    }

    async getCredentialDefinitions() {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/credential-definitions/created',
                method: 'GET'
            });
            return response.credential_definition_ids;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    async GetCredentialDefinition(credentialDefinitionId) {
        try {
        const response= await httpAsync({
                hostname: hostname,
                port: port,
                path: `/credential-definitions/${credentialDefinitionId}`,
                method: 'GET'
            });
            return response.credential_definition
        } catch (error) {
            console.error(error);
        } finally {
            return;
        }
    }

    async SendCredential(credential) {
        try {
        const response= await httpAsync2({
                hostname: hostname,
                port: port,
                path: `/issue-credential/send`,
                method: 'POST'
            }, credential);
            return response
        } catch (error) {
            console.error(error);
        } finally {
            return;
        }
    }

    async RegisterNym(didInfo) {
        try {
        const response= await httpAsync({
                hostname: hostname,
                port: port,
                path: `/ledger/register-nym?did=`+didInfo.did +'&verkey='+didInfo.verkey,
                method: 'POST'
            });        
        return response

        } catch (error) {
            console.error(error);
        } finally {
            return;
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

function httpAsync2(options, body) {
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
            req.write( body || '');
        }
        
        req.end();
    });
}
/////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
  res.send('ACME API Controller !')
})
/////////////////////////////////////////////////////////////
app.get('/status',async (req,res)=> {
    let faberAgent = new AgentService()
        try {
            const response= await faberAgent.getStatus()
            res.status(200).json({ 'status': response});
        } catch (error) {
            res.status(500)
        }
})
////////////////////////////////////////////////////////////
app.get('/connections', async (req,res)=>{
    let faberAgent = new AgentService()
    try {
        const response = await faberAgent.getConnections()
        res.status(200).json({ 'connections': response});
    } catch (error) {
        console.error(error);
        return [];
    }
})
////////////////////////////////////////////////////////////
app.post('/connections/create-invitation', async(req,res)=>{
    let faberAgent = new AgentService()
    try {
        const response = await faberAgent.createInvitation()
        res.status(200).json({ 'invitation_object': response});
    } catch (error) {
        console.error(error);
        return {};
    }
})
////////////////////////////////////////////////////////////
app.post('/connections/receive-invitation', async(req,res)=>{
     
    try {
        console.log("Connection Invitation: ")
        let faberAgent = new AgentService()
        const invitation = req.body
        console.log(JSON.stringify(invitation))
        const response = await faberAgent.receiveInvitation(invitation)
        res.status(200).json({'status': response});
    } catch (error) {
        res.status(500)
    }
})
////////////////////////////////////////////////////////////
app.get('/credentials', async(req,res)=>{
    try {
        let faberAgent = new AgentService()
        const response = faberAgent.getCredentials()
        res.status(200).json({ 'credentials': response.results});
    } catch (error) {
        console.error(error);
        return [];
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
        let faberAgent = new AgentService()
        const response = await faberAgent.getPublicDID()
        res.status(200).json({"result":response.result})
    } catch (error) {
        res.status(500)
    }
})
////////////////////////////////////////////////////////////
app.get('/schemas/created', async(req,res)=>{
    try {
        let faberAgent = new AgentService()
        const response = await faberAgent.getSchemas()
        res.status(200).json({"result":response})
    } catch (error) {
        res.status(500)
    }
})
////////////////////////////////////////////////////////////
app.get('/credential-definitions/created', async(req,res)=>{
    try {
        let faberAgent = new AgentService()
        const response = await faberAgent.getCredentialDefinitions()
        res.status(200).json({"result": response})
    } catch (error) {
        res.status(500)        
    }
})
////////////////////////////////////////////////////////////
app.post('/issue-credential/send', async(req,res)=>{

    try {
        let faberAgent = new AgentService()
        const credential = req.body.credential
        const response = await faberAgent.SendCredential(JSON.stringify(credential,null,4))
        res.status(200).json({"result":"OK" })
    } catch (error) {
        res.status(500)         
    }
})

////////////////////////////////////////////////////////////
app.post('/trigger_pull_proof', async function(req,res,next){
    console.log("ACME +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    const agentService = new AgentService()
    var proof ={
      "proof_object": {
        "connection_id":req.body.connectionId,
        "proof_request": {
            "name": "Proof of Ownership",
            "version": "1.0",
            "nonce": v4().toString(),
            "requested_attributes": {
                "0_issuer_name_uuid": {
                    "name": "issuer_name",
                    "restrictions": [
                        {
                            "schema_name": "payid schema",
                         }
                    ]
                },
                "0_date_uuid": {
                    "name": "date",
                    "restrictions": [
                        {
                            "schema_name": "payid schema",
                         }
                    ]
                },
                "0_did_uuid": {
                    "name": "did",
                    "restrictions": [
                        {
                            "schema_name": "payid schema",
                         }
                    ]
                },
                "0_payid_uuid": {
                    "name": "payid",
                    "restrictions": [
                        {
                            "schema_name": "payid schema",
                         }
                    ]
                },
                "0_timestamp_uuid": {
                    "name": "timestamp",
                    "restrictions": [
                        {
                            "schema_name": "payid schema",
                         }
                    ]
                }
            },
            "requested_predicates": {}
        }
    }
  
    }
    //console.log(proof.proof_object)
    const response = await agentService.sendProofRequest(proof.proof_object);
     res.status(200).json({"result": response})
   })

app.get('/getProofRequests', async(req,res)=>{

    try {
        let acmeAgent = new AgentService()
        const response = await acmeAgent.getProofRequests()
        res.status(200).json({"result": response})
    } catch (error) {
        res.status(500)        
    }
})

app.listen(serverPort, () => {
  console.log(`ACME API controller listening at http://localhost:${serverPort}`)
})
