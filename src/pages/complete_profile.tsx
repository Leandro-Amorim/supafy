import CustomInput from "@/components/shared/CustomInput";
import SaveButton from "@/components/shared/buttons/SaveButton";
import ImageUploader from "@/components/shared/modals/ImageUploader";
import { Box, Text } from "@chakra-ui/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, useRef, useState } from "react";
import { FiUser } from "react-icons/fi";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Database } from "@/supabase";
import { completeProfile } from "@/lib/profiles/completeProfile";

export default function CompleteProfile() {

	const inputRef = useRef<HTMLInputElement | null>(null);

	const [invalid, setInvalid] = useState(false);
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const [data, setData] = useState<{
		name: string,
		previewUrl: string,
		imageData: '' | File | null,
	}>({
		name: '',
		previewUrl: '',
		imageData: null,
	})

	function setText(value: string) {
		setInvalid(value?.trim().length == 0 || value.length > 64);
		setData((prev) => { return { ...prev, name: value } })
	}

	function chooseImage() {
		inputRef.current?.click();
	}

	function onImageChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) { clearImage(); return; }
		if (data.previewUrl) { URL.revokeObjectURL(data.previewUrl); }

		setData((prev) => {
			return {
				...prev,
				imageData: file,
				previewUrl: URL.createObjectURL(file),
			}
		})
	}

	function clearImage() {
		if (data.previewUrl) { URL.revokeObjectURL(data.previewUrl); }
		setData((prev) => {
			return {
				...prev,
				imageData: '',
				previewUrl: '',
			}
		})
	}


	function onSave() {
		setLoading(true);
		completeProfile(data).then(() => {
			setLoading(false);
			router.push('/');
		})
	}

	return (
		<Box className="w-screen h-screen flex items-center justify-center bg-container">
			<Box className="bg-container-light rounded-lg shadow-md text-white w-full max-w-md relative">
				<input ref={inputRef} className='hidden' type="file" accept="image/*" onChange={onImageChange} />
				<Box className='p-6'><Text className='text-2xl font-bold' noOfLines={1}>{'Complete your profile'}</Text></Box>

				<Box className='px-6 pb-[16px!important] flex flex-col items-center gap-1'>
					<ImageUploader onClick={chooseImage} data={data} onClear={clearImage} isRound={true} icon={<FiUser size={'64px'} color='#7f7f7f' />} />
					<Box className='w-full mb-4'></Box>
					<Box className={`flex w-full h-8 bg-[#e22134] rounded text-white mb-2 px-2 items-center text-11 gap-2 ${invalid ? '' : 'hidden'}`}>
						<HiOutlineExclamationCircle size={'20px'} />
						<Text>The username is invalid.</Text>
					</Box>
					<CustomInput text={data.name} setText={setText} placeholder={'Add a display name'} label={'Nome'} />
					<SaveButton onClick={onSave} loading={loading} invalid={invalid || data.name.length == 0} />
				</Box>
			</Box>
		</Box>
	)
}

export const getServerSideProps = (async (context) => {
	const supabase = createPagesServerClient<Database>(context);
	const { data: { session } } = await supabase.auth.getSession();
	const client_id = session?.user?.id ?? null;

	if (!client_id) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}

	const profile = (await supabase.from('profiles').select('*').eq('id', client_id).single()).data;
	if (profile?.signup_completed) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}

	return {
		props: {
		},
	}
}) satisfies GetServerSideProps;