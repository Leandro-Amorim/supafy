import { Flex } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { RiHeartFill, RiHeartLine } from "react-icons/ri";

export default function LikeButton({ liked, size, iconSize, onClick }: { liked: boolean, size: string, iconSize: string, onClick: MouseEventHandler<HTMLDivElement> }) {
	return (
		<Flex role='button' onClick={onClick} className={`items-center justify-center scale-100 active:text-dark-active active:scale-100 ${liked ? 'text-green hover:text-light-green' : 'text-secondary hover:text-white'} hover:scale-105 `} boxSize={size}>
			{liked ? <RiHeartFill size={iconSize} /> : <RiHeartLine size={iconSize} />}
		</Flex>
	)
}