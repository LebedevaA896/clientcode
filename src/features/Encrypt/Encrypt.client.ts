import { IError } from "interfaces";

import { API_BASE_URL } from "features/Environment";
import { showError } from "features/Toast";

import { EncryptResponse } from "./Encrypt.model";

export const clientEncryptFile = async (
	file: File,
	totalParts: number,
	neededParts: number,
) => {
	const formData = new FormData();
	formData.append("totalParts", totalParts.toString());
	formData.append("neededParts", neededParts.toString());
	formData.append("file", file);

	const response = await fetch(`${API_BASE_URL}/upload_txt`, {
		method: "POST",
		body: formData,
	});

	const json = (await response.json()) as EncryptResponse & IError;
	if (json?.error) {
		showError([json?.error]);
		throw new Error(json?.error);
	}

	return json as EncryptResponse;
};
