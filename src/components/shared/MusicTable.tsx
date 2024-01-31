import { Flex } from "@chakra-ui/react";
import MusicTableItem from "./MusicTableItem";
import MusicTableHeader from "./MusicTableHeader";
import { Playlist } from "@/types/database/Playlist";
import { Artist } from "@/types/database/Artist";

export default function MusicTable({ playlist, artist }: { playlist?: Playlist, artist?: Artist }) {
	return (
		<Flex direction={'column'}>
			<MusicTableHeader isArtist={artist !== undefined} />
			{
				(playlist ?? artist)?.musics?.map((el, i) => {
					return <MusicTableItem key={el.id} music={el} isArtist={artist !== undefined} playlist={artist ? null : playlist} index={i + 1} />
				})
			}
		</Flex>
	)
}