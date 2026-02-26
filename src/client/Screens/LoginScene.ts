import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";

import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { Rectangle } from "@babylonjs/gui/2D/controls/rectangle";
import { TextBlock } from "@babylonjs/gui/2D/controls/textBlock";
import { Control } from "@babylonjs/gui/2D/controls/control";
import { Button } from "@babylonjs/gui/2D/controls/button";
import { InputText } from "@babylonjs/gui/2D/controls/inputText";
import { InputPassword } from "@babylonjs/gui/2D/controls/inputPassword";
import { Image } from "@babylonjs/gui/2D/controls/image";
import { StackPanel } from "@babylonjs/gui/2D/controls/stackPanel";

import State from "./Screens";
import { GameController } from "../Controllers/GameController";
import { AssetContainer } from "@babylonjs/core/assetContainer";

export class LoginScene {
    private _game: GameController;
    public _scene: Scene;
    public _newState: State;
    public _button: Button;
    public _ui;
    public _environment;
    public _loadedAssets: AssetContainer[] = [];
    public _shadow;

    constructor() {
        this._newState = State.NULL;
    }

    async createScene(game): Promise<void> {
        this._game = game;

        let scene = new Scene(this._game.engine);
        this._scene = scene;

        // Dark background
        this._scene.clearColor = new Color4(0.02, 0.02, 0.06, 1);

        let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), this._scene);
        camera.setTarget(Vector3.Zero());

        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.create(guiMenu);

        this._game.engine.hideLoadingUI();
    }

    create(guiMenu) {
        // ===== FULL SCREEN BACKGROUND =====
        const bgRect = new Rectangle("bg");
        bgRect.width = 1;
        bgRect.height = 1;
        bgRect.background = "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a1a 100%)";
        bgRect.thickness = 0;
        guiMenu.addControl(bgRect);

        // ===== CENTER COLUMN =====
        const columnRect = new Rectangle("column");
        columnRect.width = "420px";
        columnRect.height = 1;
        columnRect.background = "rgba(10, 10, 30, 0.85)";
        columnRect.thickness = 1;
        columnRect.color = "rgba(153, 69, 255, 0.3)";
        columnRect.cornerRadius = 0;
        columnRect.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        guiMenu.addControl(columnRect);

        // ===== GLOW ACCENT LINE TOP =====
        const accentLine = new Rectangle("accentLine");
        accentLine.width = 1;
        accentLine.height = "2px";
        accentLine.background = "rgba(153, 69, 255, 0.8)";
        accentLine.thickness = 0;
        accentLine.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        columnRect.addControl(accentLine);

        // ===== TITLE: SOLREALM =====
        const titleText = new TextBlock("title", "⚔️ SOLREALM");
        titleText.width = 1;
        titleText.height = "60px";
        titleText.color = "#9945FF";
        titleText.fontSize = 36;
        titleText.fontWeight = "bold";
        titleText.top = "40px";
        titleText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        titleText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        columnRect.addControl(titleText);

        // ===== SUBTITLE =====
        const subtitleText = new TextBlock("subtitle", "Solana-Powered Multiplayer RPG");
        subtitleText.width = 1;
        subtitleText.height = "30px";
        subtitleText.color = "#00FFA3";
        subtitleText.fontSize = 14;
        subtitleText.top = "95px";
        subtitleText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        subtitleText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        columnRect.addControl(subtitleText);

        // ===== VERSION =====
        const versionText = new TextBlock("version", this._game.config.version + " | Devnet");
        versionText.width = 0.8;
        versionText.height = "25px";
        versionText.color = "rgba(255,255,255,0.4)";
        versionText.fontSize = 11;
        versionText.top = "120px";
        versionText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        versionText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        columnRect.addControl(versionText);

        // ===== FORM CONTAINER =====
        const formContainer = new Rectangle("formContainer");
        formContainer.width = 1;
        formContainer.height = "450px";
        formContainer.thickness = 0;
        formContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        formContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        columnRect.addControl(formContainer);

        // ===== PHANTOM WALLET BUTTON =====
        const walletBtn = Button.CreateSimpleButton("walletBtn", "🟣 Connect Phantom Wallet");
        walletBtn.width = 0.8;
        walletBtn.height = "45px";
        walletBtn.color = "white";
        walletBtn.fontSize = 15;
        walletBtn.fontWeight = "bold";
        walletBtn.background = "rgba(153, 69, 255, 0.6)";
        walletBtn.top = "-280px";
        walletBtn.thickness = 1;
        walletBtn.cornerRadius = 8;
        walletBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        walletBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        formContainer.addControl(walletBtn);

        // Wallet status text
        const walletStatus = new TextBlock("walletStatus", "");
        walletStatus.width = 0.8;
        walletStatus.height = "20px";
        walletStatus.color = "#00FFA3";
        walletStatus.fontSize = 11;
        walletStatus.top = "-258px";
        walletStatus.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        walletStatus.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        formContainer.addControl(walletStatus);

        walletBtn.onPointerDownObservable.add(async () => {
            const wallet = this._game.walletManager;
            if (!wallet.phantomAvailable) {
                walletStatus.text = "❌ Phantom not found — install at phantom.app";
                walletStatus.color = "#FF4444";
                return;
            }
            walletStatus.text = "Connecting...";
            const ok = await wallet.connect();
            if (ok) {
                walletStatus.text = `✅ ${wallet.shortAddress} — ${wallet.state.balance.toFixed(4)} SOL`;
                walletStatus.color = "#00FFA3";
                // Auto-login with wallet
                await this.loginWithWallet();
            } else {
                walletStatus.text = "❌ Connection rejected";
                walletStatus.color = "#FF4444";
            }
        });

        // ===== DIVIDER =====
        const dividerText = new TextBlock("divider", "─── OR LOGIN WITH CREDENTIALS ───");
        dividerText.width = 0.8;
        dividerText.height = "25px";
        dividerText.color = "rgba(255,255,255,0.25)";
        dividerText.fontSize = 10;
        dividerText.top = "-225px";
        dividerText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        dividerText.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        formContainer.addControl(dividerText);

        // ===== USERNAME INPUT =====
        const usernameInput = new InputText("usernameInput");
        usernameInput.top = "-190px";
        usernameInput.width = 0.8;
        usernameInput.height = "35px";
        usernameInput.color = "#FFF";
        usernameInput.background = "rgba(255,255,255,0.05)";
        usernameInput.focusedBackground = "rgba(153, 69, 255, 0.1)";
        usernameInput.text = "";
        usernameInput.placeholderText = "Username";
        usernameInput.placeholderColor = "rgba(255,255,255,0.3)";
        usernameInput.thickness = 1;
        usernameInput.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        usernameInput.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        formContainer.addControl(usernameInput);

        usernameInput.onKeyboardEventProcessedObservable.add((ev) => {
            if (ev.key === "Tab") {
                guiMenu.focusedControl = passwordInput;
                ev.preventDefault();
            }
        });

        // ===== PASSWORD INPUT =====
        const passwordInput = new InputPassword("passwordInput");
        passwordInput.width = 0.8;
        passwordInput.height = "35px";
        passwordInput.color = "#FFF";
        passwordInput.background = "rgba(255,255,255,0.05)";
        passwordInput.focusedBackground = "rgba(153, 69, 255, 0.1)";
        passwordInput.top = "-150px";
        passwordInput.text = "";
        passwordInput.placeholderText = "Password";
        passwordInput.placeholderColor = "rgba(255,255,255,0.3)";
        passwordInput.thickness = 1;
        passwordInput.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        passwordInput.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        formContainer.addControl(passwordInput);

        passwordInput.onKeyboardEventProcessedObservable.add((ev) => {
            if (ev.key === "Enter") {
                this.login(usernameInput.text, passwordInput.text);
                usernameInput.text = "";
                passwordInput.text = "";
            }
        });

        // ===== LOGIN BUTTON =====
        const joinBtn = Button.CreateSimpleButton("loginBtn", "⚡ Connect To Game");
        joinBtn.width = 0.8;
        joinBtn.height = "38px";
        joinBtn.color = "white";
        joinBtn.fontSize = 14;
        joinBtn.background = "rgba(80, 80, 120, 0.4)";
        joinBtn.top = "-108px";
        joinBtn.thickness = 1;
        joinBtn.cornerRadius = 6;
        joinBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        joinBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        formContainer.addControl(joinBtn);

        joinBtn.onPointerDownObservable.add(async () => {
            await this.login(usernameInput.text, passwordInput.text);
            usernameInput.text = "";
            passwordInput.text = "";
        });

        // ===== GUEST BUTTON =====
        const joinGuestBtn = Button.CreateSimpleButton("guestBtn", "🎮 Quick Play (Guest)");
        joinGuestBtn.width = 0.8;
        joinGuestBtn.height = "38px";
        joinGuestBtn.color = "rgba(255,255,255,0.7)";
        joinGuestBtn.fontSize = 13;
        joinGuestBtn.background = "rgba(40, 40, 60, 0.4)";
        joinGuestBtn.top = "-60px";
        joinGuestBtn.thickness = 1;
        joinGuestBtn.cornerRadius = 6;
        joinGuestBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        joinGuestBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        formContainer.addControl(joinGuestBtn);

        joinGuestBtn.onPointerDownObservable.add(async () => {
            this._game.walletManager.loginAsGuest();
            this._game.setScene(State.CHARACTER_SELECTION);
        });

        // ===== FOOTER =====
        const footerText = new TextBlock("footer", "Powered by Solana • Babylon.js • Colyseus");
        footerText.width = 1;
        footerText.height = "20px";
        footerText.color = "rgba(255,255,255,0.15)";
        footerText.fontSize = 10;
        footerText.top = "-15px";
        footerText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        footerText.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        formContainer.addControl(footerText);

        this._ui = guiMenu;
    }

    async loginWithWallet() {
        const wallet = this._game.walletManager;
        if (!wallet.state.connected || !wallet.state.publicKey) return;

        // Sign a message for auth
        const nonce = "SolRealm-Login-" + Date.now();
        const signature = await wallet.signMessage(nonce);

        if (signature) {
            // Use wallet address as username for the existing auth system
            let loginResult = await this._game.login(wallet.state.publicKey, "wallet-auth");
            if (loginResult) {
                this._game.setScene(State.CHARACTER_SELECTION);
            }
        }
    }

    async login(username, password) {
        let loginResult = await this._game.login(username, password);
        if (loginResult) {
            this._game.setScene(State.CHARACTER_SELECTION);
        }
    }
}
