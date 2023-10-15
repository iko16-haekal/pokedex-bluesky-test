import dynamic from "next/dynamic"

import { useState, useMemo } from "react"

import SearchInput from "../../components/search-input"
import InputSelect from "../../components/select-input"
import TypeSelect from "../../components/select-type"

const PokemonCard = dynamic(() => import("../../components/pokemon-card"))

export default function Home({ initialPokemon, pokemonType, typeList }) {
  const [keyword, setKeyword] = useState("")
  const [sortBy, setSortBy] = useState("default")

  const filteredPokemonData = useMemo(() => {
    const tempData = initialPokemon?.pokemon?.filter((data) =>
      data?.pokemon?.name?.toLowerCase()?.includes(keyword?.toLowerCase())
    )

    console.log(tempData, "ahoy")

    if (sortBy !== "default") {
      const compareNames = (a, b) => {
        return a.pokemon.name.localeCompare(b?.pokemon?.name)
      }

      const sortingBehaviors = {
        ascending: (array) => [...array].sort(compareNames),
        descending: (array) => [...array].sort(compareNames).reverse(),
      }

      return sortingBehaviors[sortBy](tempData)
    }

    return tempData
  }, [initialPokemon, keyword, sortBy])

  const sortOptions = [
    {
      label: "default",
      value: "default",
    },
    {
      label: "Ascending",
      value: "ascending",
    },
    {
      label: "Descending",
      value: "descending",
    },
  ]

  return (
    <div className="w-full h-full px-16">
      <div className="py-3 flex gap-3">
        <SearchInput
          value={keyword}
          onChange={(event) => setKeyword(event?.target?.value)}
          placeholder="Search pokemon name"
        />

        <div className="w-36">
          <TypeSelect typeList={typeList} pokemonType={pokemonType} />
        </div>

        <div className="w-36">
          <InputSelect
            onChange={(event) => setSortBy(event?.target?.value)}
            options={sortOptions}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-10 w-full">
        {filteredPokemonData?.map((monster, index) => (
          <PokemonCard
            key={monster?.name}
            pokemon={monster?.pokemon}
            index={index + 1}
          />
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const pokemonType = context?.params?.type || "ice"

  try {
    const responsePokemonList = await fetch(
      `https://pokeapi.co/api/v2/type/${pokemonType}?limit=1000`
    )
    const initialPokemon = await responsePokemonList?.json()

    const responseTypeList = await fetch(`https://pokeapi.co/api/v2/type`)
    const typeList = await responseTypeList?.json()

    return {
      props: {
        pokemonType,
        initialPokemon,
        typeList,
      },
    }
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
    }
  }
}
