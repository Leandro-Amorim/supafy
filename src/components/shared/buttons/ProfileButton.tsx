import { profileEditModalState } from "@/lib/atoms";
import { Flex, Menu, MenuButton, MenuDivider, MenuItem, MenuList } from "@chakra-ui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FiUser } from "react-icons/fi";
import { useSetRecoilState } from "recoil";
import { Database } from "@/supabase";
import fetchAPI from "@/lib/fetchAPI";

export default function ProfileButton() {

	const client = useSupabaseClient<Database>();
	const setModal = useSetRecoilState(profileEditModalState);

	async function openModal() {
		const resp = await fetchAPI<null | { username: string, avatar_url: string }, null>('profiles/get_profile_info', null, 'POST');

		setModal((prev) => {
			return {
				...prev,
				open: true,
				imageData: null,
				name: resp?.username ?? '',
				previewUrl: resp?.avatar_url ?? '',
			}
		});
	}

	function logout() {
		client.auth.signOut();
	}

	return (
		<Menu>
			<MenuButton>
				<Flex className="items-center justify-center rounded-full shrink-0 w-8 h-8 scale-100 opacity-100 text-white bg-black bg-opacity-50 hover:bg-opacity-70 hover:scale-105 active:bg-opacity-50 active:opacity-70 active:scale-100" role={'button'}>
					<FiUser size={'20px'} />
				</Flex>
			</MenuButton>
			<MenuList className="!min-w-[180px] !p-1 !rounded-[4px] bg-container-light border-transparent" boxShadow={'1px 2px 2px rgba(0, 0, 0, 0.1),2px 4px 4px rgba(0, 0, 0, 0.1),3px 6px 6px rgba(0, 0, 0, 0.1)'}>
				<MenuItem className="!p-2 !rounded-sm !text-[hsla(0,0%,100%,.9)] text-sm hover:text-white bg-transparent hover:!bg-[hsla(0,0%,100%,.1)]"
					onClick={openModal}>Edit profile</MenuItem>
				<MenuDivider className="!m-0 !border-[#3e3e3e]" />
				<MenuItem className="!p-2 !rounded-sm !text-[hsla(0,0%,100%,.9)] text-sm hover:text-white bg-transparent hover:!bg-[hsla(0,0%,100%,.1)]"
					onClick={logout}>Log out</MenuItem>
			</MenuList>
		</Menu>
	)
}