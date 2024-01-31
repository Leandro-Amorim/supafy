import { formatPlural } from "@/lib/utils";
import { Artist } from "@/types/database/Artist";
import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";

export default function ArtistHeader({ artist }: { artist: Artist }) {
	return (
		<Flex h={'272px'} paddingTop={'16px'} alignItems={'flex-end'} gap={'24px'} paddingBottom={'28px'}>

			<Box position={'relative'} >
				<Box className="w-[128px] h-[128px] @3xl:w-[192px] @3xl:h-[192px] @5xl:w-[232px] @5xl:h-[232px]" flexShrink={0}>
					<Image fill={true} style={{ boxShadow: '0 4px 60px rgba(0,0,0,.5)' }} className="object-cover rounded-full" alt="artist" src={artist.avatar_url} />
				</Box>
			</Box>

			<Flex position={'relative'} direction={'column'} minW={0}>
				<Text fontSize={'14px'} color={'white'} fontWeight={500} className="-mb-0 @lg:-mb-1 @3xl:-mb-3 @5xl:-mb-5">Artist</Text>
				<Text lineHeight={'130%'}
					className="text-[32px] @lg:text-[48px] @3xl:text-[72px] @5xl:text-[96px] mb-2 @5xl:mb-3"
					color={'white'} fontWeight={700} noOfLines={1}>{artist.name}</Text>
				<Text fontSize={'14px'} color={'white'} fontWeight={500}>{formatPlural(artist.musics.length, 'song')}</Text>
			</Flex>
		</Flex>
	)
}