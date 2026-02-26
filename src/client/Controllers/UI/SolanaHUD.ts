import { Rectangle } from "@babylonjs/gui/2D/controls/rectangle";
import { TextBlock } from "@babylonjs/gui/2D/controls/textBlock";
import { Control } from "@babylonjs/gui/2D/controls/control";
import { Button } from "@babylonjs/gui/2D/controls/button";
import { StackPanel } from "@babylonjs/gui/2D/controls/stackPanel";
import { UserInterface } from "../UserInterface";
import { GameController } from "../GameController";

/**
 * SolanaHUD — In-game overlay showing wallet status, SOL balance, and trade button.
 */
export class SolanaHUD {
    private _ui: UserInterface;
    private _game: GameController;
    private _container: Rectangle;
    private _walletText: TextBlock;
    private _balanceText: TextBlock;

    constructor(ui: UserInterface) {
        this._ui = ui;
        this._game = ui._game;

        this._createHUD();

        // Listen for wallet changes
        this._game.walletManager.onChange((state) => {
            this._updateDisplay();
        });

        // Initial update
        this._updateDisplay();
    }

    private _createHUD() {
        // Container in top-left
        const container = new Rectangle("solanaHUD");
        container.width = "260px";
        container.height = "80px";
        container.top = "15px";
        container.left = "15px";
        container.background = "rgba(10, 10, 30, 0.7)";
        container.thickness = 1;
        container.color = "rgba(153, 69, 255, 0.4)";
        container.cornerRadius = 6;
        container.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._ui.MAIN_ADT.addControl(container);
        this._container = container;

        // Wallet address line
        const walletText = new TextBlock("walletAddr", "Guest Mode");
        walletText.color = "#00FFA3";
        walletText.fontSize = 11;
        walletText.height = "20px";
        walletText.top = "8px";
        walletText.left = "10px";
        walletText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        walletText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        walletText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        container.addControl(walletText);
        this._walletText = walletText;

        // Balance line
        const balanceText = new TextBlock("solBalance", "");
        balanceText.color = "#9945FF";
        balanceText.fontSize = 12;
        balanceText.fontWeight = "bold";
        balanceText.height = "20px";
        balanceText.top = "28px";
        balanceText.left = "10px";
        balanceText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        balanceText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        balanceText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        container.addControl(balanceText);
        this._balanceText = balanceText;

        // Trade button
        const tradeBtn = Button.CreateSimpleButton("tradeBtn", "💰 Trade");
        tradeBtn.width = "80px";
        tradeBtn.height = "24px";
        tradeBtn.color = "#FFD700";
        tradeBtn.fontSize = 11;
        tradeBtn.background = "rgba(255, 215, 0, 0.15)";
        tradeBtn.thickness = 1;
        tradeBtn.cornerRadius = 4;
        tradeBtn.top = "-8px";
        tradeBtn.left = "10px";
        tradeBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        tradeBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        container.addControl(tradeBtn);

        tradeBtn.onPointerDownObservable.add(() => {
            this._showTradeModal();
        });
    }

    private _updateDisplay() {
        const ws = this._game.walletManager.state;
        if (ws.connected && ws.publicKey) {
            this._walletText.text = "Connected: " + this._game.walletManager.shortAddress;
            this._balanceText.text = "◎ " + ws.balance.toFixed(4) + " SOL";
        } else if (ws.isGuest) {
            this._walletText.text = "🎮 Guest Mode";
            this._balanceText.text = "";
        } else {
            this._walletText.text = "Not connected";
            this._balanceText.text = "";
        }
    }

    private _showTradeModal() {
        // Create a simple modal
        const overlay = new Rectangle("tradeOverlay");
        overlay.width = 1;
        overlay.height = 1;
        overlay.background = "rgba(0,0,0,0.6)";
        overlay.thickness = 0;
        overlay.zIndex = 100;
        this._ui.MAIN_ADT.addControl(overlay);

        const modal = new Rectangle("tradeModal");
        modal.width = "350px";
        modal.height = "200px";
        modal.background = "rgba(10, 10, 40, 0.95)";
        modal.thickness = 1;
        modal.color = "rgba(153, 69, 255, 0.5)";
        modal.cornerRadius = 10;
        modal.zIndex = 101;
        this._ui.MAIN_ADT.addControl(modal);

        const title = new TextBlock("tradeTitle", "💰 On-Chain Marketplace");
        title.color = "#FFD700";
        title.fontSize = 18;
        title.fontWeight = "bold";
        title.height = "30px";
        title.top = "20px";
        title.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        modal.addControl(title);

        const desc = new TextBlock("tradeDesc", "Coming soon — trade items, wager SOL\nin PvP battles, and mint rare loot as NFTs.\n\nStay tuned for the on-chain marketplace!");
        desc.color = "rgba(255,255,255,0.7)";
        desc.fontSize = 13;
        desc.height = "80px";
        desc.top = "10px";
        desc.textWrapping = true;
        modal.addControl(desc);

        const closeBtn = Button.CreateSimpleButton("closeTradeBtn", "Close");
        closeBtn.width = "100px";
        closeBtn.height = "30px";
        closeBtn.color = "white";
        closeBtn.fontSize = 12;
        closeBtn.background = "rgba(153, 69, 255, 0.4)";
        closeBtn.thickness = 1;
        closeBtn.cornerRadius = 5;
        closeBtn.top = "-15px";
        closeBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        modal.addControl(closeBtn);

        closeBtn.onPointerDownObservable.add(() => {
            this._ui.MAIN_ADT.removeControl(overlay);
            this._ui.MAIN_ADT.removeControl(modal);
        });

        overlay.onPointerDownObservable.add(() => {
            this._ui.MAIN_ADT.removeControl(overlay);
            this._ui.MAIN_ADT.removeControl(modal);
        });
    }
}
