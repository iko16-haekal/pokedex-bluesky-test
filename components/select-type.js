import { useRouter } from "next/router"

const InputSelect = ({ typeList, pokemonType }) => {
  const router = useRouter()

  const handleChange = (event) => {
    const selectedType = event.target.value
    router.push(`/pokemon/${selectedType}`)
  }

  return (
    <select
      id="countries"
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-full pr-10"
      onChange={handleChange}
    >
      {typeList?.results?.map((type) => (
        <option
          key={type.name}
          selected={type.name === pokemonType}
          value={type.name}
        >
          {type.name}
        </option>
      ))}
    </select>
  )
}

export default InputSelect
