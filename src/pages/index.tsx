import SideBar from "@/components/sidebar/SideBar";
import PlayBar from "@/components/playbar/PlayBar";
import { Flex } from "@chakra-ui/react";
import MainContainer from "@/components/shared/MainContainer";
import Page from "@/components/shared/Page";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import PlaylistHistoryContainer from "@/components/home/PlaylistHistoryContainer";
import PlaylistCardContainer from "@/components/shared/PlaylistCardContainer";
import PlaylistCard from "@/components/shared/PlaylistCard";
import { useState } from "react";
import { GetServerSideProps } from 'next';
import { DataHome } from "@/types/database/Home";
import { Database } from "@/supabase";
import { nullUUID } from "@/lib/utils";

export default function Home({ home }: { home: DataHome | null }) {

	const [color, setColor] = useState<string | null>(null);

	return (
		<Page>
			<Flex grow={1} minH={0}>
				<SideBar />
				<MainContainer doubleBg={false} color={color ?? 'rgb(83,83,83)'} isHome={true}>
					<Flex className="gap-6 flex-col">

						{home?.history && <PlaylistHistoryContainer history={home.history} setColor={setColor} />}
						{
							home?.popular &&
							<PlaylistCardContainer oneLine={true} title={'Popular playlists'}>
								{
									home.popular.map((el) => {
										return <PlaylistCard key={el.id} playlist={el} />
									})
								}
							</PlaylistCardContainer>
						}
						{
							home?.featured &&
							<PlaylistCardContainer oneLine={true} title={'Recommended for today'}>
								{
									home.featured.map((el) => {
										return <PlaylistCard key={el.id} playlist={el} />
									})
								}
							</PlaylistCardContainer>
						}
					</Flex>
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

	const { error, data: home } = await supabase.rpc('get_home', { my_id: client_id ?? nullUUID }).single<DataHome>();

	if (error) { console.error(error) }

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
			home: home as DataHome,
		},
	}
}) satisfies GetServerSideProps;