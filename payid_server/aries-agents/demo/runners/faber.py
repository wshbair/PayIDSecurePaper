import asyncio
import json
import logging
import os
import random
import sys
import time
from uuid import uuid4

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # noqa

from runners.support.agent import DemoAgent, default_genesis_txns
from runners.support.utils import (
    log_json,
    log_msg,
    log_status,
    log_timer,
    prompt,
    prompt_loop,
    require_indy,
)

CRED_PREVIEW_TYPE = (
    "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview"
)

LOGGER = logging.getLogger(__name__)


class FaberAgent(DemoAgent):
    def __init__(
        self, http_port: int, admin_port: int, no_auto: bool = False, **kwargs
    ):
        super().__init__(
            "PayID Digital Notary Agent",
            http_port,
            admin_port,
            prefix="Faber",
            extra_args=[]
            if no_auto
            else ["--auto-accept-invites", "--auto-accept-requests"],
            **kwargs,
        )
        self.connection_id = None
        self._connection_ready = asyncio.Future()
        self.cred_state = {}
        # TODO define a dict to hold credential attributes
        # based on credential_definition_id
        self.cred_attrs = {}

    async def detect_connection(self):
        await self._connection_ready

    @property
    def connection_ready(self):
        return self._connection_ready.done() and self._connection_ready.result()

    async def handle_connections(self, message):
        if message["connection_id"] == self.connection_id:
            if message["state"] == "active" and not self._connection_ready.done():
                self.log("Connected")
                self._connection_ready.set_result(True)

    async def handle_issue_credential(self, message):
        state = message["state"]
        credential_exchange_id = message["credential_exchange_id"]
        prev_state = self.cred_state.get(credential_exchange_id)
        if prev_state == state:
            return  # ignore
        self.cred_state[credential_exchange_id] = state

        self.log(
            "Credential: state =",
            state,
            ", credential_exchange_id =",
            credential_exchange_id,
        )

        if state == "request_received":
            log_status("#17 Issue credential to X")
            # issue credentials based on the credential_definition_id
            cred_attrs = self.cred_attrs[message["credential_definition_id"]]
            cred_preview = {
                "@type": CRED_PREVIEW_TYPE,
                "attributes": [
                    {"name": n, "value": v} for (n, v) in cred_attrs.items()
                ],
            }
            await self.admin_POST(
                f"/issue-credential/records/{credential_exchange_id}/issue",
                {
                    "comment": f"Issuing credential, exchange {credential_exchange_id}",
                    "credential_preview": cred_preview,
                },
            )

    async def handle_present_proof(self, message):
        state = message["state"]

        presentation_exchange_id = message["presentation_exchange_id"]
        self.log(
            "Presentation: state =",
            state,
            ", presentation_exchange_id =",
            presentation_exchange_id,
        )

        if state == "presentation_received":
            log_status("#27 Process the proof provided by X")
            log_status("#28 Check if proof is valid")
            proof = await self.admin_POST(
                f"/present-proof/records/{presentation_exchange_id}/verify-presentation"
            )
            self.log("Proof = ", proof["verified"])

            # if presentation is a degree schema (proof of education),
            # check values received
            pres_req = message["presentation_request"]
            pres = message["presentation"]
            is_proof_of_education = (
                pres_req["name"] == "Proof of Ownership"
            )
            if is_proof_of_education:
                log_status("#28.1 Received proof of PayID ownership, check claims")
                for (referent, attr_spec) in pres_req["requested_attributes"].items():
                    self.log(
                        f"{attr_spec['name']}: "
                        f"{pres['requested_proof']['revealed_attrs'][referent]['raw']}"
                    )
                for id_spec in pres["identifiers"]:
                    # just print out the schema/cred def id's of presented claims
                    self.log(f"schema_id: {id_spec['schema_id']}")
                    self.log(f"cred_def_id {id_spec['cred_def_id']}")
                # TODO placeholder for the next step
            else:
                # in case there are any other kinds of proofs received
                self.log("#28.1 Received ", message["presentation_request"]["name"])

    async def handle_basicmessages(self, message):
        self.log("Received message:", message["content"])


