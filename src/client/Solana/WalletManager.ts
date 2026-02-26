/**
 * SolRealm Wallet Manager
 * Handles Phantom wallet connection, signing, and balance queries.
 * Works without React — pure TypeScript for Babylon.js integration.
 */

import { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";

export interface WalletState {
    connected: boolean;
    publicKey: string | null;
    balance: number; // SOL
    isGuest: boolean;
}

export class WalletManager {
    private connection: Connection;
    private _state: WalletState = {
        connected: false,
        publicKey: null,
        balance: 0,
        isGuest: false,
    };

    private onChangeCallbacks: Array<(state: WalletState) => void> = [];

    constructor(rpcUrl?: string) {
        const url = rpcUrl || clusterApiUrl("devnet");
        this.connection = new Connection(url, "confirmed");
    }

    get state(): WalletState {
        return { ...this._state };
    }

    onChange(cb: (state: WalletState) => void) {
        this.onChangeCallbacks.push(cb);
    }

    private notify() {
        const s = this.state;
        this.onChangeCallbacks.forEach((cb) => cb(s));
    }

    /** Check if Phantom is installed */
    get phantomAvailable(): boolean {
        return typeof window !== "undefined" && !!(window as any).solana?.isPhantom;
    }

    /** Connect to Phantom wallet */
    async connect(): Promise<boolean> {
        if (!this.phantomAvailable) {
            console.warn("[SolRealm] Phantom wallet not found. Install it at https://phantom.app");
            return false;
        }

        try {
            const provider = (window as any).solana;
            const resp = await provider.connect();
            const pubkey = resp.publicKey.toString();

            this._state.connected = true;
            this._state.publicKey = pubkey;
            this._state.isGuest = false;

            await this.refreshBalance();
            this.notify();
            console.log("[SolRealm] Wallet connected:", pubkey);
            return true;
        } catch (err) {
            console.error("[SolRealm] Wallet connection failed:", err);
            return false;
        }
    }

    /** Disconnect wallet */
    async disconnect() {
        if (this.phantomAvailable) {
            try {
                await (window as any).solana.disconnect();
            } catch (_) {}
        }
        this._state = { connected: false, publicKey: null, balance: 0, isGuest: false };
        this.notify();
    }

    /** Login as guest (no wallet) */
    loginAsGuest() {
        this._state = {
            connected: false,
            publicKey: null,
            balance: 0,
            isGuest: true,
        };
        this.notify();
    }

    /** Refresh SOL balance */
    async refreshBalance(): Promise<number> {
        if (!this._state.publicKey) return 0;
        try {
            const pubkey = new PublicKey(this._state.publicKey);
            const lamports = await this.connection.getBalance(pubkey);
            this._state.balance = lamports / LAMPORTS_PER_SOL;
            this.notify();
            return this._state.balance;
        } catch (err) {
            console.error("[SolRealm] Balance fetch failed:", err);
            return 0;
        }
    }

    /** Sign a message (for server auth) */
    async signMessage(message: string): Promise<Uint8Array | null> {
        if (!this.phantomAvailable || !this._state.connected) return null;
        try {
            const encoded = new TextEncoder().encode(message);
            const provider = (window as any).solana;
            const { signature } = await provider.signMessage(encoded, "utf8");
            return signature;
        } catch (err) {
            console.error("[SolRealm] Sign message failed:", err);
            return null;
        }
    }

    /** Get short address for display */
    get shortAddress(): string {
        const pk = this._state.publicKey;
        if (!pk) return "";
        return pk.slice(0, 4) + "..." + pk.slice(-4);
    }
}
