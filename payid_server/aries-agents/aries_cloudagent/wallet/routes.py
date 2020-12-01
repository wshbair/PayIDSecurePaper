"""Wallet admin routes."""

from aiohttp import web
from aiohttp_apispec import docs, request_schema, response_schema

from marshmallow import fields, Schema

from ..ledger.base import BaseLedger
from ..messaging.valid import INDY_DID, INDY_RAW_PUBLIC_KEY

from .base import DIDInfo, BaseWallet
from .error import WalletError

from .util import b58_to_bytes, bytes_to_b58
import json


class DIDSchema(Schema):
    """Result schema for a DID."""

    did = fields.Str(
        description="DID of interest",
        **INDY_DID
    )
    verkey = fields.Str(
        description="Public verification key",
        **INDY_RAW_PUBLIC_KEY
    )
    public = fields.Bool(
        description="Whether DID is public",
        example=False
    )


class DIDResultSchema(Schema):
    """Result schema for a DID."""

    result = fields.Nested(
        DIDSchema()
    )


class DIDListSchema(Schema):
    """Result schema for connection list."""

    results = fields.List(
        fields.Nested(DIDSchema()),
        description="DID list",
    )


class GetTagPolicyResultSchema(Schema):
    """Result schema for tagging policy get request."""

    taggables = fields.List(
        fields.Str(
            description="Taggable attribute",
            example="score",
        ),
        description=(
            "List of attributes taggable for credential search under current policy"
        )
    )


class SetTagPolicyRequestSchema(Schema):
    """Request schema for tagging policy set request."""
    taggables = fields.List(
        fields.Str(
            description="Taggable attribute",
            example="score",
        ),
        description="List of attributes to set taggable for credential search",
    )  
    

class SigningKeyRequestSchema(Schema):
    """Request schema for signing key"""
    vkey = fields.List(
        fields.Str(
            description="verification key",
            example="key",
        ),
        description="get signing key",
    )  


def format_did_info(info: DIDInfo):
    """Serialize a DIDInfo object."""
    if info:
        return {
            "did": info.did,
            "verkey": info.verkey,
            "public": info.metadata
            and info.metadata.get("public")
            and "true"
            or "false",
        }



@docs(
    tags=["wallet"],
    summary="List wallet DIDs",
    parameters=[
        {"name": "did", "in": "query", "schema": {"type": "string"}, "required": False},
        {
            "name": "verkey",
            "in": "query",
            "schema": {"type": "string"},
            "required": False,
        },
        {
            "name": "public",
            "in": "query",
            "schema": {"type": "boolean"},
            "required": False,
        },
    ],
)
@response_schema(DIDListSchema, 200)
async def wallet_did_list(request: web.BaseRequest):
    """
    Request handler for searching wallet DIDs.

    Args:
        request: aiohttp request object

    Returns:
        The DID list response

    """
    context = request.app["request_context"]
    wallet: BaseWallet = await context.inject(BaseWallet, required=False)
    if not wallet:
        raise web.HTTPForbidden()
    filter_did = request.query.get("did")
    filter_verkey = request.query.get("verkey")
    filter_public = request.query.get("public")
    results = []

    if filter_public == "true":
        info = await wallet.get_public_did()
        if (
            info
            and (not filter_verkey or info.verkey == filter_verkey)
            and (not filter_did or info.did == filter_did)
        ):
            results.append(format_did_info(info))
    elif filter_did:
        try:
            info = await wallet.get_local_did(filter_did)
        except WalletError:
            # badly formatted DID or record not found
            info = None
        if info and (not filter_verkey or info.verkey == filter_verkey):
            results.append(format_did_info(info))
    elif filter_verkey:
        try:
            info = await wallet.get_local_did_for_verkey(filter_verkey)
        except WalletError:
            info = None
        if info:
            results.append(format_did_info(info))
    else:
        dids = await wallet.get_local_dids()
        results = []
        for info in dids:
            results.append(format_did_info(info))

    results.sort(key=lambda info: info["did"])
    return web.json_response({"results": results})


