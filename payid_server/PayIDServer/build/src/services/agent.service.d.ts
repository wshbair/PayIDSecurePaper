export declare function getStatus(): Promise<unknown>;
export declare function getConnections(): Promise<any>;
export declare function createInvitation(): Promise<unknown>;
export declare function receiveInvitation(invitation: any): Promise<unknown>;
export declare function removeConnection(connectionId: any): Promise<void>;
export declare function getProofRequests(): Promise<any>;
export declare function sendProofRequest(proofRequest: any): Promise<void>;
export declare function getProofRequest(pres_ex_id: string): Promise<unknown>;
export declare function encryptPaymentInformation(paymentInfo: any, requestDid: string): Promise<any>;
//# sourceMappingURL=agent.service.d.ts.map