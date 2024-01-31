import { Flex } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

export default function CancelButton({ onClick }: { onClick: MouseEventHandler<HTMLDivElement> }) {
	return (
		<Flex className="select-none items-center justify-center rounded-full shrink-0 px-8 py-3 scale-100 text-black text-16 font-bold bg-white hover:scale-105 active:text-opacity-60 active:scale-100" onClick={onClick} role='button'>
			Cancel
		</Flex>
	)
}