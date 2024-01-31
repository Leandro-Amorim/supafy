export default async function fetchAPIForm<T1>(url: string, body: FormData) {
	try {

		let config = {
			method: 'POST',
			body,
		};

		const resp = await fetch('/api/' + url, config);
		const data: T1 = await resp.json();

		return data;
	}
	catch (error) {
		console.error(error);
		const err = {
			status: "error",
			reason: error,
		} as T1;
		return err;
	}
}