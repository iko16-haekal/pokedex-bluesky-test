import { useRouter } from "next/router"
import { useState, useMemo } from "react"
import PokemonCard from "../../components/pokemon-card"
import SearchInput from "../../components/search-input"
import TypeSelect from "../../components/select-type"

export default function Home({ initialPokemon, pokemonType, typeList }) {
  const [keyword, setKeyword] = useState("")

  const filteredPokemonData = useMemo(() => {
    return initialPokemon?.pokemon?.filter((data) =>
      data?.pokemon?.name?.toLowerCase()?.includes(keyword?.toLowerCase())
    )
  }, [initialPokemon, keyword])

  const router = useRouter()
  return (
    <div className="w-full h-full px-16">
      <div className="py-3 flex gap-3">
        <SearchInput
          value={keyword}
          onChange={(event) => setKeyword(event?.target?.value)}
          placeholder="Search pokemon name"
        />

        <div className="w-30">
          <TypeSelect typeList={typeList} pokemonType={pokemonType} />
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
}
