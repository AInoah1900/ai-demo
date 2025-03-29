'use client'

import Image from "next/image";
import { useState } from "react";

import rawData from '../../data.json'
import Link from "next/link";


export default function Home() {

  const [search, setSearch] = useState('')
  const [data, setData] = useState(rawData)

  const handleSearch = () => {
    let filteredData = []
    for (const section of rawData) {
      if (!section.cards.some((card: any) => card.name.toLowerCase().includes(search.toLowerCase()))) {
        continue
      }

      const filteredCards = section.cards.filter((card: any) => card.name.toLowerCase().includes(search.toLowerCase()))

      filteredData.push({
        ...section,
        cards: filteredCards
      })

      setData(filteredData)
    }
  }
  return (
    <div className="h-min-screen w-full scroll-auto">
      {/* 搜索栏 */}
      <div className="w-full h-64 flex flex-col justify-center items-center">
        <p>搜索本站内容</p>
        <div className="flex flex-row justify-center items-center w-3/4 mt-2 gap-2">
          <input
            className="w-1/2 h-10 rounded-md border-2 border-gray-300 p-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button 
            className="h-10 rounded-md bg-blue-500 text-white px-4"
            onClick={handleSearch}
          >
            搜索
          </button>
        </div>
      </div>

      {/* 热门工具 */}
      <div>
        {
          data.map((section: any) => (
            <div
              className="w-full flex flex-col"
              id={section.title}
              key={section.title}
            >
              <p
                className="text-2xl font-bold mt-4 ml-4 mb-4"
              >
                {section.title}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
                {/* 一张卡片 */}
                {
                  section.cards.map((card: any) => (
                    <Link
                      href={`/card/${card.id}`}
                      className="h-36"
                      key={card.id}
                    >
                      <div className="h-full w-full bg-white rounded-lg flex flex-col shadow-sm hover:shadow-md transition-all duration-200 p-3">
                        <div className="flex items-center mb-2">
                          <Image
                            src={`/img/${card.img}`}
                            alt={card.name}
                            width={40}
                            height={40}
                            className="rounded-lg mr-3"
                          />
                          <h3 className="text-sm md:text-base font-bold">
                            {card.name}
                          </h3>
                        </div>
                        <div className="mt-1">
                          <p className="text-xs text-gray-600">
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>

      {/* footer */}
      <div className="h-screen w-full flex flex-col items-center justify-end">
        <p className="text-slate-500 mb-4">Copyright © 2025 &nbsp;&nbsp;By: AINoah车厘子🍒</p>
      </div>

    </div>
  );
}
