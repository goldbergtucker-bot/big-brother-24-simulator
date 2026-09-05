let houseguests = [];

let currentWeek = 1;

let currentHOH = null;

let nominees = [];

let vetoWinner = null;

let seasonHistory = [];



function createDefaultCast() {

    houseguests = [];

    for (let i = 1; i <= 16; i++) {

        houseguests.push({

            id: i,

            name: "Houseguest " + i,

            image:
                "https://via.placeholder.com/400x400?text=Houseguest+" + i,

            physical: 5,

            mental: 5,

            endurance: 5,

            social: 5,

            strategic: 5,

            loyalty: 5,

            popularity: 5,

            active: true,

            HOHWins: 0,

            POVWins: 0

        });

    }

}
function renderCast() {

    const container =
        document.getElementById("castContainer");

    container.innerHTML = "";


    houseguests.forEach((player, index) => {

        const card =
            document.createElement("div");

        card.className =
            "houseguest-card";


        card.innerHTML = `

            <img
                src="${player.image}"
                alt="${player.name}"
            >


            <input

                value="${player.name}"

                placeholder="Houseguest Name"

                onchange="
                    updatePlayer(
                        ${index},
                        'name',
                        this.value
                    )
                "

            >


            <input

                value="${player.image}"

                placeholder="Direct Imgur Image URL"

                onchange="
                    updatePlayer(
                        ${index},
                        'image',
                        this.value
                    )
                "

            >


            <h3>Competition Stats</h3>

            ${createStatInput(
                index,
                "physical",
                player.physical
            )}

            ${createStatInput(
                index,
                "mental",
                player.mental
            )}

            ${createStatInput(
                index,
                "endurance",
                player.endurance
            )}


            <h3>Game Stats</h3>

            ${createStatInput(
                index,
                "social",
                player.social
            )}

            ${createStatInput(
                index,
                "strategic",
                player.strategic
            )}

            ${createStatInput(
                index,
                "loyalty",
                player.loyalty
            )}

            ${createStatInput(
                index,
                "popularity",
                player.popularity
            )}


            <button
                onclick="removeHouseguest(${index})"
            >

                Remove Houseguest

            </button>

        `;


        container.appendChild(card);

    });

}
function createStatInput(
    index,
    stat,
    value
) {

    return `

        <div class="stat-label">

            <label>

                ${stat.toUpperCase()}

            </label>


            <input

                type="number"

                min="1"

                max="10"

                value="${value}"

                onchange="
                    updatePlayer(
                        ${index},
                        '${stat}',
                        this.value
                    )
                "

            >

        </div>

    `;

}



function updatePlayer(
    index,
    property,
    value
) {

    if (
        property !== "name" &&
        property !== "image"
    ) {

        value = Number(value);


        if (value < 1) {

            value = 1;

        }


        if (value > 10) {

            value = 10;

        }

    }


    houseguests[index][property] =
        value;


    renderCast();

}
function addHouseguest() {

    houseguests.push({

        id: Date.now(),

        name: "New Houseguest",

        image:
            "https://via.placeholder.com/400x400?text=New+Houseguest",

        physical: 5,

        mental: 5,

        endurance: 5,

        social: 5,

        strategic: 5,

        loyalty: 5,

        popularity: 5,

        active: true,

        HOHWins: 0,

        POVWins: 0

    });


    renderCast();

}



function removeHouseguest(index) {

    houseguests.splice(index, 1);

    renderCast();

}
function saveCast() {

    localStorage.setItem(

        "BB24CustomCast",

        JSON.stringify(houseguests)

    );


    alert(
        "Your Big Brother cast has been saved!"
    );

}



function loadCast() {

    const savedCast =
        localStorage.getItem(
            "BB24CustomCast"
        );


    if (savedCast) {

        houseguests =
            JSON.parse(savedCast);


        renderCast();


        alert(
            "Your saved cast has been loaded!"
        );

    }

    else {

        alert(
            "No saved cast was found."
        );

    }

}