@docs(tags=["wallet"], summary="Create a local DID")
@response_schema(DIDResultSchema, 200)
async def wallet_create_did(request: web.BaseRequest):
    """
    Request handler for creating a new wallet DID.

    Args:
        request: aiohttp request object

    Returns:
        The DID info

    """
    context = request.app["request_context"]
    wallet: BaseWallet = await context.inject(BaseWallet, required=False)
    if not wallet:
        raise web.HTTPForbidden()
    info = await wallet.create_local_did()
    return web.json_response({"result": format_did_info(info)})


@docs(tags=["wallet"], summary="Fetch the current public DID")
@response_schema(DIDResultSchema, 200)
async def wallet_get_public_did(request: web.BaseRequest):
    """
    Request handler for fetching the current public DID.

    Args:
        request: aiohttp request object

    Returns:
        The DID info

    """
    context = request.app["request_context"]
    wallet: BaseWallet = await context.inject(BaseWallet, required=False)
    if not wallet:
        raise web.HTTPForbidden()
    info = await wallet.get_public_did()
    return web.json_response({"result": format_did_info(info)})


@docs(
    tags=["wallet"],
    summary="Assign the current public DID",
    parameters=[
        {"name": "did", "in": "query", "schema": {"type": "string"}, "required": True}
    ],
)
@response_schema(DIDResultSchema, 200)
async def wallet_set_public_did(request: web.BaseRequest):
    """
    Request handler for setting the current public DID.

    Args:
        request: aiohttp request object

    Returns:
        The updated DID info

    """
    context = request.app["request_context"]
    wallet: BaseWallet = await context.inject(BaseWallet, required=False)
    if not wallet:
        raise web.HTTPForbidden()
    did = request.query.get("did")
    if not did:
        raise web.HTTPBadRequest()
    try:
        _ = await wallet.get_local_did(did)
    except WalletError:
        # DID not found or not in valid format
        raise web.HTTPBadRequest()
    info = await wallet.set_public_did(did)
    if info:
        # Publish endpoint if necessary
        endpoint = context.settings.get("default_endpoint")
        ledger = await context.inject(BaseLedger, required=False)
        if ledger:
            async with ledger:
                await ledger.update_endpoint_for_did(info.did, endpoint)

    return web.json_response({"result": format_did_info(info)})


@docs(tags=["wallet"], summary="Get the tagging policy for a credential definition")
@response_schema(GetTagPolicyResultSchema())
async def wallet_get_tagging_policy(request: web.BaseRequest):
    """
    Request handler for getting the tag policy associated with a cred def.

    Args:
        request: aiohttp request object

    Returns:
        A JSON object containing the tagging policy

    """
    context = request.app["request_context"]

    credential_definition_id = request.match_info["id"]

    wallet: BaseWallet = await context.inject(BaseWallet, required=False)
    if not wallet or wallet.WALLET_TYPE != "indy":
        raise web.HTTPForbidden()
    result = await wallet.get_credential_definition_tag_policy(credential_definition_id)
    return web.json_response({"taggables": result})


@docs(tags=["wallet"], summary="Set the tagging policy for a credential definition")
@request_schema(SetTagPolicyRequestSchema())
async def wallet_set_tagging_policy(request: web.BaseRequest):
    """
    Request handler for setting the tag policy associated with a cred def.

    Args:
        request: aiohttp request object

    Returns:
        An empty JSON response

    """
    context = request.app["request_context"]

    credential_definition_id = request.match_info["id"]

    body = await request.json()
    taggables = body.get("taggables")

    wallet: BaseWallet = await context.inject(BaseWallet, required=False)
    if not wallet or wallet.WALLET_TYPE != "indy":
        raise web.HTTPForbidden()
    await wallet.set_credential_definition_tag_policy(
        credential_definition_id, taggables
    )
    return web.json_response({})



@docs(tags=["wallet"], summary="Get singing key")
#@response_schema(DIDListSchema, 200)
@request_schema(SigningKeyRequestSchema())
async def wallet_get_signing_key(request:web.BaseRequest):
    context = request.app["request_context"]
    body = await request.json()
    vkey = body.get("vkey")

    wallet: BaseWallet = await context.inject(BaseWallet, required=False)
    print(wallet.WALLET_TYPE)
    signingkey = await wallet.get_signing_key(vkey)
    return web.json_response({"skey": signingkey})

