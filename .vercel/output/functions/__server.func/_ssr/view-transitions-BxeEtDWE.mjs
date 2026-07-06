//#region node_modules/.nitro/vite/services/ssr/assets/view-transitions-BxeEtDWE.js
function section(path) {
	return path.split("/").filter(Boolean)[0] ?? "";
}
function depth(path) {
	return path.split("/").filter(Boolean).length;
}
function getVtDirection(from, to) {
	if (section(from) !== section(to)) return "fade";
	const fd = depth(from);
	const td = depth(to);
	if (td > fd) return "forward";
	if (td < fd) return "back";
	return "fade";
}
function applyVtDirection(dir) {
	if (typeof document === "undefined") return;
	document.documentElement.dataset.vt = dir;
}
//#endregion
export { getVtDirection as n, applyVtDirection as t };
