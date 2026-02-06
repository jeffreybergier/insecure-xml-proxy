
// XP.js
// This is a crossplatform file to ensure that this project can be
// used with Cloudflare and plain old Node.js

export let HTMLRewriter;
if (globalThis.HTMLRewriter) {
  console.log("[proxy] Using HTMLRewriter from Cloudflare");
  HTMLRewriter = globalThis.HTMLRewriter;
} else {
  console.log("[proxy] Using HTMLRewriter from @miniflare");
  const packageName = "@miniflare/html-rewriter"; 
  const mod = await import(packageName);
  HTMLRewriter = mod.HTMLRewriter;
}

class KVStore {
  constructor(kvNamespace) {
    if (kvNamespace) {
      this.store = kvNamespace;
      this.isMock = false;
    } else {
      this.store = new Map();
      this.isMock = true;
    }
  }

  async get(key) {
    if (!this.isMock) return await this.store.get(key);
    const val = this.store.get(key);
    return val === undefined ? null : val;
  }

  async put(key, value) {
    if (!this.isMock) return await this.store.put(key, value);
    this.store.set(key, value);
  }

  async delete(key) {
    if (!this.isMock) return await this.store.delete(key);
    this.store.delete(key);
  }
}

// THE SINGLETON
// This will be initialized once in _cloudflare.js
export let KVS = null;

/// TODO: Add to readme
/// Using this will require you to set up a KVS namespace in Cloudflare
/// And then update the Wrangler.toml
/// npx wrangler kv namespace create URL_STORE
export function initKV(kvNamespace) {
  if (KVS !== null) return; // Prevent double initialization
  console.log(`[XP.KVS] initialized(${kvNamespace})`);
  KVS = new KVStore(kvNamespace);
}