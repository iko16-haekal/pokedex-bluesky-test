import React from "react"
import Image from "next/image"
import Link from "next/link"
import { formatNumberWithLeadingZero } from "../utils/common"

const PokemonCard = ({ pokemon, index }) => {
  const pokemonId = pokemon?.url?.slice(0, -1)?.split("/")?.pop()
  const pokeIndex = formatNumberWithLeadingZero(pokemonId)

  return (
    <Link href={`/pokemon/detail/${pokemon.name}`}>
      <div className="bg-slate-900 rounded-md p-5 flex flex-col justify-center items-center relative">
        <span className="absolute text-5xl text-slate-500 top-0 right-3 font-bold">
          #{pokeIndex}
        </span>
        <Image
          alt={pokemon.name}
          width={150}
          height={150}
          src={`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${pokeIndex}.png`}
        />
        <span className="uppercase font-semibold tracking-wider text-amber-400">
          {pokemon.name}
        </span>
      </div>
    </Link>
  )
}

export default PokemonCard
