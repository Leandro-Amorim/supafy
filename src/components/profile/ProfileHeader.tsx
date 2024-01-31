import { formatPlural } from "@/lib/utils";
import { Profile } from "@/types/database/Profile";
import { Box, Center, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { FiUser } from "react-icons/fi";

export default function ProfileHeader({ profile }: { profile: Profile }) {
	return (
		<Flex h={'272px'} paddingTop={'16px'} alignItems={'flex-end'} gap={'24px'} paddingBottom={'24px'}>

			<Box className="w-[128px] h-[128px] @3xl:w-[192px] @3xl:h-[192px] @5xl:w-[232px] @5xl:h-[232px]" position={'relative'} flexShrink={0}>
				{
					profile.avatar_url ?
						<Image fill={true} style={{ boxShadow: '0 4px 60px rgba(0,0,0,.5)' }} className="object-cover rounded-full" alt="playlist" src={profile.avatar_url} /> :
						<Center boxSize={'100%'} style={{ boxShadow: '0 4px 60px rgba(0,0,0,.5)' }} className="bg-container-light rounded-full"><FiUser size={'96px'} color='#7f7f7f' /></Center>
				}

			</Box>

			<Flex position={'relative'} direction={'column'} minW={0} >
				<Text fontSize={'14px'} color={'white'} fontWeight={500} className="-mb-0 @lg:-mb-1 @3xl:-mb-3 @5xl:-mb-5">Profile</Text>
				<Text lineHeight={'130%'}
					className="text-[32px] @lg:text-[48px] @3xl:text-[72px] @5xl:text-[96px] mb-2 @5xl:mb-3"
					color={'white'} fontWeight={700} noOfLines={1}>{profile.username}</Text>

				<Text fontSize={'14px'} color={'white'} fontWeight={500}>{formatPlural(profile.playlists.length, 'playlist')}</Text>
			</Flex>
		</Flex>
	)
}