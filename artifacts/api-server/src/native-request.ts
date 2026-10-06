// Legacy handlers validate JSON payloads themselves. Match their original Request.json typing.
export type JsonRequest = Omit<Request, "json"> & { json(): Promise<any> };
