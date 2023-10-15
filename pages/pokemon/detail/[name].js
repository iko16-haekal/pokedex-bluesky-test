import React from "react"

import Image from "next/image"
import { useRouter } from "next/router"
import { formatNumberWithLeadingZero } from "../../../utils/common"

const Pokemon = ({ pokemon }) => {
  const pokeIndex = formatNumberWithLeadingZero(pokemon?.id)
  const router = useRouter()

  return (
    <div className="w-full h-full flex justify-center px-5 py-2">
      <div
        className="absolute top-0 left-0 p-10 text-xl cursor-pointer"
        onClick={router?.back}
      >
        X
      </div>
      <div className="w-full flex h-full px-72 pt-28">
        <div className="bg-slate-900 rounded p-5  w-full h-full">
          <ul className="flex gap-2">
            {pokemon.types.map((type) => (
              <li key={type.slot} className="px-2 py-1 bg-slate-700 rounded">
                {type.type.name}
              </li>
            ))}
          </ul>

          <div>
            <div className="flex items-center gap-10 py-5">
              <Image
                quality={100}
                alt={pokemon.name}
                width={300}
                height={300}
                src={`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${pokeIndex}.png`}
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
      </div>
    </div>
  )
}

export default Pokemon

export async function getServerSideProps(context) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${context.query.name}`
    )
    const pokemon = await response.json()

    return {
      props: {
        pokemon,
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
