import { Flex } from "@chakra-ui/react";
import { MouseEventHandler, ReactNode } from "react";

export default function PlayBarSecondaryButton({ size, active, children, onClick, pl, pr }: { size: string, active?: boolean, children: ReactNode, onClick?: MouseEventHandler<HTMLDivElement>, pl?: string, pr?: string }) {
	return (
		<Flex onClick={onClick} pl={pl ?? 0} pr={pr ?? 0} className={`shrink-0 items-center justify-center ${active ? 'text-green hover:text-light-green active:text-dark-green' : 'text-primary hover:text-white active:text-primary'}`} basis={size}>
			{children}
		</Flex>
	)
}