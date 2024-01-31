import { Flex } from "@chakra-ui/react";
import { MouseEventHandler, ReactNode } from "react";

export default function SideBarSecondaryButton({ icon, onClick, hasBg = true, searchVariation }: { icon: ReactNode, onClick: MouseEventHandler<HTMLDivElement>, hasBg?: boolean, searchVariation?: boolean }) {
	return (
		<Flex role='button' onClick={onClick} className={`shrink-0 items-center justify-center cursor-pointer select-none text-primary w-8 h-8 rounded-full
		hover:text-white ${hasBg ? (searchVariation ? 'hover:bg-container-hover' : 'hover:bg-container-minor') : 'hover:bg-transparent'} ${hasBg ? (searchVariation ? 'active:bg-container-hover' : 'active:bg-black') : 'active:bg-transparent'}
		`} transition={searchVariation ? '' : 'color .2s linear'}>
			{icon}
		</Flex>
	)
}