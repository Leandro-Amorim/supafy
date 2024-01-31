import { Flex } from "@chakra-ui/react";
import { GoHome, GoHomeFill } from "react-icons/go";
import { BiSearch, BiSearchAlt } from "react-icons/bi";
import SideBarPrimaryButton from "./buttons/SideBarPrimaryButton";
import { useRouter } from "next/router";

export default function SideBarButtons({ open }: { open: boolean }) {

	const router = useRouter();

	const onHome = router.asPath === '/';
	const onSearch = router.asPath === '/search';

	return (
		<Flex className="rounded-lg bg-container flex-col py-2 px-3">
			<SideBarPrimaryButton active={onHome} href={'/'} icon={onHome ? <GoHomeFill className="shrink-0 w-7 h-7" /> : <GoHome className="shrink-0 w-7 h-7" />}>{open ? 'Home' : ''}</SideBarPrimaryButton>
			<SideBarPrimaryButton active={onSearch} href={'/search'} icon={onSearch ? <BiSearchAlt className="shrink-0 w-7 h-7" /> : <BiSearch className="shrink-0 w-7 h-7" />}>{open ? 'Search' : ''}</SideBarPrimaryButton>
		</Flex>
	)
}