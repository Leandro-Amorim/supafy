import { Flex, Text } from "@chakra-ui/react";
import { MouseEventHandler, ReactNode } from "react";

export default function LibraryButton({ icon, children, onClick }: { icon: ReactNode, children: ReactNode, onClick: MouseEventHandler<HTMLDivElement> }) {
	return (
		<Flex onClick={onClick} className={`w-full h-12 text-primary gap-3 items-center cursor-pointer select-none hover:text-white px-3 py-1 grow`} role='button' transition={'color .2s linear'}>
			{icon}
			<Text size={'16px'} fontWeight={700}>{children}</Text >
		</Flex >
	)
}