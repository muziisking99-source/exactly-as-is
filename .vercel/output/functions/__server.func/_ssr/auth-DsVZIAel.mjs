import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-labONTLt.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DsVZIAel.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)(void 0);
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
			setSession(s);
			setLoading(false);
		});
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	const value = {
		session,
		user: session?.user ?? null,
		loading,
		signIn: async (email, password) => {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			return { error };
		},
		signUp: async (email, password, name) => {
			const redirect = typeof window !== "undefined" ? `${window.location.origin}/` : void 0;
			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: { name },
					emailRedirectTo: redirect
				}
			});
			return { error };
		},
		signOut: async () => {
			await supabase.auth.signOut();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value,
		children
	});
}
function useAuth() {
	const c = (0, import_react.useContext)(Ctx);
	if (!c) throw new Error("useAuth must be inside AuthProvider");
	return c;
}
//#endregion
export { useAuth as n, AuthProvider as t };