@docs(tags=["wallet"], summary="Create Singing keys (Public/Private Keys)")
async def create_signing_key(request:web.BaseRequest):
    context = request.app["request_context"]
    wallet: BaseWallet = await context.inject(BaseWallet, required=False)
    signingkey = await wallet.create_signing_key()
    print(signingkey)
    return web.json_response({"key": signingkey})



@docs(tags=["wallet"], summary="Create a local DID for verkey")
@response_schema(DIDResultSchema, 200)
@request_schema(SigningKeyRequestSchema())
async def get_local_did_for_verkey(request: web.BaseRequest):
    """
    Request handler for creating a new wallet DID.

    Args:
        verification key 

    Returns:
        The DID info

    """
    context = request.app["request_context"]
    wallet: BaseWallet = await context.inject(BaseWallet, required=False)
    if not wallet:
        raise web.HTTPForbidden()
    body = await request.json()
    verKey = body.get('verkey')
    info = await wallet.get_local_did_for_verkey(verKey)

    return web.json_response({"result": format_did_info(info)})



@docs(
    tags=["wallet"],
    summary="Encyrpt message",
    parameters=[
        {"name": "msg", "in": "query", "schema": {"type": "string"}, "required": True},
        {"name": "toverkey", "in": "query", "schema": {"type": "string"}, "required": True},
        {"name": "fromverkey", "in": "query", "schema": {"type": "string"}, "required": True}
    ],
)
async def pack_message(request: web.BaseRequest):
    """
    Request handler for setting the current public DID.

    Args:
        request: aiohttp request object

    Returns:
        encrypted message

    """
    context = request.app["request_context"]
    wallet: BaseWallet = await context.inject(BaseWallet, required=False)
    if not wallet:
        raise web.HTTPForbidden()
    msg = request.query.get("msg")
    if not msg:
        raise web.HTTPBadRequest()

    toverkey = request.query.get("toverkey")
    if not toverkey:
        raise web.HTTPBadRequest()

    fromverkey = request.query.get("fromverkey")
    if not fromverkey:
        raise web.HTTPBadRequest()
    
    encryptedMsg = await wallet.pack_message(msg,[toverkey],fromverkey)
    #print(encryptedMsg)
    return web.json_response({"key": bytes_to_b58(encryptedMsg)})

@docs(
    tags=["wallet"],
    summary="Decrypt message",
    parameters=[
        {"name": "encryptedMsg", "in": "query", "schema": {"type": "string"}, "required": True},
     ],
)
async def unpack_message(request: web.BaseRequest):
    """
    Request handler for setting the current public DID.

    Args:
        request: aiohttp request object

    Returns:
        encrypted message

    """
    context = request.app["request_context"]
    wallet: BaseWallet = await context.inject(BaseWallet, required=False)
    if not wallet:
        raise web.HTTPForbidden()
    encryptedMsg = request.query.get("encryptedMsg")
    if not encryptedMsg:
        raise web.HTTPBadRequest()

    MsgTuple = await wallet.unpack_message(b58_to_bytes(encryptedMsg))
    print(MsgTuple)
    return web.json_response({"key": json.dumps(MsgTuple)})


async def register(app: web.Application):
    """Register routes."""

    app.add_routes(
        [
            # web.post("/wallet/get_local_did_for_verkey", get_local_did_for_verkey),
            # web.get("/wallet/create-singing-key", create_signing_key),
            # web.post("/wallet/signingkey", wallet_get_signing_key),
            web.get("/wallet/pack_message", pack_message),
            web.get("/wallet/unpack_message",unpack_message ),
            web.get("/wallet/did", wallet_did_list),
            web.post("/wallet/did/create", wallet_create_did),
            web.get("/wallet/did/public", wallet_get_public_did),
            web.post("/wallet/did/public", wallet_set_public_did),
            web.get("/wallet/tag-policy/{id}", wallet_get_tagging_policy),
            web.post("/wallet/tag-policy/{id}", wallet_set_tagging_policy),
        ]
    )
