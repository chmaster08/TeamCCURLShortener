/** @type {import('next').NextConfig} */
const nextConfig = {
    output:"export",
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
