import { Box, Center, Flex, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";
import Image from "next/image";
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import { RiMusic2Line } from "react-icons/ri";
import HistoryPlayButton from "./HistoryPlayButton";
import Link from "next/link";
import { useRecoilState, useSetRecoilState } from "recoil";
import { libraryState, playerState, queueState } from "@/lib/atoms";
import { addPlaylistToQueue } from "@/lib/playerUtils";
import { BasicPlaylist } from "@/types/database/BasicPlaylist";

export default function PlaylistHistoryCard({ playlist, setColor }: { playlist: BasicPlaylist, setColor: Dispatch<SetStateAction<string | null>> }) {

	const [hover, setHover] = useState(false);

	const [queue, setQueue] = useRecoilState(queueState);
	const [player, setPlayer] = useRecoilState(playerState);
	const setLibrary = useSetRecoilState(libraryState);

	useEffect(() => {
		setColor(hover ? playlist.color ?? 'red' : null)
	}, [hover, setColor, playlist.color]);

	function play(event: MouseEvent<HTMLDivElement>) {
		event.preventDefault();
		addPlaylistToQueue(playlist.id, null, true, queue, setQueue, player, setPlayer, setLibrary);
	}

	const playing = queue.currentMusic.playlist_id === playlist.id && player.playing;

	return (
		<LinkBox>
			<LinkOverlay href={`/playlist/${playlist.id}`} as={Link} className={`flex @9xl:h-20 @6xl:h-16 h-12 bg-white bg-opacity-10 hover:bg-opacity-20 w-full overflow-hidden rounded cursor-pointer`} onMouseEnter={() => { setHover(true) }} onMouseLeave={() => { setHover(false) }} transition={'background-color .3s ease'}>
				<Flex className="h-full aspect-square shrink-0 bg-white bg-opacity-20 relative" shadow={'0 8px 24px rgba(0,0,0,.5)'}>
					{
						playlist.image_url ? <Image fill={true} className="object-cover" alt="playlist" src={playlist.image_url} /> :
							<Center boxSize={'100%'} className="bg-container-light"><RiMusic2Line size={'32px'} color='#7f7f7f' /></Center>
					}
				</Flex>
				<Flex className="items-center text-white justify-between @6xl:px-4 px-2 h-full text-16 font-bold w-full relative">
					<Text noOfLines={2} className="@6xl:text-[16px] text-[14px]">{playlist.name}</Text>
					<HistoryPlayButton hover={hover} onClick={play} playing={playing} />
					{
						playing &&
						<Box className='absolute top-0 @6xl:right-4 right-0 w-12 h-full flex items-center justify-center'>
							<Image width={14} height={14} alt="equaliser" src={'/equaliser.gif'} />
						</Box>
					}
				</Flex>
			</LinkOverlay>
		</LinkBox>
	)
}