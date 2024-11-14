import { IError } from "interfaces"; // для обработки ошибок

import { API_BASE_URL } from "features/Environment";
import { showError } from "features/Toast"; // отображение ошибок

import { DecryptResponse } from "./Decrypt.model"; // описывает структуру ответа

// clientDecryptFile — асинхронная функция для отправки файла и ключей на сервер для расшифровки
export const clientDecryptFile = async (file: File, keys: string) => {
	const formData = new FormData(); // сюда добавляются ключи и файл для след.отправки на сервер
	formData.append("keys", keys);
	formData.append("file", file);
// Выполняется HTTP-запрос методом POST на endpoint /upload_enc, используя formData как тело запроса.
	const response = await fetch(`${API_BASE_URL}/upload_enc`, {
		method: "POST",
		body: formData,
	});
// Обрабатывает ответ сервера в формате JSON.
// Если в ответе есть ошибка, то выводит сообщение об ошибке с помощью showError и выбрасывает исключение с текстом ошибки.
	const json = (await response.json()) as DecryptResponse & IError;
	if (json?.error) {
		showError([json?.error]);
		throw new Error(json?.error);
	}
// Возвращает успешный ответ от сервера, который соответствует интерфейсу DecryptResponse
	return json as DecryptResponse;
};
