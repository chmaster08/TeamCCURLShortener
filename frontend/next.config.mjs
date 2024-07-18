/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/Main',
                permanent: true,
            },
        ];
    }
};

export default nextConfig;
