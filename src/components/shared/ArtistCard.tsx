import { Box, Center, Flex, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";
import Image from "next/image";
import { RiMusic2Line } from "react-icons/ri";
import Link from "next/link";
import { BasicArtist } from "@/types/database/BasicArtist";

export default function ArtistCard({ artist }: { artist: BasicArtist }) {

	return (
		<LinkBox role={'button'} borderRadius={'6px'} transition={'background-color .3s ease'} background={'#181818'} padding={'16px'} w={'100%'}
			_hover={{
				bg: '#282828'
			}}
		>
			<LinkOverlay href={`/artist/${artist.id}`} as={Link}>
				<Box w={'100%'} aspectRatio={1} position={"relative"} overflow={"hidden"} borderRadius={'full'} marginBottom={'16px'} boxShadow={'0 8px 24px rgba(0,0,0,.5)'}>
					{
						artist.avatar_url ? <Image fill={true} className="object-cover" alt="artist" src={artist.avatar_url} /> :
							<Center boxSize={'100%'} className="bg-container-light"><RiMusic2Line size={'64px'} color='#7f7f7f' /></Center>
					}
				</Box>

				<Flex minH={'62px'} w={'100%'} direction={'column'} align={'flex-start'}>
					<Text fontSize={'16px'} fontWeight={700} color={'white'} noOfLines={1} paddingBottom={'4px'}>{artist.name}</Text>
					<Text fontSize={'14px'} color={'#a7a7a7'} noOfLines={1}>Artist</Text>
				</Flex>

			</LinkOverlay>
		</LinkBox>
	)
}