//const express = require('express'); //antigo
import express from 'express'
import {PrismaClient} from '@prisma/client'
import { convertHourStringToMinutes } from './utils/convertHourStringTominutes'
import cors from 'cors'
import { convertMinutesToHoursString } from './utils/convertMinutestoHourstring'

const app = express()
app.use(express.json())
const prisma = new PrismaClient({
  log: ['query']
})

app.use(cors())
app.get('/games',async (req,res) => {
  
  const games = await prisma.game.findMany({
    include:{
      _count:{
        select:{
          ads: true,
        }
      }
    }
  })
  
  return res.json(games)
})

app.post('/games/:id/ads', async(req,res) => {
  const gameId = req.params.id
  const body = req.body;

  const ad = await prisma.ad.create({
    data:{
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
	    discord: body.discord,
	    weekDays: body.weekDays.join(','),
	    hourStart: convertHourStringToMinutes(body.hourStart),
	    hourEnd: convertHourStringToMinutes(body.hourEnd),
	    useVoiceChannel: body.useVoiceChannel
    }
  })
  return res.json(ad)
})
app.get('/games/:id/ads',async (req, res) => {
  const gameId = req.params.id
  const ads = await prisma.ad.findMany({
    select: {
      discord: false,
      id: true,
      gameId: true,
      name: true,
      yearsPlaying: true,
      weekDays: true,
      hourStart: true,
      hourEnd: true,
      useVoiceChannel: true,
    },
    where:{
      gameId
    },
    orderBy:{
      createdAt: 'desc'
    }
  })

  return res.json(ads.map(ad => {
    return{
      ...ad,
      hourStart:convertMinutesToHoursString(ad.hourStart),
      hourEnd:convertMinutesToHoursString(ad.hourEnd),
      weekDays: ad.weekDays.split(',')
    }
  }))
})
app.get('/ads/:id/discord',async(req,res) =>{
  const adId = req.params.id
  const discord = await prisma.ad.findUniqueOrThrow({
    select:{
      discord:true,
    },
    where:{
      id: adId
    }
  })
  
  return res.json({
    discord: discord.discord
  })
})

//localhost:3333
app.listen(3333)
