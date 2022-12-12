import Image from 'next/image'
import React, { useState } from 'react'
import { GoVerified } from "react-icons/go"
import axios from "axios"
import VideoCard from '../../components/VideoCard'
import NoResults from '../../components/NoResults'
import { IUser, Video } from '../../types'
import { BASE_URL } from '../../utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useAthStore from '../../store/authStore'
import { userAgent } from 'next/server'

const Search = ({ videos }: { videos: Video[] }) => {
  const [isAccounts, setIsAccounts] = useState(false)
  const router = useRouter()
  const { searchTerm }: any = router.query
  const { allUsers } = useAthStore()

  const accounts = isAccounts ? 'border-b-2 border-black' : 'text-gray-400'
  const isVideos = !isAccounts ? 'border-b-2 border-black' : 'text-gray-400'
  const searchedAccounts = allUsers.filter((user: IUser) => user.userName.toLowerCase().includes(searchTerm?.toLowerCase()))

  return (
    <div className='w-full'>
      <div className='flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full'>
        <p className={`text-xl font-semibold cursor-pointer ${accounts} mt-2`} onClick={() => setIsAccounts(true)}>
          Accounts
        </p>
        <p className={`text-xl font-semibold cursor-pointer ${isVideos} mt-2`} onClick={() => setIsAccounts(false)}>
          Videos
        </p>
      </div>

      {
        isAccounts ? (
          <div className='md:mt-16'>
            {
              searchedAccounts.length ? (
                searchedAccounts.map((user: IUser, i: number) => (
                  <Link href={`/profile/${user._id}`} key={i}>
                    <div className=' flex gap-3 p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200'>
                      <div>
                        <Image
                          width={50}
                          height={50}
                          className='rounded-full cursor-pointer'
                          src={user.image}
                          alt='user-profile'
                        />
                      </div>

                      <div className='hidden xl:block'>
                        <p className='flex cursor-pointer gap-1 items-center text-[18px] font-bold leading-6 text-primary'>
                          {user.userName}{' '}
                          <GoVerified className='text-blue-400' />
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <NoResults text={`No videos for ${searchTerm}`}/>
              )
            }
          </div>
        ) : (
          <div className='md:mt-16 flex flex-wrap gap-6 md:justify-start '>
            {
              videos?.length ? (
                videos.map((video: Video, i: number) => (
                  <VideoCard post={video} key={i} />
                ))
              ) : <NoResults text={`No videos for ${searchTerm}`}/>
            }
          </div>
        )
      }
    </div>
  )
}

export const getServerSideProps = async ({ params: { searchTerm }}: { params: { searchTerm: string }}) => {
  const res = await axios.get(`${BASE_URL}/api/search/${searchTerm}`)
  //const res2 = await axios.get(`https://catfact.ninja/fact`)

  //console.log(res2);
  return {
    props: { videos: res.data }
  }
}

export default Search