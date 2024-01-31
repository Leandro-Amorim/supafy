import { Link } from "@chakra-ui/next-js";
import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import Image from "next/image";
import { MouseEvent, useEffect, useState } from "react";
import LikeButton from "../shared/buttons/LikeButton";
import EllipsisButton from "../shared/buttons/EllipsisButton";
import { formatDuration } from "@/lib/utils";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authErrorState, libraryState, musicContextState, playerState, queueState } from "@/lib/atoms";
import { ImPlay3 } from "react-icons/im";
import { IoIosPause } from "react-icons/io";
import { goToMusicById } from "@/lib/playerUtils";
import { useUser } from "@supabase/auth-helpers-react";
import { useContextMenu } from "react-contexify";
import { useRouter } from "next/router";
import { MusicInfo } from "@/types/database/MusicInfo";
import { likeMusic } from "@/lib/musics/likeMusic";
import { openMusicContextMenu } from "@/lib/context-menus/openMusicContextMenu";
import { CurrentMusic } from "@/types/UI/QueueState";

export default function QueueMusicItem({ music, index }: { music: MusicInfo | CurrentMusic, index: number }) {

	const [hover, setHover] = useState(false);
	const [liked, setLiked] = useState(false);
	const [queue, setQueue] = useRecoilState(queueState);
	const [player, setPlayer] = useRecoilState(playerState);

	const user = useUser();
	const setLibrary = useSetRecoilState(libraryState);
	const setAuthError = useSetRecoilState(authErrorState);
	const toast = useToast();
	const setMusicContext = useSetRecoilState(musicContextState);
	const router = useRouter();

	function togglePlaying() {
		setPlayer((prev) => { return { ...prev, playing: !player.playing } })
	}

	function jumpToMusic() {
		goToMusicById(music.id ?? '', queue, setQueue, player, setPlayer);
	}

	useEffect(() => {
		setLiked(music.liked_by_me);
	}, [music.liked_by_me]);

	function onLike() {
		likeMusic(user, music.id ?? '', liked, setLiked, setAuthError, setLibrary, toast, router);
	}

	const { show } = useContextMenu({ id: 'music' });

	function openContextMenu(event: MouseEvent<HTMLDivElement>) {
		openMusicContextMenu(event, user, null, music, liked, setLiked, setMusicContext, show, index > 1);
	}


	const isCurrent = index == 1;
	const isPlaying = isCurrent && player.playing;

	let indexElement = <Box position={'absolute'} right={'4px'} top={'-4px'}>{index}</Box>;

	if (isCurrent) {
		if (hover) {
			indexElement = <Box position={'absolute'} right={isPlaying ? '-2px' : '0'} top={isPlaying ? '-2px' : '0'} color={'white'} onClick={togglePlaying}>{isPlaying ? <IoIosPause size={'20px'} /> : <ImPlay3 size={'16px'} />}</Box>;
		}
		else {
			indexElement = <Box position={'absolute'} right={isPlaying ? '2px' : '4px'} top={isPlaying ? '0px' : '-4px'} color={'#1ed760'}>{isPlaying ?
				<Image width={16} height={16} alt="equaliser" src={'/equaliser.gif'} />
				:
				index}
			</Box>;
		}
	}
	else {
		if (hover) {
			indexElement = <Box position={'absolute'} right={'0'} top={'0'} color={'white'} onClick={jumpToMusic}><ImPlay3 size={'16px'} /></Box>;
		}
	}

	return (
		<Box onContextMenu={openContextMenu} display={'grid'} userSelect={'none'} className="@xs:grid-cols-mus-3 @xl:grid-cols-mus-4"
			border={'1px solid transparent'} bg={hover ? 'rgba(255,255,255,0.1)' : 'transparent'} borderRadius={'4px'} height={'56px'}
			alignItems={'center'} position={'relative'} gap={'16px'} paddingX={'16px'} onMouseEnter={() => { setHover(true) }} onMouseLeave={() => { setHover(false) }}>

			<Box className="tabular-nums" position={'relative'} color={'#b3b3b3'} h={'16px'} fontSize={'16px'}>
				{indexElement}
			</Box>

			<Flex color={'white'} fontSize={'16px'} gap={'16px'} alignItems={'center'}>
				<Box boxSize={'40px'} flexShrink={0} position={'relative'}>
					<Image fill={true} className="object-cover" alt="Music" src={music.image_url ?? ''} />
				</Box>

				<Box paddingRight={'8px'}>
					<Box color={isCurrent ? '#1ed760' : 'white'} fontSize={'16px'}><Text noOfLines={1}>{music.name}</Text></Box>
					<Box color={hover ? 'white' : '#b3b3b3'} fontSize={'14px'}><Link href={`/artist/${music.artist_id}`} transition={'none'}><Text noOfLines={1}>{music.artist_name}</Text></Link></Box>
				</Box>
			</Flex>

			<Box className="@xs:hidden @xl:block" color={hover ? 'white' : '#b3b3b3'} fontSize={'14px'}><Text noOfLines={1}>{music.album_name}</Text></Box>

			<Flex justifySelf={'end'} color={'#b3b3b3'} fontSize={'14px'} alignItems={'center'}>

				<Box className={`relative top-[1px] mr-4 ${hover || liked ? 'visible' : 'invisible'}`}>
					<LikeButton liked={liked} size={'18px'} iconSize={'18px'} onClick={onLike} />
				</Box>

				<Box marginX={'16px'} className="tabular-nums" color={'#b3b3b3'} fontSize={'14px'}>
					{formatDuration(music.duration)}
				</Box>

				<Box visibility={hover ? 'visible' : 'hidden'}>
					<EllipsisButton size={'20px'} iconSize={'20px'} onClick={openContextMenu} />
				</Box>

			</Flex>
		</Box >
	)
}
