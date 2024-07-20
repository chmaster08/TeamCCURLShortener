/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/Main',
                permanent: false,
            },
        ];
    }
};

export default nextConfig;
