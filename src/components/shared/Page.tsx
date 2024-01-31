import { Flex } from "@chakra-ui/react"
import ContextProvider from "../context-menus/ContextProvider"
import { ReactNode } from "react"
import JobAdAlert from "./JobAdAlert"

export default function Page({ children }: { children: ReactNode }) {
	return (
		<Flex className="w-screen h-screen bg-black flex-col" onContextMenu={(e) => { e.preventDefault() }}>
			<ContextProvider />
			<JobAdAlert/>
			{
				children
			}
		</Flex>
	)
}