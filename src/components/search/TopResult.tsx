import { Box, Center, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import CardPlayButton from "../sidebar/buttons/CardPlayButton";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import { libraryState, musicContextState, playerState, playlistContextState, queueState } from "@/lib/atoms";
import { useContextMenu } from "react-contexify";
import { addMusicToQueue, addPlaylistToQueue } from "@/lib/playerUtils";
import { useRecoilState, useSetRecoilState } from "recoil";
import { RiMusic2Line } from "react-icons/ri";
import { useUser } from "@supabase/auth-helpers-react";
import { TopResult } from "@/types/UI/SearchState";
import { openMusicContextMenu } from "@/lib/context-menus/openMusicContextMenu";
import { openPlaylistContextMenu } from "@/lib/context-menus/openPlaylistContextMenu";
import { MusicInfo } from "@/types/database/MusicInfo";
import { BasicPlaylist } from "@/types/database/BasicPlaylist";
import { BasicArtist } from "@/types/database/BasicArtist";

export default function TopResult({ data }: { data: TopResult }) {

	const user = useUser();

	const [hover, setHover] = useState(false);
	const [liked, setLiked] = useState(false);
	const [saved, setSaved] = useState(false);

	useEffect(() => {
		if (data.type == 'music') {
			setLiked((data as MusicInfo).liked_by_me);
		}
	}, [data])

	useEffect(() => {
		if (data.type == 'playlist') {
			setSaved((data as BasicPlaylist).saved_by_me);
		}
	}, [data])

	const [queue, setQueue] = useRecoilState(queueState);
	const [player, setPlayer] = useRecoilState(playerState);
	const setLibrary = useSetRecoilState(libraryState);

	function play(event: MouseEvent<HTMLDivElement>) {
		event.preventDefault();
		if (data.type == 'music') {
			if (queue.currentMusic.id == data.id) {
				setPlayer((prev) => {
					return {
						...prev,
						playing: !prev.playing,
					}
				})
			}
			else {
				addMusicToQueue(data.id, null, true, queue, setQueue, player, setPlayer);
			}

		}
		else if (data.type == 'playlist') {
			addPlaylistToQueue(data.id, null, true, queue, setQueue, player, setPlayer, setLibrary);
		}
	}

	const setPlaylistContext = useSetRecoilState(playlistContextState);
	const setMusicContext = useSetRecoilState(musicContextState);
	const { show: showPlaylist } = useContextMenu({ id: 'playlist', });
	const { show: showMusic } = useContextMenu({ id: 'music', });

	function openContextMenu(event: MouseEvent<HTMLAnchorElement>) {
		if (data.type == 'music') {
			openMusicContextMenu(event, user, null, data as MusicInfo, liked, setLiked, setMusicContext, showMusic);
		}
		else if (data.type == 'playlist') {
			openPlaylistContextMenu(event, user, data as BasicPlaylist, saved, setSaved, setPlaylistContext, showPlaylist);
		}
	}

	let active, playing;

	if (data.type == 'playlist') {
		active = queue.currentMusic.playlist_id == data.id;
	}
	else if (data.type == 'music') {
		active = queue.currentMusic.id == data.id;
	}
	playing = (active && player.playing) ?? false;

	let { href, name, description, imageUrl, tag } = useMemo(() => {
		if (data.type == 'artist') {
			return {
				href: `/artist/${data.id}`,
				name: data.name,
				description: '',
				imageUrl: (data as BasicArtist).avatar_url,
				tag: 'Artist'
			}
		}
		else if (data.type == 'playlist') {
			return {
				href: `/playlist/${data.id}`,
				name: data.name,
				description: `By ${(data as BasicPlaylist).author_name}`,
				imageUrl: (data as BasicPlaylist).image_url,
				tag: 'Playlist',
			}
		}
		else {
			return {
				href: '',
				name: data.name,
				//@ts-ignore
				description: <Box color={hover ? 'white' : '#b3b3b3'} fontSize={'14px'}><Link href={`/artist/${(data as MusicInfo).artist_id}`} transition={'none'}><Text noOfLines={1}>{(data as MusicInfo).artist_name}</Text></Link></Box>,
				imageUrl: (data as MusicInfo).image_url,
				tag: 'Song',
			}

		}
	}, [data, hover]);

	return (
		<LinkBox>
			<LinkOverlay onContextMenu={openContextMenu} href={href} as={Link} className="w-full bg-container-card hover:bg-container-light rounded-lg flex flex-col gap-4 p-5 relative select-none" transition={'background-color .3s ease'}
				onMouseEnter={() => { setHover(true) }} onMouseLeave={() => { setHover(false) }}>
				<Box className={`w-[92px] h-[92px] ${data.type == 'artist' ? 'rounded-full' : 'rounded-md'} overflow-hidden relative`} boxShadow={'0 8px 24px rgba(0,0,0,.5)'}>
					{
						imageUrl ? <Image alt="Top Result" fill={true} className="object-cover" src={imageUrl} draggable={false} /> :
							<Center boxSize={'100%'} className="bg-container-light"><RiMusic2Line size={'64px'} color='#7f7f7f' /></Center>
					}
				</Box>
				<Box className="w-full min-h-[62px]">
					<Text lineHeight={'normal'} className="whitespace-nowrap overflow-hidden text-ellipsis pb-1 text-white font-bold text-[32px]">{name}</Text>
					<Box className={`w-full align-middle flex flex-wrap gap-y-1 ${description ? 'gap-x-[10px]' : 'gap-x-0'} items-center`}>
						<Text className="text-secondary text-14">
							{description}
						</Text>
						<Text className="text-white font-bold text-14 bg-black bg-opacity-20 rounded-full px-3 py-1">
							{tag}
						</Text>
					</Box>
				</Box>
				{
					data.type != 'artist' &&
					<CardPlayButton hover={hover || playing} onClick={play} bottom={'20px'} right={'20px'} playing={playing} />
				}

			</LinkOverlay>
		</LinkBox>
	)
}