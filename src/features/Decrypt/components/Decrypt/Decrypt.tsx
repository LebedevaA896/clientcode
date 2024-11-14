import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";

import { download } from "utils"; // импорт функции для скачивания файлов

import { clientDecryptFile } from "features/Decrypt/Decrypt.client"; // для запроса к серверу
import { showWarning } from "features/Toast"; // для вывода ошибок

import { DecryptResponse } from "../../Decrypt.model"; // для обработки ответа
import styles from "./Decrypt.module.scss";

const Decrypt = () => {
	const [file, setFile] = useState<File>(); // выбранный файл для расшифровки
	const [firstKey, setFirstKey] = useState<string>(""); // первый введеный ключ
	const [totalKeys, setTotalKeys] = useState<number>(0); // пороговое количество ключей
	const [keys, setKeys] = useState<string[]>([]); // массив ключей
	const fileInputRef = useRef<HTMLInputElement>(null); // ссылка на html элемент для ввода файла

// Функция handleFileChange обрабатывает выбор файла. Если выбран хотя бы один файл, он сохраняется в file
	const handleFileChange = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			if (event.target.files && event.target.files.length > 0) { // были ли выбраны файлы
				setFile(event.target.files[0]);
			}
		},
		[fileInputRef],
	);

// Функция handleDownload создает объект Blob из расшифрованного сообщения и
// вызывает download для его скачивания. Расширение .enc удаляется из имени файла
	const handleDownload = useCallback(
		async (jsonData: DecryptResponse, fileName: string) => {
			const decBlob = new Blob([jsonData.decMessage], {
				type: "text/plain",
			});
			const decUrl = URL.createObjectURL(decBlob);
			download(decUrl, fileName.replace(".enc", ""));
		},
		[],
	);

/*handleDecrypt проверяет наличие файла, объединяет ключи в строку,
отправляет запрос на сервер и вызывает handleDownload для загрузки расшифрованного файла.
Очищает поле выбора файла после расшифровки.*/
	const handleDecrypt = useCallback(async () => {
		if (!file) {
			showWarning(["Please select a file"]);
			return;
		}

		const formattedKeys = keys.join("\n");

		const response = await clientDecryptFile(file, formattedKeys);
		handleDownload(response, file.name);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, [file, keys, handleDownload, fileInputRef]);

// handleKeyChange обновляет значение ключа в массиве keys по индексу
	const handleKeyChange = (index: number, value: string) => {
		const newKeys = [...keys];
		newKeys[index] = value;
		setKeys(newKeys);
	};

// useEffect следит за изменениями firstKey. Если формат ключа соответствует условию,
// то устанавливается totalKeys, и массив keys инициализируется значениями ключей.
	useEffect(() => {
		const keyParts = firstKey.split(":");
		if (keyParts.length >= 3) {
			const count = parseInt(keyParts[2]);
			if (!isNaN(count) && count > 0) {
				setTotalKeys(count);
				setKeys([firstKey, ...Array(count - 1).fill("")]);
			}
		}
	}, [firstKey]);

	return (
		<div className={styles.container}>
			<h1>Расшифровать</h1>
			<Form className={"col-8"}>
				<Form.Group className="mb-3">
					<Form.Control
						type={"file"}
						accept={".enc"}
						onChange={handleFileChange}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Введите первый ключ</Form.Label>
					<Form.Control
						type={"text"}
						value={firstKey}
						onChange={e => setFirstKey(e.target.value)}
					/>
				</Form.Group>
// Если требуется больше одного ключа, отображает дополнительные поля для ввода ключей:
				{totalKeys > 1 &&
					keys.slice(1).map((key, index) => (
						<Form.Group key={index + 1} className="mb-3">
							<Form.Label>Ключ {index + 2}</Form.Label>
							<Form.Control
								type="text"
								value={key}
								onChange={e =>
									handleKeyChange(index + 1, e.target.value)
								}
							/>
						</Form.Group>
					))}
				<Button onClick={handleDecrypt} className={styles.button}>
					Расшифровать
				</Button>
			</Form>
		</div>
	);
};

export { Decrypt };
