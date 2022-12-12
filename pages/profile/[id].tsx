import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { GoVerified } from "react-icons/go"
import axios from "axios"
import VideoCard from '../../components/VideoCard'
import NoResults from '../../components/NoResults'
import { IUser, Video } from '../../types'
import { BASE_URL } from '../../utils'

interface IProps {
  id: any
  data: {
    user: IUser,
    userVideos: Video[],
    userLikedVideos: Video[]
  }
}

const Profile = ({data, id}: IProps) => {
  const [showUserVideos, setShowUserVideos] = useState(true)
  const [videosList, setVideosList] = useState<Video[]>([])

  const videos = showUserVideos ? 'border-b-2 border-black' : 'text-gray-400'
  const liked = !showUserVideos ? 'border-b-2 border-black' : 'text-gray-400'

  useEffect(() => {
    if (showUserVideos) {
      setVideosList(data.userVideos)
    } else {
      setVideosList(data.userLikedVideos)
    }
  }, [showUserVideos, id])

  return (
    <div className='w-full'>
      <div className='flex gap-6 md:gap-10 mb-4 bg-white w-full'>
        <div className='w-16 h-16 md:w-32 md:h-32'>
          <Image
            width={34}
            height={34}
            className='rounded-full'
            src={data.user.image}
            alt='user-profile'
            layout='responsive'
          />
        </div>

        <div>
          <div className='text-md md:text-2xl font-bold tracking-wider flex gap-2 items-center justify-center lowercase'>
            <span>{data.user.userName.replace(/\s+/g, '')} </span>
            <GoVerified className='text-blue-400 md:text-xl text-md' />
          </div>
          <p className='text-sm font-medium'> {data.user.userName}</p>
        </div>
      </div>


      <div>
        <div className='flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full'>
          <p className={`text-xl font-semibold cursor-pointer ${videos} mt-2`} onClick={() => setShowUserVideos(true)}>
              Videos
            </p>
            <p className={`text-xl font-semibold cursor-pointer ${liked} mt-2`} onClick={() => setShowUserVideos(false)}>
              Liked
            </p>
        </div>


        <div className='flex gap-6 flex-wrap md:justify-start'>
          {
            videosList.length ? (
              videosList.map((post: Video, idx: number) => (
                <VideoCard post={post}  />
              ))
            ) : (
                <NoResults text={`No ${showUserVideos ? '' : 'Liked'} Videos!`}  />
            )
          }
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ params: { id }}: { params: { id: string }}) => {
  const res = await axios.get(`${BASE_URL}/api/profile/${id}`)

  return {
    props: { data: res.data, id }
  }
}

export default Profile