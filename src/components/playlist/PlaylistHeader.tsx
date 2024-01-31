import {  formatPlural, getPlaylistDurationString } from "@/lib/utils";
import { Playlist } from "@/types/database/Playlist";
import { Link } from "@chakra-ui/next-js";
import { Box, Center, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { RiMusic2Line } from "react-icons/ri";

export default function PlaylistHeader({ playlist }: { playlist: Playlist }) {

	return (
		<Flex h={'272px'} paddingTop={'16px'} alignItems={'flex-end'} gap={'24px'} paddingBottom={'24px'}>

			<Box className="w-[128px] h-[128px] @3xl:w-[192px] @3xl:h-[192px] @5xl:w-[232px] @5xl:h-[232px]" position={'relative'} flexShrink={0} boxShadow={'0 4px 60px rgba(0,0,0,.5)'}>
				{
					playlist.image_url ? <Image fill={true} className="object-cover rounded" alt={playlist.name} src={playlist.image_url} /> :
						<Center boxSize={'100%'} className="bg-container-light rounded"><RiMusic2Line size={'64px'} color='#7f7f7f' /></Center>
				}
			</Box>

			<Flex position={'relative'} direction={'column'} minW={0}>

				<Text fontSize={'14px'} color={'white'} fontWeight={500} className="-mb-0 @lg:-mb-1 @3xl:-mb-3 @5xl:-mb-5">Playlist</Text>

				<Text className="text-[32px] @lg:text-[48px] @3xl:text-[72px] @5xl:text-[96px] mb-2"
					color={'white'} fontWeight={700} lineHeight={'130%'} noOfLines={2}>{playlist.name}</Text>

				<Flex gap={'4px'} alignItems={'flex-end'} wrap={'wrap'}>
					<Text fontSize={'14px'} color={'white'} fontWeight={700}><Link _hover={{ borderBottomStyle: 'none' }} href={`/profile/${playlist.author_id}`}>{playlist.author_name}</Link> </Text>

					{
						playlist.id !== 'liked' && <Text fontSize={'14px'} color={'white'} fontWeight={500}>•</Text>
					}
					{
						playlist.id !== 'liked' && <Text fontSize={'14px'} color={'white'} fontWeight={400}>{formatPlural(playlist.save_count, 'like')}</Text>
					}

					<Text fontSize={'14px'} color={'white'} fontWeight={500}>•</Text>
					<Flex gap={'2px'}>
						<Text fontSize={'14px'} color={'white'} fontWeight={400}>{formatPlural(playlist.musics?.length, 'song')}</Text>
						{
							playlist.id !== 'liked' && <Text fontSize={'14px'} color={'white'} opacity={'0.7'} fontWeight={400}>{', ' + getPlaylistDurationString(playlist?.musics)}</Text>
						}
					</Flex>

				</Flex>
			</Flex>

		</Flex>
	)
}