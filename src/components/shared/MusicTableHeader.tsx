import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { LuClock3 } from 'react-icons/lu';

export default function MusicTableHeader({ isArtist }: { isArtist: boolean }) {

	const elementRef = useRef<HTMLDivElement>(null);
	const [fixed, setFixed] = useState(false);

	useEffect(() => {
		const ref = elementRef.current;

		const observer = new IntersectionObserver((entries) => {
			const [entry] = entries;
			setFixed(entry.boundingClientRect.y < 80);
		}, {
			root: null,
			rootMargin: '-80px 0px 0px 0px',
			threshold: 1
		});

		if (ref) { observer.observe(ref); }
		return () => {
			if (ref) { observer.unobserve(ref); }
		}
	}, [elementRef]);

	return (
		<Flex ref={elementRef} direction={'column'} marginBottom={'16px'} position={'sticky'} top={'64px'} bg={fixed ? '#1a1a1a' : 'transparent'} transition={'all .2s linear'} zIndex={2} marginX={'-24px'}>

			<Box display={'grid'} className={isArtist ? "@xs:grid-cols-mus-3 @xl:grid-cols-mus-4" : "@xs:grid-cols-mus-3 @xl:grid-cols-mus-4 @3xl:grid-cols-mus-5"}
				height={'36px'} gap={'16px'} paddingX={'40px'} alignItems={'center'}>

				<Box className="tabular-nums" position={'relative'} color={'#b3b3b3'} h={'16px'} fontSize={'18px'} fontWeight={500}>
					<Box position={'absolute'} right={'2px'} top={'-4px'}>#</Box>
				</Box>

				<Box color={'#b3b3b3'} fontSize={'14px'} fontWeight={500}>
					<Text noOfLines={1}>Title</Text>
				</Box>
				<Box className="@xs:hidden @xl:block" color={'#b3b3b3'} fontSize={'14px'} fontWeight={500}>
					<Text noOfLines={1}>Album</Text>
				</Box>

				<Box className="@xs:hidden @3xl:block" hidden={isArtist} color={'#b3b3b3'} fontSize={'14px'} fontWeight={500}>
					<Text noOfLines={1}>Date added</Text>
				</Box>

				<Box justifySelf={'end'} color={'#b3b3b3'} fontSize={'14px'} fontWeight={500}>
					<Text marginRight={'36px'}><LuClock3 size={'16px'} /></Text>
				</Box>
			</Box>

			<Box marginX={fixed ? '0' : '24px'}>
				<Divider opacity={'0.1'} orientation='horizontal' />
			</Box>
		</Flex>
	)
}