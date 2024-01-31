import { Box, BoxProps } from "@chakra-ui/react";

export default function HomeGradientBackground({ color, childProps }: { color: string, childProps?: BoxProps }) {
	return (
		<Box
			{...childProps}
			position={'absolute'}
			background={color ?? 'red'}
			w={'100%'}
			height={'332px'}
			transition={'background 1s ease'}
			backgroundImage={'linear-gradient(rgba(0,0,0,.6),#121212)'}
			zIndex={-1} />
	)
}