
import Link from 'next/link'

type GraphQLResponse = {getWords:{word: string}[]};

export default function Home() {

  return (
    <>
    <h1><Link href='/doctor'>I'm a doctor</Link></h1>
    <h1><Link href='/patient'>I'm a patient</Link></h1>
    </>
  )
}
