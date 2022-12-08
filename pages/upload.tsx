import { useRouter } from 'next/router'
import React, {useState, useEffect} from 'react'
import { FaCloudUploadAlt } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import axios from 'axios'
import useAthStore from '../store/authStore'
import { client } from '../utils/client'
import { SanityAssetDocument } from "@sanity/client"
import { topics } from '../utils/constants'


const Upload = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [videoAsset, setVideoAsset] = useState<SanityAssetDocument | undefined>()
  const [wrongFileType, setWrongFileType] = useState(false)
  const [caption, setCaption] = useState("")
  const [category, setCategory] = useState(topics[0].name)
  const [savingPost, setSavingPost] = useState(false)

  const { userProfile }: any = useAthStore()
  const router = useRouter()

  const uploadVideo = async (e: any) => {
    const selectedFile = e.target.files[0]
    const fileTypes = ['video/mp4', 'video/webm', 'video/ogg']

    if (fileTypes.includes(selectedFile.type)) {
      await client.assets.upload('file', selectedFile, {
        contentType: selectedFile.type,
        filename: selectedFile.name
      })
      .then((data) => {
        setVideoAsset(data)
        setIsLoading(false)
      })
    } else {
      setIsLoading(false)
      setWrongFileType(true)
    }
  }

  const handlePost = async (e: any) => {
    if (caption && videoAsset?._id && category) {
      setSavingPost(true)

      const document = {
        _type: "post",
        caption,
        video: {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: videoAsset?._id
          }
        },
        userId: userProfile?._id,
        postedBy: {
          _type: "postedBy",
          _ref: userProfile?._id
        },
        topic: category
      }


      await axios.post(`${ process.env.NEXT_PUBLIC_BASE_URL}/api/post`, document)

      router.push('/')
    }
  }

  return (
    <div className='flex w-full h-full absolute left-0 top-[60px] lg:top-[70px] mb-10 pt-10 lg:pt-20 bg-[#F8F8F8] justify-center'>
      <div  className=' bg-white rounded-lg xl:h-[80vh] flex gap-6 flex-wrap justify-center items-center p-14 pt-6'>
        <div>
          <div>
            <p className='text-2xl font-bold'>Upload Video</p>
            <p className='text-md text-gray-400 mt-1'>Post a video to your account</p>
          </div>

          <div 
            className='border-dashed rounded-xl border-4 border-gray-200 flex flex-col 
            justify-center items-center outline-none mt-10 w-[260px] h-[460px] p-10 
            cursor-pointer hover:border-red-300 hover:bg-gray-100'
          >
            {
              isLoading ? (
                <p>Uploading....</p>
              ) : (
                <div>
                  {
                    videoAsset ? (
                      <div>
                        <video
                          className='rounded-xl h-[462px] mt-16 bg-black'
                          controls
                          loop
                          src={videoAsset?.url}
                        />
                      </div>
                    ) : (
                      <label className='cursor-pointer'>
                        <div className='flex flex-col items-center justify-center h-full'>
                          <div className='flex flex-col items-center justify-center'>
                            <p className='font-bold text-xl'>
                              <FaCloudUploadAlt className='text-gray-300 text-6xl' />
                            </p>
                            <p className='test-xl font-semibold'>Upload Video</p>
                          </div>

                          <p className='text-gray-400 text-center mt-10 text-sm leading-10'>
                            MP4 or WebM or ogg<br></br>
                            720x1280 or higher<br></br>
                            Up to 10 minutes<br></br>
                            Less than 2GB
                          </p>
                          <p className='bg-[#F51997] text-center mt-8 rounded text-white text-md font-medium p-2 w-52 outline-none'>
                            Select file
                          </p>
                        </div>

                        <input
                          type="file"
                          name="upload-video"
                          className='w-0 h-0'
                          onChange={(e) => {
                            uploadVideo(e)
                          }}
                        />
                      </label>
                    )
                  }
                </div>
              )
            }

            {
              wrongFileType && (
                <p className='text-center text-xl text-red-400 font-semibold mt-4 w-[260px]'>
                  Please select a video file (mp4 or webm or ogg)
                </p>
              )
            }
          </div>
        </div>

        <div className='flex flex-col gap-3 pb-10'>
          <label className='text-md font-medium '>Caption</label>
          <input
            type='text'
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className='rounded lg:after:w-650 outline-none text-md border-2 border-gray-200 p-2'
          />
          <label className='text-md font-medium '>Choose a category</label>

          <select
            onChange={(e) => {
              setCategory(e.target.value)
            }} 
            className='outline-none lg:w-650 border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer'
          >
            {
              topics.map((topic) => (
                <option
                  key={topic.name}
                  className=' outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300'
                  value={topic.name}
                >
                  {topic.name}
                </option>
              ))
            }
          </select>

          <div className='flex gap-6 mt-10'>
            <button
              //onClick={handleDiscard}
              type='button'
              className='border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'
            >
              Discard
            </button>
            <button
              //disabled={videoAsset?.url ? false : true}
              onClick={handlePost}
              type='button'
              className='bg-[#F51997] text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'
            >
              {/* {savingPost ? 'Posting...' : 'Post'} */}
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload