import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";

import { download } from "utils";

import { clientDecryptFile } from "features/Decrypt/Decrypt.client";
import { showWarning } from "features/Toast";

import { DecryptResponse } from "../../Decrypt.model";
import styles from "./Decrypt.module.scss";

const Decrypt = () => {
	const [file, setFile] = useState<File>();
	const [firstKey, setFirstKey] = useState<string>("");
	const [totalKeys, setTotalKeys] = useState<number>(0);
	const [keys, setKeys] = useState<string[]>([]);
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
		async (jsonData: DecryptResponse, fileName: string) => {
			const decBlob = new Blob([jsonData.decMessage], {
				type: "text/plain",
			});
			const decUrl = URL.createObjectURL(decBlob);
			download(decUrl, fileName.replace(".enc", ""));
		},
		[],
	);

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

	const handleKeyChange = (index: number, value: string) => {
		const newKeys = [...keys];
		newKeys[index] = value;
		setKeys(newKeys);
	};

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
			<h1>Decrypt</h1>
			<Form className={"col-8"}>
				<Form.Group className="mb-3">
					<Form.Control
						type={"file"}
						accept={".enc"}
						onChange={handleFileChange}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Enter first key</Form.Label>
					<Form.Control
						type={"text"}
						value={firstKey}
						onChange={e => setFirstKey(e.target.value)}
					/>
				</Form.Group>

				{totalKeys > 1 &&
					keys.slice(1).map((key, index) => (
						<Form.Group key={index + 1} className="mb-3">
							<Form.Label>Key {index + 2}</Form.Label>
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
					Decrypt
				</Button>
			</Form>
		</div>
	);
};

export { Decrypt };
