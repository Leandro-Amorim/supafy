import { Box, Flex, FlexProps, Text } from "@chakra-ui/react";
import { ReactElement } from "react";
import { QueryBreakpoints, useContainerQueries } from "use-container-queries";

const breakpoints: QueryBreakpoints = {
	'2': [-49, 271],
	'3': [272, 463],
	'4': [464, 719],
	'5': [720, 975],
	'6': [976, 1231],
	'7': [1232, 1359],
	'8': [1360, 1615],
	'9': [1616],
}

export default function PlaylistCardContainer({ title, children, childProps, oneLine = false }: { title: string, children?: ReactElement[], childProps?: FlexProps, oneLine?: boolean }) {

	const { ref, active, width } = useContainerQueries({ breakpoints });

	return (
		<Flex ref={ref} {...childProps} w={'100%'} direction={'column'} zIndex={3} position={'relative'} marginRight={'-24px'} mb={'16px'}>
			<Box mb={'12px'}>
				<Text color={'white'} fontSize={'24px'} fontWeight={700} noOfLines={1}>{title}</Text>
			</Box>
			<Box w={'100%'} display={'grid'}
				className={`grid-cols-2 @lg:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5 @7xl:grid-cols-6
			@8xl:grid-cols-7 @9xl:grid-cols-8 @10xl:grid-cols-9 gap-3 @lg:gap-[18px] @3xl:gap-6`}>
				{
					children?.map((el, i) => {
						if (oneLine && (i + 1) >= Number(active)) { return [] }
						return el;
					})
				}
			</Box>
		</Flex>
	)
}