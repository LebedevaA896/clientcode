export const download = (url: string, filename: string) => {
	const link = document.createElement("a"); // вирт.ссылка - иннициирование скачивания файла
	// установка адреса и имени файла
	link.href = url;
	link.setAttribute("download", filename);

	document.body.appendChild(link); // добавление ссылки в DOM - генерация события клика по ссылке

	link.click(); // скачивание

	if (link.parentNode) { // после скачивания - удаление из dom
		link.parentNode.removeChild(link);
	}
};
