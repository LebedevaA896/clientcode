import { Fragment } from "react";
import { Bounce, ToastOptions, toast } from "react-toastify";

const toastDefaultOptions: ToastOptions = {
	position: "top-left",
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	theme: "light",
	transition: Bounce,
};

const showInfo = (text: string[]) => {
	const textNode = (
		<Fragment>
			{text.map((item, index) => (
				<p key={index}>{item}</p>
			))}
		</Fragment>
	);

	toast.info(textNode, toastDefaultOptions);
};

const showError = (text: string[]) => {
	const textNode = (
		<Fragment>
			{text.map((item, index) => (
				<p key={index}>{item}</p>
			))}
		</Fragment>
	);

	toast.error(textNode, toastDefaultOptions);
};

const showSuccess = (text: string[]) => {
	const textNode = (
		<Fragment>
			{text.map((item, index) => (
				<p key={index}>{item}</p>
			))}
		</Fragment>
	);

	toast.success(textNode, toastDefaultOptions);
};

const showWarning = (text: string[]) => {
	const textNode = (
		<Fragment>
			{text.map((item, index) => (
				<p key={index}>{item}</p>
			))}
		</Fragment>
	);

	toast.warning(textNode, toastDefaultOptions);
};

export { showInfo, showError, showWarning, showSuccess };
