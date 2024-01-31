import { Flex } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { VscEllipsis } from "react-icons/vsc";

export default function EllipsisButton({ size, iconSize, onClick }: { size: string, iconSize: string, onClick: MouseEventHandler<HTMLDivElement> }) {
	return (
		<Flex onClick={onClick} className='items-center justify-center scale-100 text-secondary hover:text-white hover:scale-105 active:text-dark-active active:scale-100' role='button' transform={'scale(1)'} boxSize={size} color={'#a7a7a7'}>
			<VscEllipsis size={iconSize} />
		</Flex>
	)
}