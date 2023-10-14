export default function Home() {
  return <div className="w-full h-full px-10"></div>
}

export async function getServerSideProps() {
  return {
    redirect: {
      permanent: false,
      destination: "/pokemon/ice",
    },
  }
}
