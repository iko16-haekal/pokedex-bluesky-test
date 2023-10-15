import Image from "next/image"
import { useRouter } from "next/router"
import { useState, useEffect, useCallback, useMemo } from "react"
import InputSelect from "../../../components/select-input"

const fetchPokemon = async (name) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
  const data = await response.json()
  return data
}

const CompareStat = ({ initialPokemon }) => {
  const [pokemon1, setPokemon1] = useState(null)
  const [pokemon2, setPokemon2] = useState(null)

  const [selectedPokemon1, setSelectedPokemon1] = useState("bulbasaur")
  const [selectedPokemon2, setSelectedPokemon2] = useState("charmander")

  useEffect(() => {
    fetchPokemon(selectedPokemon1).then((data) => setPokemon1(data))
    fetchPokemon(selectedPokemon2).then((data) => setPokemon2(data))
  }, [selectedPokemon1, selectedPokemon2])

  const router = useRouter()

  const pokemonListOptions = useMemo(
    () =>
      initialPokemon?.results?.map((data) => ({
        value: data?.name,
        label: data?.name,
      })),
    [initialPokemon]
  )

  const renderPokemon = useCallback(
    (pokemon, index) => {
      if (pokemon) {
        return (
          <div className="bg-slate-900 rounded p-5 w-[600px]">
            <div className="w-full h-[55px]">
              <InputSelect
                defaultValue={index === 1 ? selectedPokemon1 : selectedPokemon2}
                onChange={(event) =>
                  index === 1
                    ? setSelectedPokemon1(event?.target?.value)
                    : setSelectedPokemon2(event?.target?.value)
                }
                options={pokemonListOptions}
              />
            </div>
            <div>
              <div className="flex items-center gap-10 py-5">
                <Image
                  width="300"
                  height="300"
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                />
                <div className="flex flex-col gap-2 py-3 w-full">
                  <div className="bg-slate-900 rounded px-2">
                    name: {pokemon?.name}
                  </div>

                  <div className="bg-slate-900 rounded px-2">
                    height: {pokemon?.height}
                  </div>

                  <div className="bg-slate-900 rounded px-2">
                    weight: {pokemon?.weight}lbs.
                  </div>

                  <div className="bg-slate-900 rounded px-2">
                    id: #{pokemon?.id}
                  </div>
                </div>
              </div>
              {pokemon.stats.map((stat, index) => (
                <div key={index} className="bg-slate-700 my-2 rounded p-1">
                  <div
                    className="bg-slate-900 rounded px-2"
                    style={{
                      width:
                        stat.base_stat <= 100 ? `${stat.base_stat}%` : "100%",
                    }}
                  >
                    {stat.stat.name}: {stat.base_stat}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }
      return null
    },
    [pokemonListOptions, selectedPokemon1, selectedPokemon2]
  )

  return (
    <div className="w-full h-full flex flex-col gap-20">
      <div className="w-full flex justify-between px-24 pt-10">
        <p className="font-semibold text-4xl">Compare Pokemon Stats</p>
        <p
          className="font-semibold text-4xl cursor-pointer"
          onClick={() => router?.push("/pokemon/ice")}
        >
          X
        </p>
      </div>
      <div className="w-full h-full flex justify-center items-center">
        <div className="pokemon-container grid grid-cols-2 gap-6">
          {renderPokemon(pokemon1, 1)}
          {renderPokemon(pokemon2, 2)}
        </div>
      </div>
    </div>
  )
}

export default CompareStat

export async function getServerSideProps(context) {
  try {
    const responsePokemonList = await fetch(`https://pokeapi.co/api/v2/pokemon`)
    const initialPokemon = await responsePokemonList?.json()

    return {
      props: {
        initialPokemon,
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
