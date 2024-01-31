import { BasicGenre } from "@/types/database/BasicGenre";
import { Flex, Text } from "@chakra-ui/react";

export default function GenreHeaderContent({ genre }: { genre: BasicGenre }) {
	return (
		<Flex w={'100%'} h={'100%'} alignItems={'center'}>
			<Text fontSize={'24px'} fontWeight={700} color={'white'} noOfLines={1}>{genre.name}</Text>
		</Flex>
	)
}