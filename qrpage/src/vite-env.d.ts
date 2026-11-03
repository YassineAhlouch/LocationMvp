/// <reference types="vite/client" />

interface ImportMetaEnv {
    /**
     * API root of the public landing endpoints. Defaults to the same origin
     * (/api/v1, proxied to Laravel in dev); set a full URL when the page is
     * served apart from the backend.
     */
    readonly VITE_API_ROOT?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
