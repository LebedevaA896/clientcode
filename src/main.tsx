import "bootstrap/dist/css/bootstrap.min.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "features/App";
import { environmentEnv, environmentVersion } from "features/Environment";

import "./index.scss";

console.info(
	`%cVault v${environmentVersion} ${environmentEnv.toUpperCase()} (built on ${BUILD_DATE})`,
	"background-color: #2e7d32; border-radius: 3px; color: #e8f5e9; padding: 2px 4px",
);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
