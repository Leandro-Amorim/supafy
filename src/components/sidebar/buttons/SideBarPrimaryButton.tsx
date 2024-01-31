import { LinkBox, LinkOverlay, Text } from "@chakra-ui/react";
import Link from "next/link";
import { ReactNode } from "react";

export default function SideBarPrimaryButton({ icon, children, href, active }: { icon: ReactNode, children: ReactNode, href: string, active: boolean }) {
	return (
		<LinkBox>
			<LinkOverlay href={href} as={Link} className={`flex w-full h-12 gap-4 items-center cursor-pointer select-none hover:text-white ${active ? 'text-white' : 'text-primary'} px-2 py-1`} role='button' transition={'color .2s linear'}>
				{icon}
				<Text size={'16px'} fontWeight={700}>{children}</Text >
			</LinkOverlay >
		</LinkBox>
	)
}