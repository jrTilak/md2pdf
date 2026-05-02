import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";
import { MdConfigProvider } from "./providers/md-config-provider.tsx";

const root = document.getElementById("root");

if (!root) {
	throw new Error("Root Element Not Found");
}

createRoot(root).render(
	<StrictMode>
		<MdConfigProvider>
			<App />
		</MdConfigProvider>
	</StrictMode>,
);