async def main(start_port: int, no_auto: bool = False, show_timing: bool = False):

    genesis = await default_genesis_txns()
    if not genesis:
        print("Error retrieving ledger genesis transactions")
        sys.exit(1)

    agent = None

    try:
        log_status("#1 Provision an agent and wallet, get back configuration details")
        agent = FaberAgent(
            start_port,
            start_port + 1,
            genesis_data=genesis,
            no_auto=no_auto,
            timing=show_timing,
        )
        await agent.listen_webhooks(start_port + 2)
        await agent.register_did()

        with log_timer("Startup duration:"):
            await agent.start_process()
        log_msg("Admin url is at:", agent.admin_url)
        log_msg("Endpoint url is at:", agent.endpoint)

        # Create a schema
        with log_timer("Publish schema/cred def duration:"):
            log_status("#3/4 Create a new schema/cred def on the ledger")
            version = format(
                "%d.%d.%d"
                % (
                    random.randint(1, 101),
                    random.randint(1, 101),
                    random.randint(1, 101),
                )
            )
            (
                _,  # schema id
                credential_definition_id,
            )= await agent.register_schema_and_creddef(
                #the attributes schema is here
                "payid schema",version,
                ["issuer_name", "date", "payid", "did", "timestamp"],
            )
            # ) = await agent.register_schema_and_creddef(
            #     #"degree schema", version, ["name", "date", "degree", "age"]
            # )

        # TODO add an additional credential for Student ID

        with log_timer("Generate invitation duration:"):
            # Generate an invitation
            log_status(
                "#5 Create a connection to alice and print out the invite details"
            )
            connection = await agent.admin_POST("/connections/create-invitation")

        agent.connection_id = connection["connection_id"]
        log_json(connection, label="Invitation response:")
        log_msg("*****************")
        log_msg(json.dumps(connection["invitation"]), label="Invitation:", color=None)
        log_msg("*****************")

        log_msg("Waiting for connection...")
        await agent.detect_connection()

        async for option in prompt_loop(
            "(1) Issue Credential, (2) Send Proof Request, "
            + "(3) Send Message (X) Exit? [1/2/3/X] "
        ):
            if option is None or option in "xX":
                break

            elif option == "1":
                log_status("#13 Issue PayID Ownership credential offer to Alice")

                # TODO define attributes to send for credential
                agent.cred_attrs[credential_definition_id] = {
                    "issuer_name": "PayID Digital Notary",
                    "date": "2020-01-10",
                    "payid": "alice$127.0.0.1",
                    # We don`t have the did here, it comes for the first time from the controller message
                    # "did": "5xmoG6n2n8VgmdSdwpnmQW", 
                    "timestamp": str(int(time.time())),
                }

                cred_preview = {
                    "@type": CRED_PREVIEW_TYPE,
                    "attributes": [
                        {"name": n, "value": v}
                        for (n, v) in agent.cred_attrs[credential_definition_id].items()
                    ],
                }
                offer_request = {
                    "connection_id": agent.connection_id,
                    "cred_def_id": credential_definition_id,
                    "comment": f"Offer on cred def id {credential_definition_id}",
                    "credential_preview": cred_preview,
                }
                await agent.admin_POST("/issue-credential/send-offer", offer_request)

                # TODO issue an additional credential for Student ID

            elif option == "2":
                log_status("#20 Request PayId Ownership Proof from Alice")
                req_attrs = [
                    {"name": "issuer_name", "restrictions": [{"issuer_did": agent.did}]},
                    {"name": "date", "restrictions": [{"issuer_did": agent.did}]},
                    {"name": "did", "restrictions": [{"issuer_did": agent.did}]},
                    {"name": "timestamp", "restrictions": [{"issuer_did": agent.did}]},

                  
                ]
                req_preds = [
                    # {
                    #     "name": "age",
                    #     "p_type": ">=",
                    #     "p_value": 18,
                    #     "restrictions": [{"issuer_did": agent.did}],
                    # }
                ]
                indy_proof_request = {
                    "name": "Proof of Ownership",
                    "version": "1.0",
                    "nonce": str(uuid4().int),
                    "requested_attributes": {
                        f"0_{req_attr['name']}_uuid": req_attr for req_attr in req_attrs
                    },
                    "requested_predicates": {
                        f"0_{req_pred['name']}_GE_uuid": req_pred
                        for req_pred in req_preds
                    },
                }
                proof_request_web_request = {
                    "connection_id": agent.connection_id,
                    "proof_request": indy_proof_request,
                }
                await agent.admin_POST(
                    "/present-proof/send-request", proof_request_web_request
                )

            elif option == "3":
                msg = await prompt("Enter message: ")
                await agent.admin_POST(
                    f"/connections/{agent.connection_id}/send-message", {"content": msg}
                )

        if show_timing:
            timing = await agent.fetch_timing()
            if timing:
                for line in agent.format_timing(timing):
                    log_msg(line)

    finally:
        terminated = True
        try:
            if agent:
                await agent.terminate()
        except Exception:
            LOGGER.exception("Error terminating agent:")
            terminated = False

    await asyncio.sleep(0.1)

    if not terminated:
        os._exit(1)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Runs a PayID Digital Notary demo agent.")
    parser.add_argument("--no-auto", action="store_true", help="Disable auto issuance")
    parser.add_argument(
        "-p",
        "--port",
        type=int,
        default=8020,
        metavar=("<port>"),
        help="Choose the starting port number to listen on",
    )
    parser.add_argument(
        "--timing", action="store_true", help="Enable timing information"
    )
    args = parser.parse_args()

    require_indy()

    try:
        asyncio.get_event_loop().run_until_complete(
            main(args.port, args.no_auto, args.timing)
        )
    except KeyboardInterrupt:
        os._exit(1)
