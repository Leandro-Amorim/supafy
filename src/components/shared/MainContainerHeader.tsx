import { Box, Flex } from "@chakra-ui/react";
import { ReactNode, RefObject, useEffect, useState } from "react";
import LoginModal from "./modals/LoginModal";

import Navigationbutton from "./buttons/NavigationButton";
import ProfileButton from "./buttons/ProfileButton";
import { useUser } from "@supabase/auth-helpers-react";

export default function MainContainerHeader({ elementRef, color, headerContent, darkenHeader, alwaysVisible }: { elementRef: RefObject<HTMLDivElement>, color: string, headerContent: ReactNode, darkenHeader: boolean, alwaysVisible: boolean }) {

	const [visible, setVisible] = useState(false);
	const user = useUser();

	useEffect(() => {
		const ref = elementRef.current;
		const observer = new IntersectionObserver((entries) => {
			const [entry] = entries;

			setVisible(entry.boundingClientRect.y < 64);
		}, {
			root: null,
			rootMargin: '-64px 0px 0px 0px',
			threshold: 1
		});

		if (ref) { observer.observe(ref); }
		return () => {
			if (ref) { observer.unobserve(ref); }
		}
	}, [elementRef]);


	return (
		<Flex className="w-full h-16 px-6 py-4 absolute z-[80]" >

			<Box className="inset-0 absolute pointer-events-none" bg={color ?? 'white'} opacity={visible ? 1 : 0} transition={'all .2s linear'}>
				{darkenHeader ? <Box bg={'rgba(0,0,0,0.6)'} position={'absolute'} inset={0}></Box> : []}
			</Box>


			<Flex className="gap-2 z-[81] w-full">

				<Navigationbutton />
				<Navigationbutton forward={true} />

				<Flex className="h-full items-center grow" pointerEvents={visible || alwaysVisible ? 'auto' : 'none'} transition={'all 0.5s ease'} opacity={visible || alwaysVisible ? 1 : 0}>
					{headerContent}
				</Flex>

				<LoginModal />
				{
					user && <ProfileButton />
				}
			</Flex>
		</Flex>

	)
}