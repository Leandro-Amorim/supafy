import { ExternalLinkIcon } from "@chakra-ui/icons"
import { Box, CloseButton, Link, Text, } from "@chakra-ui/react"
import NextLink from 'next/link';
import { useEffect, useState } from "react";

export default function JobAdAlert() {

	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (localStorage && localStorage.getItem('hideJobAd') !== 'true') {
			setVisible(true);
		}
	}, []);


	function hide() {
		localStorage.setItem('hideJobAd', 'true');
		setVisible(false);
	}

	if (!visible) { return []; }

	return (
		<Box className="mx-1 mt-2">
			<Box className="w-full rounded-md bg-red-500 flex items-center justify-between pl-3 py-[2px]">
				<Box className="text-sm font-medium">
					<Text noOfLines={1}>
						{`Psst! This developer is looking for work! If you are interested in contacting me, you can reach me through my `}
						<Link as={NextLink} href='https://www.linkedin.com/in/leandro-n-amorim/' isExternal className="inline-flex items-center">
							LinkedIn <ExternalLinkIcon mx='4px' />
						</Link>
					</Text>

				</Box>
				<CloseButton onClick={hide} />
			</Box>
		</Box>

	)
}