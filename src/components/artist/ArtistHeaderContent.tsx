import { Artist } from "@/types/database/Artist";
import { Flex, Text } from "@chakra-ui/react";

export default function ArtistHeaderContent({ artist }: { artist: Artist }) {
	return (
		<Flex w={'100%'} h={'100%'} alignItems={'center'}>
			<Text fontSize={'24px'} fontWeight={700} color={'white'} noOfLines={1}>{artist.name}</Text>
		</Flex>
	)
}