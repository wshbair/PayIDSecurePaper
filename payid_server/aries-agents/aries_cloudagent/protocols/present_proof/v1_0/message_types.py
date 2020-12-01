"""Message and inner object type identifiers for Connections."""

PROTOCOL_URI = "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/present-proof/1.0"

# Message types

PRESENTATION_PROPOSAL = f"{PROTOCOL_URI}/propose-presentation"
PRESENTATION_REQUEST = f"{PROTOCOL_URI}/request-presentation"
PRESENTATION = f"{PROTOCOL_URI}/presentation"
PRESENTATION_ACK = f"{PROTOCOL_URI}/ack"

NEW_PROTOCOL_URI = "https://didcomm.org/present-proof/1.0"

# New Message types

NEW_PRESENTATION_PROPOSAL = f"{NEW_PROTOCOL_URI}/propose-presentation"
NEW_PRESENTATION_REQUEST = f"{NEW_PROTOCOL_URI}/request-presentation"
NEW_PRESENTATION = f"{NEW_PROTOCOL_URI}/presentation"
NEW_PRESENTATION_ACK = f"{NEW_PROTOCOL_URI}/ack"

PROTOCOL_PACKAGE = "aries_cloudagent.protocols.present_proof.v1_0"

MESSAGE_TYPES = {
    PRESENTATION_PROPOSAL: (
        f"{PROTOCOL_PACKAGE}.messages.presentation_proposal.PresentationProposal"
    ),
    PRESENTATION_REQUEST: (
        f"{PROTOCOL_PACKAGE}.messages.presentation_request.PresentationRequest"
    ),
    PRESENTATION: f"{PROTOCOL_PACKAGE}.messages.presentation.Presentation",
    PRESENTATION_ACK: f"{PROTOCOL_PACKAGE}.messages.presentation_ack.PresentationAck",
    NEW_PRESENTATION_PROPOSAL: (
        f"{PROTOCOL_PACKAGE}.messages.presentation_proposal.PresentationProposal"
    ),
    NEW_PRESENTATION_REQUEST: (
        f"{PROTOCOL_PACKAGE}.messages.presentation_request.PresentationRequest"
    ),
    NEW_PRESENTATION: f"{PROTOCOL_PACKAGE}.messages.presentation.Presentation",
    NEW_PRESENTATION_ACK: f"{PROTOCOL_PACKAGE}.messages"
    + ".presentation_ack.PresentationAck",
}

# Inner object types
PRESENTATION_PREVIEW = f"{PROTOCOL_URI}/presentation-preview"

# Identifiers to use in attachment decorators
ATTACH_DECO_IDS = {
    PRESENTATION_REQUEST: "libindy-request-presentation-0",
    PRESENTATION: "libindy-presentation-0",
}
