import { Box, Center, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { MouseEvent, useState } from "react";
import { LinkBox, LinkOverlay } from '@chakra-ui/react';
import CardPlayButton from "./buttons/CardPlayButton";
import { RiMusic2Line } from "react-icons/ri";
import { useContextMenu } from "react-contexify";
import { useUser } from "@supabase/auth-helpers-react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { libraryState, playerState, playlistContextState, queueState } from "@/lib/atoms";
import Link from "next/link";
import { useRouter } from "next/router";
import { addPlaylistToQueue } from "@/lib/playerUtils";
import { LibraryPlaylist } from "@/types/database/LibraryPlaylist";
import { openPlaylistContextMenu } from "@/lib/context-menus/openPlaylistContextMenu";


export default function SideBarPlaylistGrid({ playlist }: { playlist: LibraryPlaylist }) {

	const router = useRouter();

	const user = useUser();
	const setPlaylistContext = useSetRecoilState(playlistContextState);
	const [hover, setHover] = useState(false);

	const [queue, setQueue] = useRecoilState(queueState);
	const [player, setPlayer] = useRecoilState(playerState);
	const setLibrary = useSetRecoilState(libraryState);

	const { show } = useContextMenu({ id: 'playlist', });
	function openContextMenu(event: MouseEvent<HTMLDivElement>) {
		openPlaylistContextMenu(event, user, playlist, true, null, setPlaylistContext, show);
	}


	function play(event: MouseEvent<HTMLDivElement>) {
		event.preventDefault();
		addPlaylistToQueue(playlist.id, null, true, queue, setQueue, player, setPlayer, setLibrary);
	}

	const active = router.asPath?.includes(`/playlist/${playlist.id}`);
	const playing = queue.currentMusic.playlist_id === playlist.id;
	const showIcon = playing && player.playing;

	return (
		<LinkBox onDoubleClick={play} onContextMenu={openContextMenu} className="w-full p-3 rounded-lg relative" onMouseEnter={() => { setHover(true) }} onMouseLeave={() => { setHover(false) }} role='button' as={Box}>
			<LinkOverlay className="flex flex-col gap-2" href={`/playlist/${playlist.id}`} as={Link}>

				<Box className={`absolute rounded-md ${active ? (hover ? 'bg-container-active-hover' : 'bg-container-active') : (hover ? 'bg-container-minor' : '')}
				${hover || active ? 'inset-0' : 'inset-3'}`} transition={'all 300ms ease'} />

				<Box className='w-full relative z-[1] aspect-square shrink-0 rounded overflow-hidden' boxShadow={'0 8px 24px rgba(0,0,0,.5)'}>
					{
						playlist.image_url ? <Image fill={true} className="object-cover" alt={playlist.id} src={playlist.image_url} /> :
							<Center boxSize={'100%'} className="bg-container-light"><RiMusic2Line size={'64px'} color='#7f7f7f' /></Center>
					}

					<CardPlayButton hover={hover || showIcon} onClick={play} playing={showIcon} />
				</Box>

				<Flex className="z-[1] flex-col gap-[2px] min-h-[44px]">
					<Text className={`${playing ? 'text-green' : 'text-white'} text-16`} noOfLines={1}>{playlist.name}</Text>
					<Text className="text-secondary text-14" noOfLines={1}>{playlist.author_name}</Text>
				</Flex>

			</LinkOverlay>
		</LinkBox>

	)
}

