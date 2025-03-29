'use client'

import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import rawData from '../../../../data.json'
import Image from 'next/image'
import Link from 'next/link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LaunchIcon from '@mui/icons-material/Launch'

// 定义卡片数据的接口
interface Card {
  id: string
  name: string
  img: string
  link: string
  description: string
}

// 定义数据部分的接口
interface Section {
  title: string
  cards: Card[]
}

type Props = {}

const Card = (props: Props) => {
    const router = useRouter()
    const params = useParams()
    const card_id = params.card_id   
    
    let cardData
    let sectionTitle = ''

    // 查找卡片数据
    const section = rawData.find((section: Section) => 
      section.cards.some((card: Card) => card.id === card_id)
    )
    
    if (section) {
      cardData = section.cards.find((card: Card) => card.id === card_id)
      sectionTitle = section.title
    }

    // 处理返回
    const handleBack = () => {
      router.back()
    }

    // 如果找不到卡片数据
    if (!cardData) {
      return (
        <div className='w-full min-h-screen flex flex-col items-center justify-center bg-gray-50'>
          <p className='text-2xl font-bold text-gray-600'>未找到相关内容</p>
          <button 
            className='mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
            onClick={handleBack}
          >
            <ArrowBackIcon fontSize='small' /> 返回
          </button>
        </div>
      )
    }

  return (
    <div className='w-full min-h-screen bg-gray-50 pt-6 pb-20'>
      {/* 返回按钮 */}
      <div className='max-w-4xl mx-auto px-4 mb-6'>
        <button 
          onClick={handleBack}
          className='flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors'
        >
          <ArrowBackIcon fontSize='small' /> 返回
        </button>
      </div>

      <div className='max-w-4xl mx-auto bg-white rounded-xl shadow-sm px-8 py-10'>
        {/* 面包屑导航 */}
        <div className='text-sm text-gray-500 mb-8'>
          <span>首页</span> &gt; <span>{sectionTitle}</span> &gt; <span className='text-gray-700'>{cardData.name}</span>
        </div>

        {/* 工具信息 */}
        <div className='flex flex-col md:flex-row items-start md:items-center gap-6 mb-10'>
          <div className='bg-gray-50 p-3 rounded-xl flex justify-center items-center'>
            <Image
              src={`/img/${cardData.img}`}
              alt={cardData.name}
              width={120}
              height={120}
              className='rounded-lg'
            />
          </div>
          <div className='flex flex-col gap-4'>
            <h1 className='text-3xl font-bold text-gray-800'>{cardData.name}</h1>
            <p className='text-lg text-gray-600 max-w-2xl'>{cardData.description}</p>
            <Link 
              href={cardData.link} 
              target="_blank"
              className='flex items-center gap-2 bg-blue-500 hover:bg-blue-600 transition-colors text-white px-6 py-3 rounded-lg w-fit'
            >
              <span>访问官网</span> <LaunchIcon fontSize='small' />
            </Link>
          </div>
        </div>

        {/* 详细信息 */}
        <div className='border-t border-gray-100 pt-8'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>详细介绍</h2>
          <div className='bg-gray-50 p-6 rounded-xl'>
            <p className='text-gray-700 leading-relaxed'>
              {cardData.description}
              {/* 由于描述较短，这里可以扩展内容 */}
              <br /><br />
              {cardData.name} 是一款功能强大的AI工具，能够帮助用户高效完成各种任务。
              该工具支持多种语言和平台，用户可以通过官方网站获取更多详细信息。
            </p>
          </div>
        </div>

        {/* 相关推荐 */}
        <div className='mt-10 border-t border-gray-100 pt-8'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>相关推荐</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {section?.cards.filter(c => c.id !== card_id).slice(0, 3).map(relatedCard => (
              <Link 
                key={relatedCard.id}
                href={`/card/${relatedCard.id}`}
                className='bg-gray-50 hover:bg-gray-100 transition-colors p-4 rounded-lg flex items-center gap-3'
              >
                <Image
                  src={`/img/${relatedCard.img}`}
                  alt={relatedCard.name}
                  width={40}
                  height={40}
                  className='rounded-md'
                />
                <div>
                  <h3 className='font-medium text-gray-800'>{relatedCard.name}</h3>
                  <p className='text-xs text-gray-500 line-clamp-1'>{relatedCard.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card