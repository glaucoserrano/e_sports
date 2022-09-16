import { useEffect, useState } from 'react'
import { GamesCard } from './components/GamesCard'
import { CreateAdBanner } from './components/CreateAdBanner'
import * as Dialog from '@radix-ui/react-dialog'


import './styles/main.css'


import logoImage from './assets/logo.svg'
import { CreateAddModal } from './components/CreateAddModal'
import axios from 'axios'

interface Game{
  id: string,
	title: string,
	bannerUrl: string,
	_count: {
			ads: number
		}
}

function App() {
  const [games,setGames] = useState<Game[]>([])

  useEffect(()=>{
    axios('http://localhost:3333/games')
      .then(response => {
        setGames(response.data)
      })

  },[])

  return (
    <div className='max-w-[1344px] mx-auto flex flex-col items-center my-20'>
      <img src={logoImage} alt="" />
      <h1 className='text-6xl text-white font-black mt-20'>
        Seu <span className='bg-nlw-gradient bg-clip-text text-transparent'>duo</span> está aqui.
      </h1>
      
      <div className='grid grid-cols-6 gap-6 mt-16'>
        {games.map(game => {
          return(
            <GamesCard 
              key={game.id} 
              bannerUrl={game.bannerUrl} 
              title={game.title} 
              ads={game._count.ads}
            />
          )
        })}
        
      </div>
      <Dialog.Root>
        <CreateAdBanner />
        <CreateAddModal />
      </Dialog.Root>
    </div>
  )
}

export default App
