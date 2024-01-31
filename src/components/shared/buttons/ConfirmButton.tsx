import { Flex } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

export default function ConfirmButton({ onClick }: { onClick: MouseEventHandler<HTMLDivElement> }) {
	return (
		<Flex className="select-none items-center justify-center rounded-full shrink-0 px-8 py-3 scale-100 text-black text-16 font-bold bg-green hover:scale-105 hover:bg-light-green active:bg-dark-green active:scale-100" onClick={onClick} role='button'>
			Delete
		</Flex>
	)
}