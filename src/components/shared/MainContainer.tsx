import { Box, Flex } from "@chakra-ui/react";
import MainContainerHeader from "./MainContainerHeader";
import GradientBackground from "./GradientBackground";
import CustomScrollbar from "./CustomScrollbar";
import { ReactNode, useRef } from "react";
import PlaylistEditModal from "./modals/PlaylistEditModal";
import PlaylistDeleteModal from "./modals/PlaylistDeleteModal";
import HomeGradientBackground from "./HomeGradientBackground";
import ProfileEditModal from "./modals/ProfileEditModal";

interface MainContainerProps {
	children: ReactNode,
	color: string,
	headerContent?: ReactNode,
	darkenHeader?: boolean,
	hasGradient?: boolean,
	doubleBg?: boolean,
	distanceToReveal?: string,
	primaryGradientHeight?: string,
	secondaryGradientHeight?: string,
	isHome?: boolean,
	headerAlwaysVisible?: boolean
}

export default function MainContainer(
	{
		children,
		color,
		headerContent,
		darkenHeader = true,
		hasGradient = true,
		doubleBg = true,
		distanceToReveal = '336px',
		primaryGradientHeight = '336px',
		secondaryGradientHeight = '232px',
		isHome = false,
		headerAlwaysVisible = false
	}: MainContainerProps
) {

	const elementRef = useRef<HTMLDivElement>(null);

	return (
		<Box bg={'black'} minW={0} flexGrow={1} paddingTop={'10px'} paddingRight={'10px'}>

			<PlaylistEditModal />
			<PlaylistDeleteModal />
			<ProfileEditModal />

			<Box className="@container bg-container w-full h-full overflow-hidden relative rounded-lg">

				<MainContainerHeader elementRef={elementRef} color={color ?? 'white'} darkenHeader={darkenHeader} headerContent={headerContent ?? []} alwaysVisible={headerAlwaysVisible} />

				<Flex w={'100%'} h={'100%'} position={'relative'} direction={'column'} >
					<CustomScrollbar>
						{isHome ? <HomeGradientBackground color={color} /> : []}
						{!isHome && hasGradient ? <GradientBackground color={color ?? 'white'} height={primaryGradientHeight} linearGradient={'linear-gradient(transparent 0,rgba(0,0,0,.5) 100%)'} /> : []}
						{!isHome && hasGradient && doubleBg ? <GradientBackground color={color ?? 'white'} height={secondaryGradientHeight} childProps={{ top: primaryGradientHeight }} linearGradient={'linear-gradient(rgba(0,0,0,.6) 0,#121212 100%)'} /> : []}
						<Box ref={elementRef} boxSize={'16px'} position={'absolute'} top={distanceToReveal ?? primaryGradientHeight}></Box>
						<Box paddingTop={'64px'} paddingLeft={'24px'} paddingRight={'24px'}>
							{children}
						</Box>
					</CustomScrollbar>
				</Flex>

			</Box>

		</Box>
	)
}