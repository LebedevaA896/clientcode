/*EncryptResponse описывает структуру ответа от сервера.
Поле encMessage содержит зашифрованное сообщение,
а keys — части ключа, необходимые для расшифровки.*/

export interface EncryptResponse {
	encMessage: string;
	keys: string;
}
