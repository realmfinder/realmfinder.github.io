function submitRequirements() {

    document.getElementById("realms").innerHTML = '';
    
    max_rems = parseInt(document.getElementById("max-rems").value);
    max_players = parseInt(document.getElementById("max-players").value);

    min_rems = parseInt(document.getElementById("min-rems").value);
    min_players = parseInt(document.getElementById("min-players").value);

    let used_uuids = [];
    
    const URL = "https://realmstock.network/Public/EventHistory";
    const Http = new XMLHttpRequest();
    Http.open("GET", URL);
    Http.send();

    Http.onreadystatechange = () => {
        let all_realms = Http.responseText.split('\n');
        for (const realm of all_realms) {
            let parts = realm.split('|');
            let realm_realm = parts[1];
            let realm_server = parts[2];
            let realm_players = parseInt(parts[3]);
            let realm_rems = parseInt(parts[4]);
            let realm_uuid = realm_server+'||'+realm_realm;
            if (realm_rems <= max_rems && realm_rems >= min_rems && realm_players <= max_players && realm_players >= min_players && realm_rems != 0 && !used_uuids.includes(realm_uuid)) {
                used_uuids.push(realm_uuid)
                let tag = document.createElement("p");
                let text = document.createTextNode(`${realm_server} ${realm_realm}: ${realm_players}/85, ${realm_rems} rems.`);
                tag.appendChild(text);
                document.getElementById("realms").appendChild(tag);
            }
        }
    }

}

document.getElementById("submit").onclick = submitRequirements;