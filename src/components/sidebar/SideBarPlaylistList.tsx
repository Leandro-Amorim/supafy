import { Box, Center, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { LinkBox, LinkOverlay } from '@chakra-ui/react';
import { RiMusic2Line } from "react-icons/ri";
import { useContextMenu } from "react-contexify";
import { useUser } from "@supabase/auth-helpers-react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { libraryState, playerState, playlistContextState, queueState } from "@/lib/atoms";
import Link from "next/link";
import { useRouter } from "next/router";
import { addPlaylistToQueue } from "@/lib/playerUtils";
import { HiVolumeUp } from "react-icons/hi";
import { LibraryPlaylist } from "@/types/database/LibraryPlaylist";
import { MouseEvent } from "react";
import { openPlaylistContextMenu } from "@/lib/context-menus/openPlaylistContextMenu";

export default function SideBarPlaylistList({ open, playlist }: { open: boolean, playlist: LibraryPlaylist }) {

	const router = useRouter();
	const [queue, setQueue] = useRecoilState(queueState);
	const [player, setPlayer] = useRecoilState(playerState);
	const setLibrary = useSetRecoilState(libraryState);
	const user = useUser();
	const setPlaylistContext = useSetRecoilState(playlistContextState);

	const { show } = useContextMenu({ id: 'playlist', });
	function openContextMenu(event: MouseEvent<HTMLDivElement>) {
		openPlaylistContextMenu(event, user, playlist, true, null, setPlaylistContext, show);
	}

	function dbClick() {
		addPlaylistToQueue(playlist.id, null, true, queue, setQueue, player, setPlayer, setLibrary);
	}

	const active = router.asPath?.includes(`/playlist/${playlist.id}`);
	const playing = queue.currentMusic.playlist_id === playlist.id;
	const showIcon = playing && player.playing;

	return (
		<LinkBox onDoubleClick={dbClick} onContextMenu={openContextMenu} className={`${open ? 'w-full' : 'w-16'} h-16 p-2 rounded-md ${active ? 'bg-container-active hover:bg-container-active-hover' : 'hover:bg-container-minor'} `} as={Box} role='button'>
			<LinkOverlay className="flex gap-3" href={`/playlist/${playlist.id}`} as={Link}>

				<Box className="relative w-12 h-12 shrink-0 rounded overflow-hidden">
					{
						playlist.image_url ? <Image fill={true} className="object-cover" alt={playlist.id} src={playlist.image_url} /> :
							<Center boxSize={'100%'} className="bg-container-light"><RiMusic2Line size={'24px'} color='#7f7f7f' /></Center>
					}

				</Box>
				{
					open ?
						<Flex className="grow gap-3 min-w-0">
							<Flex className="grow flex-col gap-1 min-w-0" >
								<Text className={`${playing ? 'text-green' : 'text-white'} text-16`} noOfLines={1}>{playlist.name}</Text>
								<Text className="text-secondary text-14" noOfLines={1}>{playlist.author_name}</Text>
							</Flex>
							{
								showIcon &&
								<Flex className="basis-8 shrink-0 items-center justify-center text-green" >
									<HiVolumeUp size={'18px'} />
								</Flex>
							}
						</Flex>
						: []
				}
			</LinkOverlay>
		</LinkBox>

	)
}

