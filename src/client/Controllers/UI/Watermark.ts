import { Rectangle } from "@babylonjs/gui/2D/controls/rectangle";
import { TextBlock } from "@babylonjs/gui/2D/controls/textBlock";
import { Image } from "@babylonjs/gui/2D/controls/image";
import { UserInterface } from "../UserInterface";
import { Control } from "@babylonjs/gui/2D/controls/control";

export class Watermark {
    private _ui: UserInterface;

    public _bloc;

    constructor(ui) {
        this._ui = ui;

        const columnRect = new Rectangle("column");
        columnRect.widthInPixels = 250;
        columnRect.heightInPixels = 250;
        columnRect.background = "transparent";
        columnRect.thickness = 0;
        columnRect.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        columnRect.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        columnRect.isVisible = false;

        this._ui.MAIN_ADT.addControl(columnRect);
        this._bloc = columnRect;

        // SolRealm text watermark
        const watermarkText = new TextBlock("watermarkText", "⚔️ SOLREALM");
        watermarkText.color = "#9945FF";
        watermarkText.fontSize = 28;
        watermarkText.fontWeight = "bold";
        watermarkText.height = "50px";
        watermarkText.top = "20px";
        watermarkText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        columnRect.addControl(watermarkText);

        const subText = new TextBlock("watermarkSub", "solrealm.gg");
        subText.color = "rgba(153, 69, 255, 0.6)";
        subText.fontSize = 14;
        subText.height = "25px";
        subText.top = "60px";
        subText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        columnRect.addControl(subText);
    }
}
