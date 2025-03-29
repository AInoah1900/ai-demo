'use client'

import React from 'react'
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ChatIcon from '@mui/icons-material/Chat';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CodeIcon from '@mui/icons-material/Code';
import BrushIcon from '@mui/icons-material/Brush';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import LinkIcon from '@mui/icons-material/Link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Props = {}

const Navbar = (props: Props) => {

    const router = useRouter()

    const handleClick = (text: string) => {
        if (window.location.pathname === '/') {
            const element = document.getElementById(text)
            element?.scrollIntoView({behavior: 'smooth'})
        } else {
            router.push(`/`)
            setTimeout(() => {
                const element = document.getElementById(text)
                element?.scrollIntoView({behavior: 'smooth'})
            }, 300)
        }
    }

  return (
    <div className='w-60 h-screen bg-slate-300 flex flex-col items-center gap-4 fixed'> 
        <div className='mt-6 w-3/4 h-full flex flex-col justify-between'>
            <div className='flex flex-col gap-8'>
                {/* logo */}
                <div 
                    className='flex items-center gap-2'
                    onClick={() => handleClick('/')}
                >
                    <Image 
                        src="/img/avatar.svg" 
                        alt="AI导航站Logo" 
                        width={40} 
                        height={40} 
                        className='bg-white rounded-full p-1' 
                    />
                    <p className='text-2xl font-bold'>AI导航站</p>
                </div>
                {/* menu */}
                <div className='flex flex-col items-center justify-center w-3/4 gap-6'>
                        {/* 第一行 */}
                        <div
                            className='flex w-full h-10 items-center gap-4 cursor-pointer'
                            onClick={() => handleClick('AI热门工具')}
                        >
                            <WhatshotIcon />
                            <p className='tracking-widest'>AI热门工具</p>
                        </div>


                        <div
                            onClick={() => handleClick('AI对话聊天')}
                            className='flex w-full h-10 items-center gap-4 cursor-pointer'
                        >
                            <ChatIcon />
                            <p className="tracking-widest">AI对话聊天</p>
                        </div>

                        <div
                            onClick={() => handleClick('AI文本工具')}
                            className='flex w-full h-10 items-center gap-4 cursor-pointer'
                        >
                            <EditNoteIcon />
                            <p className="tracking-widest select-none">AI文本工具</p>
                        </div>

                        <div
                            onClick={() => handleClick('AI编程工具')}
                            className='flex w-full h-10 items-center gap-4 cursor-pointer'
                        >
                            <CodeIcon />
                            <p className="tracking-widest select-none">AI编程工具</p>
                        </div>

                        <div
                            className='flex w-full h-10 items-center gap-4 cursor-pointer'
                            onClick={() => handleClick('AI绘画')}
                        >
                            <BrushIcon />
                            <p className="tracking-widest select-none">AI绘画</p>
                        </div>

                        <div
                            className='flex w-full h-10 items-center gap-4 cursor-pointer'
                            onClick={() => handleClick('AI新闻')}
                        >
                            <AnnouncementIcon />
                            <p className="tracking-widest select-none">AI新闻</p>
                        </div>

                        <div
                            className='flex w-full h-10 items-center gap-4 cursor-pointer'
                            onClick={() => handleClick('大模型API')}
                        >
                            <DeviceHubIcon />
                            <p className="tracking-widest select-none">大模型API</p>
                        </div>

                        <div
                            className='flex w-full h-10 items-center gap-4 cursor-pointer'
                            onClick={() => handleClick('Agent工具')}
                        >
                            <PsychologyAltIcon />
                            <p className="tracking-widest select-none">Agent工具</p>
                        </div>

                    </div>
            </div>
            
            {/* 个人网站引流链接 */}
            <div className='mb-8 w-full'>
                <p className="text-base text-center mb-2 text-gray-700 font-medium tracking-widest">— 个人网站 —</p>
                <a 
                    href="https://chelizi.top" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-blue-100 rounded-lg hover:bg-blue-200 transition-all border border-blue-300 shadow-sm"
                >
                    <div className="bg-blue-500 rounded-full p-1 flex items-center justify-center">
                        <LinkIcon className="text-white text-sm" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-blue-800">车厘子🍒</p>
                        <p className="text-xs text-blue-600">chelizi.top</p>
                    </div>
                </a>
            </div>
        </div>
    </div>
  )
}

export default Navbar