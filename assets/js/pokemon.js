function generateStatsHTML(stats) {
    const nameMap = {
        hp: 'HP',
        attack: 'Attack',
        defense: 'Defense',
        'special-attack': 'Sp. Atk',
        'special-defense': 'Sp. Def',
        speed: 'Speed'
    }

    return `
        <ul class="stats-list">
            ${stats.map(stat => {
        const statName = nameMap[stat.name] || stat.name
        const value = stat.value
        const maxStat = 255
        const percentage = (value / maxStat) * 100

        let colorClass = ''
        if (value < 60) {
            colorClass = 'bar-red'
        } else if (value < 100) {
            colorClass = 'bar-yellow'
        } else {
            colorClass = 'bar-green'
        }

        return `
                    <li class="stat-item">
                        <span class="stat-name">${statName}</span>
                        <span class="stat-value">${value}</span>
                        <div class="stat-bar-container">
                            <div class="stat-bar ${colorClass}" style="width: ${percentage}%"></div>
                        </div>
                    </li>
                `
    }).join('')}
        </ul>
    `
}

function generateTopMovesHTML(moves) {
    return `
        <div class="moves-columns">
            ${moves.map(move => `
                <div class="move-item">
                    <h4 class="move-name">${move.name}</h4>
                    <ul class="move-details">
                        <li><strong>Power:</strong> ${move.power || '—'}</li>
                        <li><strong>Accuracy:</strong> ${move.accuracy || '—'}</li>
                        <li><strong>Type:</strong> ${move.type}</li>
                        <li><strong>PP:</strong> ${move.pp}</li>
                        <li><strong>Effect:</strong> ${move.effect}</li>
                    </ul>
                </div>
            `).join('')}
        </div>
    `
}

async function renderEvolutionChain(evolutions) {
    const container = document.getElementById('evolution-list')
    if (!container) return

    container.innerHTML = ''

    for (const name of evolutions) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
            const data = await response.json()

            const stage = document.createElement('div')
            stage.className = 'evolution-stage'

            stage.innerHTML = `
          <img src="${data.sprites.other['official-artwork'].front_default}" alt="${name}">
          <span>${data.name}</span>
        `
            container.appendChild(stage)
        } catch (error) {
            console.error('[ERROR] Failed to find evolution:', error)
        }
    }
}

function renderLocations(locations) {
    const list = document.getElementById('location-list')
    if (!list) return

    list.innerHTML = ''

    if (locations.length === 0 || (locations.length === 1 && locations[0] === 'Location unknown')) {
        const li = document.createElement('li')
        li.textContent = 'No known wild locations.'
        list.appendChild(li)
        return
    }

    locations.forEach(location => {
        const li = document.createElement('li')
        li.textContent = location
        list.appendChild(li)
    })
}

async function loadPokemonDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonName = urlParams.get('name');

    if (!pokemonName) return;

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const pokeDetail = await res.json();
        const pokemon = await convertPokeApiDetailToPokemon(pokeDetail);

        // Aguarda os dados dos top moves
        const topMoves = await getTopMovesWithDetails(pokemon.moves);

        const heightInMeters = (pokemon.height / 10).toFixed(1) + ' m';
        const weightInKg = (pokemon.weight / 10).toFixed(1) + ' kg';

        const pokemonContent = document.querySelector('.content-pokemon');

        pokemonContent.innerHTML = `
        <main class="main">
            <section class="content-pokemon ${pokemon.type}">
                <section class="header">
                    <div class="top-bar">
                        <i class="fa-solid fa-arrow-left back"></i>
                    </div>
                    <div class="detail">
                        <div class="detail-left">
                            <h1 class="name">${pokemon.name}</h1>
                            <ol class="types">
                                ${pokemon.types.map((type) => `<li class="type card-${type}">${type}</li>`).join('')}
                            </ol>
                        </div>
                        <span class="number">#${pokemon.number.toString().padStart(3, '0')}</span>
                    </div>

                    <img class="pokemon-img" src="${pokemon.photo}" alt="${pokemon.name}" />
                </section>

                <section class="tabs-container">
                    <ul class="tabs">
                        <li class="tab active" data-tab="about">About</li>
                        <li class="tab" data-tab="stats">Stats</li>
                        <li class="tab" data-tab="moves">Moves</li>
                        <li class="tab" data-tab="evolution">Evolution</li>
                        <li class="tab" data-tab="location">Location</li>
                    </ul>

                    <div class="tab-contents">
                        <div class="tab-content active" id="about">
                            <p class="description">
                                ${pokemon.description}
                            </p>

                            <ul class="info-list">
                                <li><strong>Specie:</strong> ${pokemon.specie.replace(/ Pokémon$/i, '')}</li>
                                <li><strong>Height:</strong> ${heightInMeters}</li>
                                <li><strong>Weight:</strong> ${weightInKg}</li>
                                <li><strong>Abilities:</strong> ${pokemon.abilities
                    .map(ability => ability.charAt(0).toUpperCase() + ability.slice(1))
                    .join(', ')}</li>
                            </ul>
                        </div>

                        <div class="tab-content" id="stats">
                            ${generateStatsHTML(pokemon.stats)}
                        </div>

                        <div class="tab-content" id="moves">
                            <p class="description">Top ${topMoves.length} strongest moves of ${pokemon.name}:</p>
                            ${generateTopMovesHTML(topMoves)}
                        </div>

                        <div class="tab-content" id="evolution">
                            <h4>Evolutions</h4>
                            <div id="evolution-list" class="evolution-list"></div>
                        </div>

                        <div class="tab-content" id="location">
                            <h4>Location</h4>
                            <ul id="location-list" class="location-list"></ul>
                        </div>
                    </div>
                </section>
            </section>
        </main>
        `;

        pokemonContent.classList.remove('loading')

        renderEvolutionChain(pokemon.evolutions)

        renderLocations(pokemon.locations)

        // Botão de voltar
        document.querySelector('.back').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        // Tabs funcionando
        const tabs = document.querySelectorAll(".tab");
        const contents = document.querySelectorAll(".tab-content");

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const target = tab.getAttribute("data-tab");

                tabs.forEach((t) => t.classList.remove('active'));
                contents.forEach((c) => c.classList.remove('active'));

                tab.classList.add('active');
                document.getElementById(target).classList.add('active');
            });
        });

    } catch (err) {
        console.error('ERROR] Failed to load Pokémon details:', error);
    }
}

loadPokemonDetails()