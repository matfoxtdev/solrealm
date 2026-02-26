import State from "../client/Screens/Screens";

class Config {
    // general settings
    title = "SolRealm";
    version = "Version 1.0.0";
    lang = "en";

    // server settings
    port = 3000;
    maxClients = 20;
    updateRate = 100;
    databaseUpdateRate = 10000;
    logLevel = "info";
    database = "sqllite";

    // solana settings
    solanaNetwork: "devnet" | "mainnet-beta" = "devnet";
    solanaRpcUrl = "https://api.devnet.solana.com";

    // game settings
    PLAYER_NAMEPLATE_TIMEOUT = 15000;
    PLAYER_VIEW_DISTANCE = 30;
    PLAYER_LOSE_FOCUS_DISTANCE = 24;
    PLAYER_GRACE_PERIOD = 0;
    PLAYER_INTERACTABLE_DISTANCE = 5;
    PLAYER_INVENTORY_SPACE = 23;
    PLAYER_HOTBAR_SIZE = 9;
    COMBAT_SPEED = 1000;

    // enemies settings
    MONSTER_RESPAWN_RATE = 20000;
    MONSTER_CHASE_PERIOD = 4000;
    MONSTER_AGGRO_DISTANCE = 6;
    MONSTER_ATTACK_DISTANCE = 2;

    // ui theme settings
    UI_CENTER_PANEL_WIDTH = 0.6;
    UI_CENTER_PANEL_BG = "rgba(0,0,0,.7)";
    UI_SIDEBAR_WIDTH = "380px;";
    UI_PRIMARY_COLOR = "rgba(153, 69, 255, 0.8)";
    UI_ACCENT_COLOR = "rgba(0, 255, 163, 0.8)";
    UI_NEON_GLOW = "rgba(153, 69, 255, 0.4)";

    //
    SHADOW_ON = true;

    // default location
    initialLocation = "lh_town";
}

export { Config };
