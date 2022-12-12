import React, { useEffect, useRef, useState } from 'react'
import { Video } from '../types'
import { NextPage } from "next"
import Link from 'next/link'
import Image from 'next/image'
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi"
import { BsFillPlayFill, BsFillPauseFill, BsPlay } from "react-icons/bs"
import { GoVerified } from "react-icons/go"
import axios from 'axios'
import { BASE_URL } from '../utils'
import useAthStore from '../store/authStore'

interface IProps {
  post: Video
}

const VideoCard: NextPage<IProps> = ({ post }) => {
  const [isHover, setIsHover] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [pausedForViewCount, setPausedForViewCount] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const { userProfile }: any = useAthStore()

  const videoRef = useRef<HTMLVideoElement>(null)

  const countViews = async () => {
    const { data } = await axios.put(`${BASE_URL}/api/views`, {
      userId: userProfile._id,
      postId: post._id
    })
  }

  const onVideoPress = () => {
    if (playing) {
      videoRef?.current?.pause()
      setPlaying(false)
      setPausedForViewCount(true)
    } else {
      videoRef?.current?.play()
      setPlaying(true)

      if(!pausedForViewCount) {
        countViews()
      }
    }
  }

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted])

  return (
    <div className='flex flex-col border-b-2 border-gray-200 pb-6'>
      <div>
        <div className='flex gap-3 p-2 cursor-pointer font-semibold rounded'>
          <div className='md:w-16 md:h-16 w-10 h-10'>
            <Link href={`/profile/${post.postedBy._id}`}>
              <>
                <Image
                  width={62}
                  height={62}
                  className="rounded-full"
                  src={post.postedBy.image}
                  alt="Profile"
                  layout='responsive'
                />
              </>
            </Link>
          </div>

          <div>
            <Link href={`/profile/${post.postedBy._id}`}>
              <div className='flex items-center gap-2'>
                <p className='flex items-center gap-2 md:text-md font-bold text-primary'>{ post.postedBy.userName }{` `}</p>
                <GoVerified className='text-blue-400 text-md' />
                <p className='capitalize font-medium text-xs text-gray-500 hidden md:block'>{ post.postedBy.userName }</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className='lg:ml-20 flex gap-4 relative'>
        <div 
          className='rounded-3xl'
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <Link href={`/detail/${post._id}`}>
            <video
              loop
              ref={videoRef}
              src={post.video.asset.url}
              className="lg:w-[600px] h-[300px] md:h-[400px] lg:h-[530px] w-[200px] cursor-pointer bg-gray-100"
            ></video>
          </Link>

          {
            isHover && (
              <div className='absolute bottom-6 cursor-pointer left-8 md:left-14 lg:left-0 flex gap-10 lg:justify-between w-[100px] md:w-[50px] p-3'>
                {
                  playing ? (
                    <button onClick={onVideoPress}>
                      <BsFillPauseFill className='text-black text-2xl lg:text-4xl' />
                    </button>
                  ) : (
                    <button onClick={onVideoPress}>
                      <BsFillPlayFill className='text-black text-2xl lg:text-4xl' />
                    </button>
                  )
                }

                {
                  isVideoMuted ? (
                    <button onClick={() => setIsVideoMuted(false)}>
                      <HiVolumeOff className='text-black text-2xl lg:text-4xl' />
                    </button>
                  ) : (
                    <button onClick={() => setIsVideoMuted(true)}>
                      <HiVolumeUp className='text-black text-2xl lg:text-4xl' />
                    </button>
                  )
                }

                {
                  `${post.views?.length} views`
                }
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default VideoCard