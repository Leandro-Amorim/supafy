import { Profile } from "@/types/database/Profile";
import { Flex, Text } from "@chakra-ui/react";

export default function ProfileHeaderContent({profile}: {profile: Profile}) {
	return (
		<Flex w={'100%'} h={'100%'} alignItems={'center'}>
			<Text fontSize={'24px'} fontWeight={700} color={'white'} noOfLines={1}>{profile.username}</Text>
		</Flex>
	)
}