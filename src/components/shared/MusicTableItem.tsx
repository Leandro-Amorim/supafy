import { Link } from "@chakra-ui/next-js";
import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import moment from "moment/moment";
import Image from "next/image";
import { MouseEvent, useEffect, useState } from "react";
import LikeButton from "./buttons/LikeButton";
import EllipsisButton from "./buttons/EllipsisButton";
import { useContextMenu } from "react-contexify";
import { useUser } from "@supabase/auth-helpers-react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { libraryState, authErrorState, musicContextState, queueState, playerState } from "@/lib/atoms";
import { formatDuration } from "@/lib/utils";
import { useRouter } from "next/router";
import { IoIosPause } from "react-icons/io";
import { ImPlay3 } from "react-icons/im";
import { addMusicToQueue, addPlaylistToQueue } from "@/lib/playerUtils";
import { PlaylistMusic } from "@/types/database/PlaylistMusic";
import { MusicInfo } from "@/types/database/MusicInfo";
import { Playlist } from "@/types/database/Playlist";
import { likeMusic } from "@/lib/musics/likeMusic";
import { openMusicContextMenu } from "@/lib/context-menus/openMusicContextMenu";

export default function MusicTableItem({ music, playlist, isArtist, index }: { music: PlaylistMusic | MusicInfo, playlist?: Playlist | null, isArtist: boolean, index: number }) {

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
		openMusicContextMenu(event, user, playlist, music, liked, setLiked, setMusicContext, show);
	}

	function togglePlaying() {
		setPlayer((prev) => {
			return {
				...prev,
				playing: !prev.playing,
			}
		})
	}

	function play() {
		if (isArtist) {
			addMusicToQueue(music.id, null, true, queue, setQueue, player, setPlayer);
		}
		else {
			addPlaylistToQueue(playlist?.id ?? '', music.id, true, queue, setQueue, player, setPlayer, setLibrary);
		}
	}

	let active, playing;

	if (isArtist) {
		active = queue.currentMusic.id === music.id;
		playing = active && player.playing;
	}
	else {
		active = queue.currentMusic.id === music.id && queue.currentMusic.playlist_id === playlist?.id;
		playing = active && player.playing;
	}

	let indexElement = <Box position={'absolute'} right={'4px'} top={'-4px'}>{index}</Box>;

	if (active) {
		if (hover) {
			indexElement = <Box position={'absolute'} right={playing ? '-2px' : '0'} top={playing ? '-2px' : '0'} color={'white'} onClick={togglePlaying}>{playing ? <IoIosPause size={'20px'} /> : <ImPlay3 size={'16px'} />}</Box>;
		}
		else {
			indexElement = <Box position={'absolute'} right={playing ? '2px' : '4px'} top={playing ? '0px' : '-4px'} color={'#1ed760'}>{
				playing ?
					<Image width={16} height={16} alt="equaliser" src={'/equaliser.gif'} />
					:
					index}
			</Box>;
		}
	}
	else {
		if (hover) {
			indexElement = <Box position={'absolute'} right={'0'} top={'0'} color={'white'} onClick={play}><ImPlay3 size={'16px'} /></Box>;
		}
	}


	return (
		<Box onContextMenu={openContextMenu} display={'grid'} userSelect={'none'} className={isArtist ? "@xs:grid-cols-mus-3 @xl:grid-cols-mus-4" : "@xs:grid-cols-mus-3 @xl:grid-cols-mus-4 @3xl:grid-cols-mus-5"}
			border={'1px solid transparent'} bg={hover ? 'rgba(255,255,255,0.1)' : 'transparent'}
			borderRadius={'4px'} height={'56px'} alignItems={'center'} position={'relative'} gap={'16px'} paddingX={'16px'} onMouseEnter={() => { setHover(true) }} onMouseLeave={() => { setHover(false) }}>

			<Box className="tabular-nums" position={'relative'} color={'#b3b3b3'} h={'16px'} fontSize={'16px'}>
				{indexElement}
			</Box>

			<Flex color={'white'} fontSize={'16px'} gap={'16px'} alignItems={'center'}>
				<Box boxSize={'40px'} flexShrink={0} position={'relative'}>
					<Image fill={true} className="object-cover" alt={music.id} src={music.image_url ?? ''} />
				</Box>

				<Box paddingRight={'8px'}>
					<Box color={active ? '#1ed760' : 'white'} fontSize={'16px'}><Text noOfLines={1}>{music.name}</Text></Box>
					<Box color={hover ? 'white' : '#b3b3b3'} fontSize={'14px'}><Link href={`/artist/${music.artist_id}`} transition={'none'}><Text noOfLines={1}>{music.artist_name}</Text></Link></Box>
				</Box>
			</Flex>

			<Box className="@xs:hidden @xl:block" color={hover ? 'white' : '#b3b3b3'} fontSize={'14px'}><Text noOfLines={1}>{music.album_name}</Text></Box>
			{/*@ts-ignore*/}
			<Box className="@xs:hidden @3xl:block" color={'#b3b3b3'} fontSize={'14px'} hidden={isArtist}><Text noOfLines={1}>{moment(music.added_at).format('LL')}</Text></Box>

			<Flex justifySelf={'end'} color={'#b3b3b3'} fontSize={'14px'} alignItems={'center'}>

				<Box className={`relative top-[1px] mr-4 ${hover || liked ? 'visible' : 'invisible'}`}>
					<LikeButton liked={liked} size={'18px'} iconSize={'18px'} onClick={onLike} />
				</Box>

				<Box marginX={'16px'} className="tabular-nums" color={'#b3b3b3'} fontSize={'14px'}>{formatDuration(music.duration)}</Box>

				<Box visibility={hover ? 'visible' : 'hidden'}>
					<EllipsisButton size={'20px'} iconSize={'20px'} onClick={openContextMenu} />
				</Box>

			</Flex>
		</Box >
	)
}
