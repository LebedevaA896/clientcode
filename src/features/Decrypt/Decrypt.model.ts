// Интерфейс DecryptResponse описывает ответ сервера для операции расшифровки.
// В нем содержится decMessage — строка с расшифрованным сообщением или файлом.
export interface DecryptResponse {
	decMessage: string;
}
