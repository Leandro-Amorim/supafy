import { queueState } from "@/lib/atoms";
import { Flex } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
export default function ClearQueueButton() {
	const setQueue = useSetRecoilState(queueState);

	function onClick() {
		setQueue((prev)=>{
			return {
				...prev,
				queue: [],
				shuffledQueue: [],
			}
		})
	}

	return (
		<Flex className="select-none items-center justify-center rounded-full shrink-0 pt-[2px] pb-1 px-4 h-8 scale-100 text-white text-14 font-bold bg-transparent hover:scale-[1.03] active:text-[#b0b0b0!important] active:scale-100 border border-[#b0b0b0] hover:border-white active:border-[#b0b0b0]" onClick={onClick} role='button'>
			Clear queue
		</Flex>
	)
}