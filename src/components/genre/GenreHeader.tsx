import { BasicGenre } from "@/types/database/BasicGenre";
import { Flex, Text } from "@chakra-ui/react";

export default function GenreHeader({ genre }: { genre: BasicGenre }) {
	return (
		<Flex paddingTop={'16px'} height={'220px'} alignItems={'flex-end'} gap={'24px'} marginBottom={'40px'}>
			<Flex position={'relative'} direction={'column'} minW={0}>
				<Text fontSize={'96px'} color={'white'} fontWeight={700} noOfLines={1} marginBottom={'16px'}>{genre.name}</Text>
			</Flex>
		</Flex>
	)
}