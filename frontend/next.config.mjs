/** @type {import('next').NextConfig} */
const nextConfig = {
    output:"export",
    assetPrefix: './',
    trailingSlash: true,
    images: {
    unoptimized: true,
    },
};
const repo = process.env.GITHUB_REPOSITORY?.replace(/.*?\//, '');

// 本番環境（GitHub Pages）でのみbasePath設定
if (process.env.GITHUB_ACTIONS) {
  nextConfig.basePath = `/${repo}`;
}
export default nextConfig;
