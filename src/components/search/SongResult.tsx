import { Link } from "@chakra-ui/next-js";
import { Box, Text, useToast } from "@chakra-ui/react";
import Image from "next/image";
import { MouseEvent, useEffect, useState } from "react";
import { ImPlay3 } from "react-icons/im";
import { IoIosPause } from "react-icons/io";
import LikeButton from "../shared/buttons/LikeButton";
import EllipsisButton from "../shared/buttons/EllipsisButton";
import { formatDuration } from "@/lib/utils";
import { useUser } from "@supabase/auth-helpers-react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authErrorState, libraryState, musicContextState, playerState, queueState } from "@/lib/atoms";
import { useRouter } from "next/router";
import { useContextMenu } from "react-contexify";
import { addMusicToQueue } from "@/lib/playerUtils";
import { MusicInfo } from "@/types/database/MusicInfo";
import { likeMusic } from "@/lib/musics/likeMusic";
import { openMusicContextMenu } from "@/lib/context-menus/openMusicContextMenu";

export default function SongResult({ music }: { music: MusicInfo }) {

	const user = useUser();

	const setLibrary = useSetRecoilState(libraryState);
	const setAuthError = useSetRecoilState(authErrorState);
	const setMusicContext = useSetRecoilState(musicContextState);

	const [hover, setHover] = useState(false);
	const [liked, setLiked] = useState(false);
	const toast = useToast();

	const [queue, setQueue] = useRecoilState(queueState);
	const [player, setPlayer] = useRecoilState(playerState);

	const router = useRouter();

	useEffect(() => {
		setLiked(music.liked_by_me);
	}, [music.liked_by_me])

	function onLike() {
		likeMusic(user, music.id, liked, setLiked, setAuthError, setLibrary, toast, router);
	}

	const { show } = useContextMenu({ id: 'music' });

	function openContextMenu(event: MouseEvent<HTMLDivElement>) {
		openMusicContextMenu(event, user, null, music, liked, setLiked, setMusicContext, show);
	}

	function togglePlaying() {
		setPlayer((prev) => {
			return {
				...prev,
				playing: !prev.playing,
			}
		})
	}

	const active = queue.currentMusic.id === music.id;
	const playing = active && player.playing;

	function play() {
		if (active) {
			setPlayer((prev) => {
				return {
					...prev,
					playing: !prev.playing,
				}
			})
		}
		else {
			addMusicToQueue(music.id, null, true, queue, setQueue, player, setPlayer);
		}

	}

	return (
		<Box onContextMenu={openContextMenu} className="grid w-full h-14 px-4 gap-4 rounded-[4px] hover:bg-white hover:bg-opacity-10" border={'1px solid transparent'} gridTemplateColumns={'[first] 4fr [last] minmax(120px,1fr)'} onMouseEnter={() => { setHover(true) }} onMouseLeave={() => { setHover(false) }} >
			<Box className="justify-self-start flex items-center">
				<Box className="w-10 h-10 mr-3 -ml-2 relative shrink-0">
					<Image fill={true} className="object-cover" alt={music.id} src={music.image_url ?? ''} />
					{
						hover &&
						<Box onClick={play} className="absolute top-0 w-10 h-10 bg-black bg-opacity-50 text-white flex items-center justify-center" paddingLeft={playing ? 0 : '4px'}>
							{
								playing ? <IoIosPause size={'28px'} /> : <ImPlay3 size={'24px'} />
							}
						</Box>
					}

				</Box>
				<Box className="flex flex-col">
					<Box color={active ? '#1ed760' : 'white'} fontSize={'16px'}><Text noOfLines={1}>{music.name}</Text></Box>
					<Box color={hover ? 'white' : '#b3b3b3'} fontSize={'14px'}><Link href={`/artist/${music.artist_id}`} transition={'none'}><Text noOfLines={1}>{music.artist_name}</Text></Link></Box>
				</Box>
			</Box>
			<Box className="justify-self-end flex items-center text-14 text-primary">

				<Box className={`relative top-[1px] mr-2 ${hover || liked ? 'visible' : 'invisible'}`}>
					<LikeButton liked={liked} size={'18px'} iconSize={'18px'} onClick={onLike} />
				</Box>

				<Box marginX={'16px'} className="tabular-nums" color={'#b3b3b3'} fontSize={'14px'}>{formatDuration(music.duration)}</Box>

				<Box visibility={hover ? 'visible' : 'hidden'}>
					<EllipsisButton size={'20px'} iconSize={'20px'} onClick={openContextMenu} />
				</Box>
			</Box>
		</Box>
	)
}