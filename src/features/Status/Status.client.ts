import { API_BASE_URL } from "features/Environment";

import { Status } from "./Status.model";

export const clientStatusGet = async () => {
	const response = await fetch(`${API_BASE_URL}/ping`, {
		method: "GET",
		signal: AbortSignal.timeout(5000),
	});
	return (await response.json()) as Status;
};
