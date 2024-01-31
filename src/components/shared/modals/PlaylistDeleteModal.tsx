import { Modal, ModalOverlay, ModalContent, Flex, Text } from '@chakra-ui/react';
import CancelButton from '../buttons/CancelButton';
import ConfirmButton from '../buttons/ConfirmButton';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { libraryState, playlistDeleteModalState } from '@/lib/atoms';
import { useRouter } from 'next/router';
import { deletePlaylist } from '@/lib/playlists/deletePlaylist';
export default function PlaylistDeleteModal() {

	const router = useRouter();
	const [modal, setModal] = useRecoilState(playlistDeleteModalState);
	const setLibrary = useSetRecoilState(libraryState);

	function onConfirm() {
		deletePlaylist(modal, setModal, setLibrary, router);
	}
	return (
		<Modal isOpen={modal.open} onClose={() => { setModal((prev) => { return { ...prev, open: false } }) }}>
			<ModalOverlay />
			<ModalContent className='w-[420px] bg-white p-8 rounded-lg shadow-md text-black flex flex-col gap-3'>
				<Text className='text-2xl font-bold'>Delete from Your Library?</Text>
				<Text className='text-sm'>
					This will delete <b>{modal.name}</b> from  <b>Your Library.</b>
				</Text>
				<Flex className='w-full mt-6 h-12 gap-4 justify-end'>
					<CancelButton onClick={() => { setModal((prev) => { return { ...prev, open: false } }) }} />
					<ConfirmButton onClick={onConfirm} />
				</Flex>
			</ModalContent>
		</Modal>
	)
}