function resetCast() {

    const confirmReset =
        confirm(
            "Are you sure you want to reset the cast?"
        );


    if (confirmReset) {

        createDefaultCast();

        renderCast();

    }

}
function getActivePlayers() {

    return houseguests.filter(
        player => player.active
    );

}
Physical: 10
Physical: 2
function weightedWinner(
    players,
    stat
) {

    let total = 0;


    players.forEach(player => {

        total +=
            Number(player[stat]);

    });


    let random =
        Math.random() * total;


    for (let player of players) {

        random -=
            Number(player[stat]);


        if (random <= 0) {

            return player;

        }

    }


    return players[0];

}
function runHOH() {

    let players =
        getActivePlayers();


    if (players.length < 2) {

        alert(
            "Not enough houseguests!"
        );

        return;

    }


    const competitions = [

        {
            name: "Physical Competition",

            stat: "physical"
        },

        {
            name: "Mental Competition",

            stat: "mental"
        },

        {
            name: "Endurance Competition",

            stat: "endurance"
        }

    ];


    const competition =

        competitions[
            Math.floor(
                Math.random() *
                competitions.length
            )
        ];


    currentHOH =
        weightedWinner(
            players,
            competition.stat
        );


    currentHOH.HOHWins++;


    document.getElementById(
        "hohResult"
    ).innerHTML = `

        <h3>
            Competition:
            ${competition.name}
        </h3>

        <h2>
            👑 ${currentHOH.name}
        </h2>

        <p>
            is the new Head of Household!
        </p>

    `;

}
function runNominations() {

    if (!currentHOH) {

        alert(
            "You need an HOH first!"
        );

        return;

    }


    const possibleNominees =

        getActivePlayers().filter(

            player =>
                player.id !== currentHOH.id

        );


    possibleNominees.sort(
        (a, b) => {

            const scoreA =

                a.strategic +
                (10 - a.loyalty) +
                Math.random() * 5;


            const scoreB =

                b.strategic +
                (10 - b.loyalty) +
                Math.random() * 5;


            return scoreB - scoreA;

        }
    );


    nominees = [

        possibleNominees[0],

        possibleNominees[1]

    ];


    document.getElementById(
        "nominationResult"
    ).innerHTML = `

        <h3>
            ${currentHOH.name}
            has nominated:
        </h3>


        <h2>
            🔴 ${nominees[0].name}
        </h2>


        <h2>
            🔴 ${nominees[1].name}
        </h2>

    `;

}
function runVeto() {

    if (nominees.length !== 2) {

        alert(
            "Nominations must happen first!"
        );

        return;

    }


    const players =
        getActivePlayers();


    const competitions = [

        {
            name: "Physical POV",

            stat: "physical"
        },

        {
            name: "Mental POV",

            stat: "mental"
        },

        {
            name: "Endurance POV",

            stat: "endurance"
        }

    ];


    const competition =

        competitions[
            Math.floor(
                Math.random() *
                competitions.length
            )
        ];


    vetoWinner =
        weightedWinner(
            players,
            competition.stat
        );


    vetoWinner.POVWins++;


    document.getElementById(
        "vetoResult"
    ).innerHTML = `

        <h3>
            Competition:
            ${competition.name}
        </h3>


        <h2>
            🏆 ${vetoWinner.name}
        </h2>


        <p>
            has won the Power of Veto!
        </p>

    `;

}
function runVetoCeremony() {

    if (!vetoWinner) {

        alert(
            "Play the POV competition first!"
        );

        return;

    }


    let vetoUsed = false;


    if (
        nominees.includes(vetoWinner)
    ) {

        vetoUsed = true;

    }


    if (vetoUsed) {

        const savedPlayer =
            vetoWinner;


        nominees =
            nominees.filter(

                player =>
                    player.id !==
                    savedPlayer.id

            );


        const replacements =

            getActivePlayers().filter(

                player =>

                    player.id !==
                    currentHOH.id &&

                    player.id !==
                    savedPlayer.id &&

                    !nominees.includes(player)

            );


        const replacement =

            weightedWinner(
                replacements,
                "strategic"
            );


        nominees.push(replacement);


        document.getElementById(
            "vetoCeremonyResult"
        ).innerHTML = `

            <h2>
                🏆 POV USED!
            </h2>


            <p>
                ${vetoWinner.name}
                saved themselves!
            </p>


            <h2>
                🔴 Replacement:
                ${replacement.name}
            </h2>

        `;

    }


    else {

        document.getElementById(
            "vetoCeremonyResult"
        ).innerHTML = `

            <h2>
                🚫 POV NOT USED
            </h2>


            <p>
                The nominations remain the same.
            </p>

        `;

    }

}
function runEviction() {

    if (nominees.length !== 2) {

        alert(
            "There must be two nominees!"
        );

        return;

    }


    const voters =

        getActivePlayers().filter(

            player =>

                player.id !== nominees[0].id &&

                player.id !== nominees[1].id &&

                player.id !== currentHOH.id

        );


    let votesAgainstOne = 0;

    let votesAgainstTwo = 0;


    voters.forEach(voter => {

        const scoreOne =

            nominees[0].popularity +

            Math.random() *
            nominees[0].social;


        const scoreTwo =

            nominees[1].popularity +

            Math.random() *
            nominees[1].social;


        if (scoreOne > scoreTwo) {

            votesAgainstTwo++;

        }

        else {

            votesAgainstOne++;

        }

    });


    let evicted;


    if (
        votesAgainstOne >
        votesAgainstTwo
    ) {

        evicted = nominees[0];

    }

    else {

        evicted = nominees[1];

    }


    evicted.active = false;


    seasonHistory.push({

        week: currentWeek,

        HOH: currentHOH.name,

        nominees:

            nominees.map(
                player => player.name
            ),

        veto: vetoWinner.name,

        evicted: evicted.name

    });


    document.getElementById(
        "evictionResult"
    ).innerHTML = `

        <h2>
            🚪 ${evicted.name}
            has been evicted!
        </h2>


        <p>
            Vote:
            ${votesAgainstOne}
            -
            ${votesAgainstTwo}
        </p>

    `;


    renderResults();

}
function renderResults() {

    const container =

        document.getElementById(
            "resultsContainer"
        );


    if (
        seasonHistory.length === 0
    ) {

        container.innerHTML =
            "<p>No evictions yet.</p>";

        return;

    }


    container.innerHTML = "";


    seasonHistory.forEach(result => {

        container.innerHTML += `

            <hr>


            <h3>
                Week ${result.week}
            </h3>


            <p>
                👑 HOH:
                ${result.HOH}
            </p>


            <p>
                🔴 Nominees:
                ${result.nominees.join(" and ")}
            </p>


            <p>
                🏆 POV:
                ${result.veto}
            </p>


            <p>
                🚪 Evicted:
                ${result.evicted}
            </p>

        `;

    });

}
function nextWeek() {

    currentWeek++;


    currentHOH = null;

    nominees = [];

    vetoWinner = null;


    document.getElementById(
        "weekTitle"
    ).textContent =
        "Week " + currentWeek;


    document.getElementById(
        "hohResult"
    ).innerHTML = "";


    document.getElementById(
        "nominationResult"
    ).innerHTML = "";


    document.getElementById(
        "vetoResult"
    ).innerHTML = "";


    document.getElementById(
        "vetoCeremonyResult"
    ).innerHTML = "";


    document.getElementById(
        "evictionResult"
    ).innerHTML = "";


    updateTwistInfo();

}
function updateTwistInfo() {

    let twist;


    if (currentWeek === 1) {

        twist =
            "BB24 Twist: The game begins with Festie Besties!";

    }


    else if (
        currentWeek >= 2 &&
        currentWeek <= 4
    ) {

        twist =
            "Festie Besties Twist is currently active.";

    }


    else if (currentWeek === 5) {

        twist =
            "The Festie Besties Twist has ended.";

    }


    else {

        twist =
            "Standard Big Brother gameplay.";

    }


    document.getElementById(
        "twistInfo"
    ).textContent =
        "Twist: " + twist;

}
function showPage(
    pageId,
    button
) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove(
                "active"
            );

        });


    document
        .querySelectorAll(".tab-button")
        .forEach(tab => {

            tab.classList.remove(
                "active"
            );

        });


    document
        .getElementById(pageId)
        .classList.add("active");


    button.classList.add("active");

}
createDefaultCast();

renderCast();

updateTwistInfo();

renderResults();
