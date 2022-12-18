import clsx from 'clsx'
import Link from 'next/link'
import { useContext, useState } from 'react'
import ThumbnailOverlays from './ThumbnailOverlays'
import VideoOptions from './Options'
import ShareModal from '@components/Common/Modals/ShareModal'
import useAppStore from '@store/app'
import { useDidToAddress } from '@utils/functions/getDidToAddress'
import { getUsername } from '@utils/functions/getProfileName'
import ReactTimeAgo from 'react-time-ago'
import ReportModal from '@components/Common/Modals/ReportModal'
import DeleteModal from '@components/Common/Modals/DeleteModal'
import EditModal from '@components/Common/Modals/EditModal'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { isBrowser } from 'react-device-detect'
import { ProfilePicture } from '@utils/functions/getProfilePicture'



const VideoCardSmall = ({ video }) => {
    const [showShareModal, setShowShareModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showReportModal, setShowReportModal] = useState(false)
    const { address } = useDidToAddress(video.creator_details?.did)
    const username = getUsername(video.creator_details.profile, address, video.did)

    return (
        <>
        {video.content.data ?
            <div className="relative group">
                <ShareModal video={video} show={showShareModal} setShow={setShowShareModal} />
                <ReportModal video={video} show={showReportModal} setShow={setShowReportModal} />
                <DeleteModal video={video} show={showDeleteModal} setShow={setShowDeleteModal} />
                <EditModal video={video} show={showEditModal} setShow={setShowEditModal} />
                <Link href={`/watch/${video.stream_id}`}>
                    <div className="relative rounded-none md:rounded-xl aspect-w-16 overflow-hidden aspect-h-9">
                        <LazyLoadImage
                            delayTime={100}
                            className={clsx(
                            'object-center bg-secondary w-full h-full rounded-lg lg:w-full lg:h-full object-cover'
                            )}
                            alt={`Video by ${username}`}
                            wrapperClassName='w-full'
                            effect="blur"
                            placeholderSrc='/placeholder.png'
                            src={video.content.data.Thumbnail}
                        />
                        <ThumbnailOverlays video={video} />
                    </div>
                </Link>
                <div className="py-2">
                    <div className="flex items-start space-x-2.5">
                        {isBrowser ? <Link href={`/${video.creator_details.profile !== null ? username : video.creator_details.did}`} className="flex-none mt-0.5">
                            <ProfilePicture details={video?.creator_details} imgClass='object-cover rounded-full bg-dropdown w-8 h-8 md:w-9 md:h-9'/>
                        </Link> : null}
                        <div className="grid flex-1">
                            <div className='flex w-full items-start justify-between '>
                                <div className="flex flex-col w-full items-start pr-2 justify-between min-w-0">
                                    <Link
                                        href={`/watch/${video.stream_id}`}
                                        className="text-[15px] font-medium line-clamp-2 break-words"
                                    >
                                        {video.content.title}
                                    </Link>
                                    <Link
                                        href={`/${video.creator_details.profile !== null ? username : video.creator_details.did}`}
                                        className="flex hover:text-black dark:hover:text-white w-fit items-center space-x-1.5 text-[14px] text-light"
                                    >
                                        <span>{username}</span>
                                    </Link>
                                    <div className="flex overflow-hidden text-[13px] text-light">
                                        <span className="whitespace-nowrap">
                                            {video.count_likes > 1 ? `${video.count_likes} likes` : `${video.count_likes} like`}
                                        </span>
                                        <span className="middot" />
                                        <span className="whitespace-nowrap">
                                            <ReactTimeAgo date={video.timestamp * 1000} locale="en-US" />
                                        </span>
                                    </div>
                                </div>
                                <VideoOptions
                                    video={video}
                                    setShowShareModal={setShowShareModal}
                                    setShowReportModal={setShowReportModal}
                                    setShowEditModal={setShowEditModal}
                                    setShowDeleteModal={setShowDeleteModal}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            : null
        }
        </>
    )
}

export default VideoCardSmall