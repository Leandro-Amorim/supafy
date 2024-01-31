/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				hostname: 'i.scdn.co',
			},
			{
				hostname: 'misc.scdn.co',
			},
			{
				hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').hostname ?? '',
			},
		]
	}
}

module.exports = nextConfig
