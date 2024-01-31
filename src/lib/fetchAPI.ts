export default async function fetchAPI<T1, T2>(url: string, body?: T2, method?: string) {
	try {

		let config = {
			method: body ? 'POST' : (method ?? 'GET'),
			headers: body ? { "Content-Type": "application/json" } : undefined,
			body: body ? JSON.stringify(body) : undefined,
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