import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Text, Box, } from '@chakra-ui/react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import CustomInput from '../CustomInput';
import { ChangeEvent, useRef, useState } from 'react';
import ImageUploader from './ImageUploader';
import SaveButton from '../buttons/SaveButton';
import { useRecoilState } from 'recoil';
import { profileEditModalState } from '@/lib/atoms';
import { FiUser } from 'react-icons/fi';
import { updateProfile } from '@/lib/profiles/updateProfile';

export default function ProfileEditModal() {

	const inputRef = useRef<HTMLInputElement | null>(null);
	const [modal, setModal] = useRecoilState(profileEditModalState);
	const [invalid, setInvalid] = useState(false);
	const [loading, setLoading] = useState(false);
	function setText(value: string) {
		setInvalid(value.trim().length == 0 || value.length > 64);
		setModal((prev) => { return { ...prev, name: value } })
	}
	function chooseImage() {
		inputRef.current?.click();
	}

	function onImageChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) { clearImage(); return; }
		if (modal.previewUrl) { URL.revokeObjectURL(modal.previewUrl); }

		setModal((prev) => {
			return {
				...prev,
				imageData: file,
				previewUrl: URL.createObjectURL(file),
			}
		})
	}

	function clearImage() {
		if (modal.previewUrl) { URL.revokeObjectURL(modal.previewUrl); }
		setModal((prev) => {
			return {
				...prev,
				imageData: '',
				previewUrl: '',
			}
		})
	}


	function onSave() {
		setLoading(true);
		updateProfile(modal, setModal).then(() => {
			setLoading(false);
		})
	}

	return (
		<Modal isOpen={modal.open} onClose={() => { setModal((prev) => { return { ...prev, open: false } }) }}>
			<ModalOverlay />

			<ModalContent className='w-[420px] bg-container-light rounded-lg shadow-md text-white'>
				<input ref={inputRef} className='hidden' type="file" accept="image/*" onChange={onImageChange} />
				<ModalHeader className='p-6'><Text className='text-2xl font-bold' noOfLines={1}>{'Profile details'}</Text></ModalHeader>
				<ModalCloseButton boxSize={'32px'} rounded={'full'} textColor={'rgba(255,255,255,0.7)'} bg={'transparent'} _hover={{ bg: 'rgba(255,255,255,0.1)' }} _active={{ bg: 'rgba(255,255,255,0.2)' }} />

				<ModalBody className='px-6 pb-[16px!important] flex flex-col items-center gap-1'>

					<ImageUploader onClick={chooseImage} data={modal} onClear={clearImage} isRound={true} icon={<FiUser size={'64px'} color='#7f7f7f' />} />
					<Box className='w-full mb-4'></Box>
					<Box className={`flex w-full h-8 bg-[#e22134] rounded text-white mb-2 px-2 items-center text-11 gap-2 ${invalid ? '' : 'hidden'}`}>
						<HiOutlineExclamationCircle size={'20px'} />
						<Text>The username is invalid.</Text>
					</Box>
					<CustomInput text={modal.name} setText={setText} placeholder={'Add a display name'} label={'Nome'} />
					<SaveButton onClick={onSave} loading={loading} invalid={invalid || modal.name.length == 0} />
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}