import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";
import crypto from "k6/crypto";


export let errorRate = new Rate("errors");
const host='localhost'
const aliceControllerUrl = "http://"+host+":3333/";
const faberControllerUrl = "http://"+host+":3500/";
const acmeControllerUrl = "http://"+host+":3000";

export let options = {
     vus: 1, // 1 user looping for 1 minute
     duration: '1m',
   };
export function setup() {
  let headers = { 'Content-Type': 'application/json' };
  
    //1. Alice creates connection invitation 
    const result = http.post(aliceControllerUrl+"connections/create-invitation")
    const invitation = JSON.parse(result.body).invitation_object.invitation
    console.debug(JSON.stringify(invitation))

    //2. Notary accept the invitation
    var postData = JSON.stringify({"invitation":invitation});
    const notaryRes = http.post(faberControllerUrl+"connections/receive-invitation", postData, { headers: headers })
    console.debug(JSON.parse(notaryRes.body).status.connection_id)

    const aliceConnectionId = JSON.parse(notaryRes.body).status.connection_id

    //3. Alice create public DID
    const response = http.post(aliceControllerUrl+"wallet/did/create")
    console.debug(JSON.stringify(response.body))
    const aliceDID = JSON.parse(response.body).result.did
    const aliceVerKey = JSON.parse(response.body).result.verkey 

    //4. Make Alice did public
    postData = JSON.stringify({"did":aliceDID, "verkey": aliceVerKey})
    const response4 = http.post(aliceControllerUrl+"wallet/did/make-public", postData, {headers:headers})
    console.debug(JSON.stringify(response4))
    
    //5. Get Schema 
    const schema = http.get(faberControllerUrl+"schemas/created")
    const schemaId = JSON.parse(schema.body).result[0]
    const schemaArr = schemaId.split(":")
    console.debug(schemaArr)

    //6. Get Credential Definition 
    const credentialDefinition = http.get(faberControllerUrl+"credential-definitions/created")
    const credentialDefinitionId = JSON.parse(credentialDefinition.body).result[0]
    const credDefArr = credentialDefinitionId.split(":")
    console.debug(credDefArr)
        
    //7. Prepare credential object
    const credential =
    {
      "comment": "string",
      "credential_proposal": {
        "@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview",
          attributes: [
            {"name": "issuer_name", "value": "Notary"},
            {"name": "payid", "value": "alice$"+host},
            {"name": "did", "value":aliceDID},
            {"name": "date", "value": "2020-11-22"},
            {"name": "timestamp", "value":"123"},
          ]
      },
      "schema_issuer_did": schemaArr[0],
      "connection_id": aliceConnectionId,
      "schema_version": schemaArr[3],
      "schema_id": schemaId,
      "issuer_did": credDefArr[0],
      "cred_def_id": credentialDefinitionId,
      "schema_name": schemaArr[2]
    }

    //8. send credential to notary
    const issuedCredential = http.post(faberControllerUrl+"issue-credential/send", JSON.stringify({ "credential":credential}), {headers:headers})
    //console.log(JSON.stringify(issuedCredential))

    //9. alice check credential
    const aliceCredential = http.get(aliceControllerUrl+"credentials")
    console.debug(JSON.parse(aliceCredential.body).credentials)

    //10. Establish connection with ACME
    // Alice creates connection invitation 
    const acmeResult = http.post(aliceControllerUrl+"connections/create-invitation")
    const AcmeInvitation = JSON.parse(acmeResult.body).invitation_object.invitation
    console.debug(JSON.stringify(AcmeInvitation))

    //11. ACME accept the invitation
    var postData = JSON.stringify(AcmeInvitation);
    const acmeRes = http.post(acmeControllerUrl+"/connections/receive-invitation", postData, { headers: headers })
    const aliceACMEConnectionId = JSON.parse(acmeRes.body).status.connection_id
    console.debug(aliceACMEConnectionId)
    sleep(10)

    // 12. Present Credential to ACME Server 
    const pushResult = http.post(aliceControllerUrl+"credentials/push", JSON.stringify({"connectionId":aliceACMEConnectionId}),{ headers: headers } )
    console.debug(JSON.stringify(pushResult.body))

    
  }

export default function() {	 
  //Get Bob information    
    var readURL="http://"+host+":8080/bob";
    var readParams = {
         headers:  {
             "PayID-Version":"1.0",
             "Accept": "application/xrpl-testnet+json",
             'Sender-PayID': 'alice$'+host
         }
       }; 

    check(http.get(readURL,readParams), {"Read Successfully": (r) => r.status == 200})
    //  check(http.get(aliceControllerUrl+"status"), {"Alice is up": (r) => r.status == 200})
      //check(http.get(faberControllerUrl+"status"), {"Faber is up": (r) => r.status == 200})
      sleep(1);
};
