import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import LoginButton from "../buttons/LoginButton";
import { Database } from "@/supabase";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function LoginModal() {
	const supabaseClient = useSupabaseClient<Database>();
	const user = useUser();
	const router = useRouter();

	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event) => {
			if (event === "SIGNED_IN") {
				router.push('/complete_profile');
			}
		});
		return () => subscription.unsubscribe();
	});


	if (!user)
		return (
			<>
				<LoginButton onClick={onOpen} />
				<Modal isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Login / Sign Up</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Auth
								redirectTo="/"
								appearance={{ theme: ThemeSupa }}
								supabaseClient={supabaseClient}
								providers={[]}
								socialLayout="horizontal"
							/>
						</ModalBody>
					</ModalContent>
				</Modal>
			</>
		)
}