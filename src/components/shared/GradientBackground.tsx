import { Box, BoxProps } from "@chakra-ui/react";

export default function GradientBackground({ color, linearGradient, height, childProps }: { color: string, linearGradient: string, height: string, childProps?: BoxProps }) {
	return (
		<Box
			{...childProps}
			position={'absolute'}
			background={color ?? 'red'}
			w={'100%'}
			height={height ?? '332px'}
			transition={'background 1s ease'}
			backgroundImage={linearGradient ?? 'linear-gradient(rgba(0,0,0,.6),#121212)'} />
	)
}