import { useCallback, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";

import { download } from "utils";

import { showWarning } from "features/Toast";

import { clientEncryptFile } from "../../Encrypt.client"; // запрос на сервер
import { EncryptResponse } from "../../Encrypt.model"; // обработка отвера от сервера
import styles from "./Encrypt.module.scss";

const Encrypt = () => {
	const [file, setFile] = useState<File>(); // выбранный файл
	const [totalParts, setTotalParts] = useState(2); //общее количество ключей
	const [neededParts, setNeededParts] = useState(2); // пороговое значение ключей
	const fileInputRef = useRef<HTMLInputElement>(null); // ссылка на элемент для ввода файла

// handleFileChange обрабатывает выбор файла. Если выбран хотя бы один файл, сохраняет его в состоянии file
	const handleFileChange = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			if (event.target.files && event.target.files.length > 0) {
				setFile(event.target.files[0]);
			}
		},
		[fileInputRef],
	);

/*Функция handleDownload создает объект Blob для зашифрованного сообщения и загружает его,
добавляя расширение .enc. Затем создает Blob для ключей и также загружает их в виде отдельного файла.*/
	const handleDownload = useCallback(
		async (jsonData: EncryptResponse, fileName: string) => {
			const encBlob = new Blob([jsonData.encMessage], {
				type: "text/plain",
			});
			const encUrl = URL.createObjectURL(encBlob);
			download(encUrl, `${fileName}.enc`);

			const keysBlob = new Blob([jsonData.keys], { type: "text/plain" });
			const keysUrl = URL.createObjectURL(keysBlob);
			download(keysUrl, `keys_${fileName}`);
		},
		[],
	);

// проверка наличия файла (если выбран - запрос на сервер с пар. totalParts, neededParts)
	const handleEncrypt = useCallback(async () => {
		if (!file) {
			showWarning(["Пожалуйста выберите файл"]);
			return;
		}
// После успешного ответа от сервера вызывает handleDownload для загрузки зашифрованного файла и ключей.

		const response = await clientEncryptFile(file, totalParts, neededParts);
		await handleDownload(response, file.name);
// Очищает поле для выбора файла после шифрования.
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, [fileInputRef, totalParts, neededParts, handleDownload, file]);

	return (
		<div className={styles.container}>
			<h1>Шифровать файл</h1>
			<Form className={"col-8"}>
				<Form.Group className="mb-3">
					<Form.Control
						type={"file"}
						accept={".txt"}
						onChange={handleFileChange}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Общее количество частей ключа</Form.Label>
					<Form.Control
						type={"number"}
						min={2}
						max={10}
						value={totalParts}
						onChange={e => setTotalParts(parseInt(e.target.value))}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Части ключа для расшифровки</Form.Label>
					<Form.Control
						type={"number"}
						min={2}
						max={totalParts}
						value={neededParts}
						onChange={e => setNeededParts(parseInt(e.target.value))}
					/>
				</Form.Group>
				<Button onClick={handleEncrypt} className={styles.button}>
					Шифровать
				</Button>
			</Form>
		</div>
	);
};

export { Encrypt };
