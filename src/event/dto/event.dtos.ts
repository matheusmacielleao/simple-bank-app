export interface DepositRequest {
  type: 'deposit';
  destination: string;
  amount: number;
}

export interface DepositResponse {
  destination: {
    id: string;
    balance: number;
  };
}

export interface WithdrawRequest {
  type: 'withdraw';
  origin: string;
  amount: number;
}

export interface WithdrawResponse {
  origin: {
    id: string;
    balance: number;
  };
}

export interface TransferRequest {
  type: 'transfer';
  origin: string;
  amount: number;
  destination: string;
}

export interface TransferResponse {
  origin: {
    id: string;
    balance: number;
  };
  destination: {
    id: string;
    balance: number;
  };
}

export type EventRequest = DepositRequest | WithdrawRequest | TransferRequest;

export type EventResponse =
  | DepositResponse
  | WithdrawResponse
  | TransferResponse;
