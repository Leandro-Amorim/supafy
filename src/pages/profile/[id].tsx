import SideBar from "@/components/sidebar/SideBar";
import PlayBar from "@/components/playbar/PlayBar";
import { Flex } from "@chakra-ui/react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PlaylistCardContainer from "@/components/shared/PlaylistCardContainer";
import PlaylistCard from "@/components/shared/PlaylistCard";
import MainContainer from "@/components/shared/MainContainer";
import ProfileHeaderContent from "@/components/profile/ProfileHeaderContent";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import Page from "@/components/shared/Page";
import { Database } from "@/supabase";
import { GetServerSideProps } from "next";
import { nullUUID } from "@/lib/utils";
import { Profile } from "@/types/database/Profile";

export default function Profile({ profile }: { profile: Profile }) {

	return (
		<Page>
			<Flex grow={1} minH={0}>
				<SideBar />
				<MainContainer color={profile.color} headerContent={<ProfileHeaderContent profile={profile} />}>
					<ProfileHeader profile={profile} />
					<PlaylistCardContainer childProps={{ marginTop: '40px' }} title={'Playlists'}>
						{
							profile.playlists?.map((el) => {
								return (<PlaylistCard key={el.id} playlist={el} />)
							})
						}
					</PlaylistCardContainer>
				</MainContainer>
			</Flex>
			<PlayBar />
		</Page>
	)
}


export const getServerSideProps = (async (context) => {
	const supabase = createPagesServerClient<Database>(context);
	const { data: { session } } = await supabase.auth.getSession();
	const client_id = session?.user?.id ?? null;

	const result = await supabase.rpc('get_profile', { pid: (context.params?.id as string) ?? nullUUID, my_id: client_id ?? nullUUID }).single();

	if (result.error) { console.error(result.error) }

	if (!result.data) {
		return {
			redirect: {
				destination: '/404',
				permanent: false,
			},
		}
	}

	if (client_id) {
		const profile = (await supabase.from('profiles').select('*').eq('id', client_id).single()).data;
		if (profile && profile.signup_completed === false) {
			return {
				redirect: {
					destination: '/complete_profile',
					permanent: false,
				},
			}
		}
	}

	return {
		props: {
			profile: result.data,
		},
	}
}) satisfies GetServerSideProps;