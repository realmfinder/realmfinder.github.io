function add_realm(server, realm, players, rems) {

    let realms = document.getElementById("results");

    let new_realm = document.createElement('div');

    let realm_basic = document.createElement('div');
    let realm_extra = document.createElement('div');

    let server_label_label = document.createElement('text');
    let server_label = document.createElement('text');
    let realm_label_label = document.createElement('text');
    let realm_label = document.createElement('text');

    let player_info = document.createElement('div');
    let rems_info = document.createElement('div');

    let players_label = document.createElement('text');
    let players_label_label = document.createElement('text');
    let rems_label = document.createElement('text');
    let rems_label_label = document.createElement('text');

    new_realm.className = "realm";

    realm_basic.className = "realm-basic";
    realm_extra.className = "realm-extra";

    server_label_label.className = "realm-basic-text-label";
    server_label.className = "realm-basic-text";
    realm_label_label.className = "realm-basic-text-label";
    realm_label.className = "realm-basic-text";

    player_info.className = "realm-extra-row";
    rems_info.className = "realm-extra-row";

    players_label.className = "realm-extra-text";
    players_label_label.className = "realm-extra-text-label";
    rems_label.className = "realm-extra-text";
    rems_label_label.className = "realm-extra-text-label";

    server_label_label.innerHTML = "server";
    server_label.innerHTML = server;
    realm_label_label.innerHTML = "realm";
    realm_label.innerHTML = realm;

    players_label.innerHTML = players;
    players_label_label.innerHTML = "/85 players";
    rems_label.innerHTML = rems;
    rems_label_label.innerHTML = " remaining heroes";

    realm_basic.appendChild(server_label_label);
    realm_basic.appendChild(server_label);
    realm_basic.appendChild(realm_label_label);
    realm_basic.appendChild(realm_label);

    player_info.appendChild(players_label);
    player_info.appendChild(players_label_label);

    rems_info.appendChild(rems_label);
    rems_info.appendChild(rems_label_label);

    realm_extra.appendChild(player_info);
    realm_extra.appendChild(rems_info);

    new_realm.appendChild(realm_basic);
    new_realm.appendChild(realm_extra);

    realms.appendChild(new_realm);
}

async function get_realm_data() {
    let request = await fetch("https://realmstock.network/Public/EventHistory");
    let response = await request.text();
    return response
}

function parse_realm_data(string_data) {
    let realms = string_data.split("\n").filter((realm) => realm.trim() != "")
    let parsed = realms.map((realm) => {
        let parts = realm.split('|')
        if (parts[3] == '?') {
            parts[3] = 0;
        }
        if (parts[4] == '?') {
            parts[4] = 0;
        }
        return {
            server: parts[2],
            realm: parts[1],
            players: parseInt(parts[3]),
            rems: parseInt(parts[4])
        }
    })
    let final = [];
    let used_realms = [];
    for (const realm of parsed) {
        if (!used_realms.includes(`${realm.server} ${realm.realm}`)) {
            used_realms.push(`${realm.server} ${realm.realm}`);
            final.push(realm);
        }
    }
    return final;
}

function filter_realm_data(data, max_rems, min_rems, max_players, min_players) {
    return data.filter((realm) => {
        return (realm.rems <= max_rems) && (realm.rems >= min_rems) && (realm.players <= max_players) && (realm.players >= min_players)
    })
}

function show_realms(realms) {
    document.getElementById("results").innerHTML = '';
    realms.map((realm) => {
        add_realm(realm.server, realm.realm, realm.players, realm.rems);
    })
}

async function find_realms() {
    let max_rems = parseInt(document.getElementById("maxrems").value);
    let min_rems = parseInt(document.getElementById("minrems").value);
    let max_players = parseInt(document.getElementById("maxplayers").value);
    let min_players = parseInt(document.getElementById("minplayers").value);
    let realm_data = parse_realm_data(await get_realm_data());
    show_realms(filter_realm_data(
        realm_data,
        max_rems,
        min_rems,
        max_players,
        min_players
    ))
}

document.getElementById("find").addEventListener("click", find_realms);
