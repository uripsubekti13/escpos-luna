/// <reference types="node" />
export declare function createStreamFromPath(path: string): Promise<NodeJS.ReadableStream>;
export declare function getRequestStream(address: string): Promise<NodeJS.ReadableStream>;
