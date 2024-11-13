import { IError } from "interfaces";

import { API_BASE_URL } from "features/Environment";
import { showError } from "features/Toast";

import { DecryptResponse } from "./Decrypt.model";

export const clientDecryptFile = async (file: File, keys: string) => {
	const formData = new FormData();
	formData.append("keys", keys);
	formData.append("file", file);

	const response = await fetch(`${API_BASE_URL}/upload_enc`, {
		method: "POST",
		body: formData,
	});

	const json = (await response.json()) as DecryptResponse & IError;
	if (json?.error) {
		showError([json?.error]);
		throw new Error(json?.error);
	}

	return json as DecryptResponse;
};
