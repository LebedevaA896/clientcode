import { useCallback, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";

import { download } from "utils";

import { showWarning } from "features/Toast";

import { clientEncryptFile } from "../../Encrypt.client";
import { EncryptResponse } from "../../Encrypt.model";
import styles from "./Encrypt.module.scss";

const Encrypt = () => {
	const [file, setFile] = useState<File>();
	const [totalParts, setTotalParts] = useState(2);
	const [neededParts, setNeededParts] = useState(2);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			if (event.target.files && event.target.files.length > 0) {
				setFile(event.target.files[0]);
			}
		},
		[fileInputRef],
	);

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

	const handleEncrypt = useCallback(async () => {
		if (!file) {
			showWarning(["Please select a file"]);
			return;
		}

		const response = await clientEncryptFile(file, totalParts, neededParts);
		await handleDownload(response, file.name);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, [fileInputRef, totalParts, neededParts, handleDownload, file]);

	return (
		<div className={styles.container}>
			<h1>Encrypt</h1>
			<Form className={"col-8"}>
				<Form.Group className="mb-3">
					<Form.Control
						type={"file"}
						accept={".txt"}
						onChange={handleFileChange}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Total keys parts</Form.Label>
					<Form.Control
						type={"number"}
						min={2}
						max={10}
						value={totalParts}
						onChange={e => setTotalParts(parseInt(e.target.value))}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Keys parts for decrypt</Form.Label>
					<Form.Control
						type={"number"}
						min={2}
						max={totalParts}
						value={neededParts}
						onChange={e => setNeededParts(parseInt(e.target.value))}
					/>
				</Form.Group>
				<Button onClick={handleEncrypt} className={styles.button}>
					Encrypt
				</Button>
			</Form>
		</div>
	);
};

export { Encrypt };
