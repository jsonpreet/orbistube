import usePersistStore from '@store/persist'
import DropMenu from '@components/UI/DropMenu'
import clsx from 'clsx'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { FiFlag } from 'react-icons/fi'
import { RiShareForwardLine } from 'react-icons/ri'
import WatchLater from '@components/Common/WatchLater'
import { useContext, useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Menu } from '@headlessui/react'
import { IoTrashOutline } from 'react-icons/io5'
import { GlobalContext } from '@app/context/app'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'

const VideoOptions = ({
  video,
  setShowShare,
  isSuggested = false,
  showOnHover = true
}) => {
  const router = useRouter()
  const { orbis } = useContext(GlobalContext)
  const { isLoggedIn, user } = usePersistStore();
  const supabase = useSupabaseClient();
  const [showReportModal, setShowReportModal] = useState(false)
  const isVideoOwner = isLoggedIn ? user.did === video.creator_details?.did : false
  const [alreadyAddedToWatchLater, setAlreadyAddedToWatchLater] = useState(false)

  useEffect(() => {
    if (video) {
      isAlreadyAddedToWatchLater();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video])

  const isAlreadyAddedToWatchLater = () => {
    supabase.from('watchlater').select('*').eq('user', user.did).eq('posthash', video.stream_id).then((res) => {
      if (res.data.length > 0) {
          setAlreadyAddedToWatchLater(true)
      } else {
          setAlreadyAddedToWatchLater(false)
      }
      if (res.error) {
        console.error(video.stream_id, 'watched', res.error);
      }
    })
  }

  const addToWatchLater = () => {
    supabase.from('watchlater').insert([{ user: user.did, posthash: video.stream_id }]).then((res) => {
      if (res.error) {
          console.error(video.stream_id, 'watched', res.error);
      } else {
          setAlreadyAddedToWatchLater(true)
      }
    })
  }

  const removeFromWatchLater = () => {
    supabase.from('watchlater').delete().eq('user', user.did).eq('posthash', video.stream_id).then((res) => {
      if (res.error) {
          console.error(video.stream_id, 'watched', res.error);
      } else {
          setAlreadyAddedToWatchLater(false)
      }
    })
  }

  // const onHideVideo = async() => {
  //   let res = await orbis.deletePost(video.stream_id);
  //   if (res.status === 200) {
  //     toast.success('Video Deleted!')
  //     setTimeout(() => router.push('/', undefined, { shallow: true }), 1000)
  //   }
  // }

  const onClickWatchLater = () => {
    alreadyAddedToWatchLater
    ? removeFromWatchLater()
    : addToWatchLater()
  }

  return (
    <DropMenu
      trigger={
        <div
          className={clsx(
            'hover-primary rounded-full w-9 h-9 flex items-center justify-center md:text-inherit outline-none ring-0 group-hover:visible transition duration-150 ease-in-out md:-mr-4 focus:outline-none focus:ring-0',
            {
              'lg:invisible': showOnHover
            }
          )}
        >
          <BsThreeDotsVertical size={17} />
        </div>
      }
    >
      <div className="py-2 my-1 overflow-hidden rounded-lg dropdown-shadow bg-dropdown outline-none ring-0 focus:outline-none focus:ring-0 w-56">
        <div className="flex flex-col text-[14px] transition duration-150 ease-in-out rounded-lg">
          <button
            type="button"
            onClick={() => setShowShare(true)}
            className="inline-flex items-center px-3 py-2 space-x-3 hover-primary"
          >
            <RiShareForwardLine size={22} />
            <span className="whitespace-nowrap">Share</span>
          </button>
          {isLoggedIn ? <WatchLater onClickWatchLater={onClickWatchLater} alreadyAddedToWatchLater={alreadyAddedToWatchLater} /> : null}
          {/* {isVideoOwner && (
            <>
              <button
                type="button"
                onClick={() => onHideVideo()}
                className="inline-flex items-center px-3 py-2 space-x-3 text-red-500 opacity-100 hover:bg-red-100 dark:hover:bg-red-900"
              >
                <IoTrashOutline size={18} className="ml-0.5" />
                <span className="whitespace-nowrap">Delete</span>
              </button>
            </>
          )} */}
          <button
            type="button"
            onClick={() => setShowReportModal()}
            className="inline-flex items-center px-3 py-2 space-x-3 text-red-500 opacity-100 hover:bg-red-100 dark:hover:bg-red-900"
          >
            <FiFlag size={18} className="ml-0.5" />
            <span className="whitespace-nowrap">Report</span>
          </button>
        </div>
      </div>
    </DropMenu>
  )
}

export default VideoOptions