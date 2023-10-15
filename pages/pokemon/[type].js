import dynamic from "next/dynamic"
import { useRouter } from "next/router"

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

  const router = useRouter()

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
      <div className="py-3 flex items-center gap-3">
        <SearchInput
          value={keyword}
          onChange={(event) => setKeyword(event?.target?.value)}
          placeholder="Search pokemon name"
        />

        <div className="w-80">
          <TypeSelect typeList={typeList} pokemonType={pokemonType} />
        </div>

        <div className="w-80">
          <InputSelect
            onChange={(event) => setSortBy(event?.target?.value)}
            options={sortOptions}
          />
        </div>
      </div>
      <div className="w-60 py-2">
        <button
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={() => router?.push("/pokemon/compare")}
        >
          Compare Pokemon Stats
        </button>
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
