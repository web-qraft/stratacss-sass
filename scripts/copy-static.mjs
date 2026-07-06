// 静的ファイル（HTML / fonts / images など）を dist へコピーする。
// バンドラーを使わない構成のため、src 配下の静的物を dist へ複製する。
// `--watch` 付きで実行すると変更を検知して再コピーする（dev サーバーのリロード用）。
import { cpSync, existsSync } from "node:fs";

const targets = [
	{ src: "src/html", dest: "dist" },					 // index.html → dist/
	{ src: "src/assets", dest: "dist/assets" },	 // fonts/ images/ → dist/assets/
];

function copyAll() {
	for (const { src, dest } of targets) {
		if (existsSync(src)) {
			cpSync(src, dest, { recursive: true });
		}
	}
}

copyAll();
console.log("static: copied to dist/");

if (process.argv.includes("--watch")) {
	const chokidar = await import("chokidar");
	const watch = chokidar.watch ?? chokidar.default.watch;
	const paths = targets.map((t) => t.src).filter(existsSync);
	watch(paths, { ignoreInitial: true }).on("all", (event, file) => {
		copyAll();
		console.log(`static: ${event} ${file} -> re-copied`);
	});
	console.log(`static: watching ${paths.join(", ")}`);
}
