const pokeApi = {}

async function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()

    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    pokemon.types = types
    pokemon.type = types[0] // tipo principal

    // Imagem (fallback se não houver imagem no dream_world)
    pokemon.photo = pokeDetail.sprites.other['official-artwork'].front_default

    pokemon.height = pokeDetail.height  // altura em decímetros
    pokemon.weight = pokeDetail.weight  // peso em hectogramas

    const abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name)
    pokemon.abilities = abilities
    pokemon.ability = abilities[0]  // habilidade principal

    pokemon.stats = pokeDetail.stats.map((stat) => ({
        name: stat.stat.name,
        value: stat.base_stat
    }))

    pokemon.moves = pokeDetail.moves

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokeDetail.id}/`)
        const speciesData = await response.json()

        const specieObj = speciesData.genera.find(g => g.language.name === 'en')
        const descriptionObj = speciesData.flavor_text_entries.find(f => f.language.name === 'en')

        pokemon.specie = specieObj ? specieObj.genus : 'Unknown'
        pokemon.description = descriptionObj ? descriptionObj.flavor_text.replace(/\f/g, ' ') : 'No description found.'
    } catch (error) {
        console.error(`Erro ao buscar espécie do Pokémon ${pokemon.name}:`, error)
        pokemon.specie = 'Unknown'
        pokemon.description = 'No description found.'
    }

    return pokemon
}

async function getTopMovesWithDetails(moves) {
    const moveDetails = []

    for (let i = 0; i < moves.length; i++) {
        const moveUrl = moves[i].move.url
        try {
            const res = await fetch(moveUrl)
            const data = await res.json()

            if (data.power !== null) {
                moveDetails.push({
                    name: data.name,
                    power: data.power,
                    accuracy: data.accuracy,
                    pp: data.pp,
                    type: data.type.name,
                    effect: data.effect_entries.find(e => e.language.name === 'en')?.short_effect || 'No effect found.'
                })
            }
        } catch (err) {
            console.error(`Erro ao buscar dados do move:`, err)
        }
    }

    // Ordenar por poder (power) decrescente
    moveDetails.sort((a, b) => b.power - a.power)

    // Retorna os 2 primeiros
    return moveDetails.slice(0, 2)
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 2) => {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
        .catch((error) => console.error(error))
}
