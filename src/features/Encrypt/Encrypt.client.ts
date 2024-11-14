import { IError } from "interfaces"; // обработка ошибок

import { API_BASE_URL } from "features/Environment"; // обращение к URL API
import { showError } from "features/Toast";

import { EncryptResponse } from "./Encrypt.model"; // ответ сервера после шифрования

// отправка файла на сервер для шифрования:
export const clientEncryptFile = async (
	file: File,
	totalParts: number,
	neededParts: number,
) => {
	const formData = new FormData(); // в него добавляются файл и параметры для схемы Шамира
	formData.append("totalParts", totalParts.toString());
	formData.append("neededParts", neededParts.toString());
	formData.append("file", file);
// отправление запроса методом POST на сервер по адресу /upload_txt
	const response = await fetch(`${API_BASE_URL}/upload_txt`, {
		method: "POST",
		body: formData, // передача данных в теле запроса
	});

	const json = (await response.json()) as EncryptResponse & IError;
	if (json?.error) {
		showError([json?.error]);
		throw new Error(json?.error);
	}

	return json as EncryptResponse;
};
