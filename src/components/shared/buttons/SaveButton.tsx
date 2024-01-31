import { Flex } from "@chakra-ui/react";
import { AiOutlineLoading } from "react-icons/ai";

export default function SaveButton({ onClick, invalid, loading }: { onClick?: () => void, invalid: boolean, loading: boolean }) {

	function click() {
		if (invalid || loading) { return; }
		onClick?.()
	}
	return (
		<Flex className={`mt-4 select-none items-center justify-center rounded-full shrink-0 px-8 py-3 scale-100 text-black text-16 font-bold bg-white
		${invalid || loading ? 'cursor-not-allowed text-opacity-50' : 'hover:scale-105 hover:bg-[#f6f6f6] active:bg-[#b7b7b7] active:scale-100'}`} onClick={click} role='button'>
			{loading ? <AiOutlineLoading className="icon-spin absolute left-3" /> : []} Save
		</Flex>
	)
}