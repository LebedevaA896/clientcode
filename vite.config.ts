import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

function useCredentials() {
	return {
		name: "remove-module",
		transformIndexHtml(html: string) {
			return html
				.replaceAll("crossorigin", "")
				.replaceAll('type="module"', "defer");
		},
	};
}

const getPlugins = (isProd: boolean) => {
	if (isProd) {
		return [useCredentials()];
	}
	return [];
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }: { mode: string }) => {
	const isProd = mode === "production";

	return {
		base: "./",
		server: {
			port: 8080,
		},
		preview: {
			port: 8080,
			host: "0.0.0.0",
		},
		build: {
			minify: isProd,
			sourcemap: !isProd,
			outDir: "build",
			emptyOutDir: true,
			rollupOptions: {
				output: {
					assetFileNames: assetInfo => {
						const ext = assetInfo.name?.split(".").pop();
						let prefix = "";
						if (ext?.match(/eot|ttf|otf|woff|woff2/)) {
							prefix = "fonts/";
						} else if (ext?.match(/jpg|jpeg|png|gif|svg|webp/)) {
							prefix = "images/";
						} else if (ext?.match(/css/)) {
							prefix = `${ext}/`;
						}
						return `assets/${prefix}[hash:16][extname]`;
					},
					chunkFileNames: isProd
						? "assets/js/[hash:16].js"
						: "assets/js/[name]-[hash:16].js",
					entryFileNames: isProd
						? "assets/js/[hash:16].js"
						: "assets/js/[name]-[hash:16].js",
				},
			},
		},
		plugins: [
			react(),
			// splitVendorChunkPlugin(),
			ViteImageOptimizer({
				png: {
					quality: 100,
				},
				jpeg: {
					quality: 100,
				},
				jpg: {
					quality: 100,
				},
				svg: {
					multipass: true,
					plugins: [
						"preset-default",
						"prefixIds",
						{
							name: "removeViewBox",
						},
						{
							name: "removeEmptyAttrs",
						},
						{
							name: "sortAttrs",
							params: {
								xmlnsOrder: "alphabetical",
							},
						},
					],
				},
			}),
			...getPlugins(isProd),
		],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
				features: path.resolve(__dirname, "./src/features"),
				assets: path.resolve(__dirname, "./src/assets"),
				utils: path.resolve(__dirname, "./src/utils"),
				interfaces: path.resolve(__dirname, "./src/interfaces"),
			},
		},
		define: {
			APP_VERSION: JSON.stringify(process.env.npm_package_version),
			MODE: JSON.stringify(mode),
			BUILD_DATE: JSON.stringify(new Date().toLocaleString("ru-RU")),
		},
	};
});
