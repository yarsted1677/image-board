import test from "node:test";
import assert from "node:assert/strict";
import { getImages } from "../lib/image-provider.mjs";
import { AVAILABLE_SFW_TAGS, SFW_TAGS } from "../lib/image-categories.mjs";

test("available categories retain the original names", () => {
    assert.equal(AVAILABLE_SFW_TAGS.length, 26);
    assert.ok(AVAILABLE_SFW_TAGS.every(tag => SFW_TAGS.includes(tag)));
});

test("nekos.best uses its batch limit and normalizes URLs", async t => {
    t.mock.method(globalThis, "fetch", async (url, options) => {
        assert.equal(url, "https://nekos.best/api/v2/hug?amount=20");
        assert.match(options.headers["User-Agent"], /ImageBoard/);
        assert.ok(options.signal instanceof AbortSignal);
        return Response.json({ results: [
            { url: "https://example.com/hug.gif" }, { url: "https://example.com/hug.gif" },
            { url: "javascript:alert(1)" }, {}, { url: "http://example.com/insecure.gif" }
        ] });
    });
    assert.deepEqual(await getImages({ category: "hug" }), ["https://example.com/hug.gif"]);
});

for (const [category, tag] of [["megumin", "megumin"], ["shinobu", "oshino_shinobu"]]) {
    test(`${category} uses a safe character filter and pagination`, async t => {
        t.mock.method(globalThis, "fetch", async url => {
            const query = new URL(url).searchParams;
            assert.equal(query.get("tags"), `${tag} rating:general`);
            assert.equal(query.get("pid"), "2");
            assert.equal(query.get("limit"), "20");
            return Response.json([
                { rating: "general", file_url: "https://example.com/character.jpg" },
                { rating: "explicit", file_url: "https://example.com/blocked.jpg" }
            ]);
        });
        assert.deepEqual(await getImages({ category, page: 2 }), ["https://example.com/character.jpg"]);
    });
}

test("lick uses the single-GIF endpoint", async t => {
    t.mock.method(globalThis, "fetch", async url => {
        assert.equal(url, "https://api.otakugifs.xyz/gif?reaction=lick");
        return Response.json({ url: "https://example.com/lick.gif" });
    });
    assert.deepEqual(await getImages({ category: "lick" }), ["https://example.com/lick.gif"]);
});

test("unsupported and NSFW categories never call an upstream", async t => {
    const mocked = t.mock.method(globalThis, "fetch", () => assert.fail("Unexpected fetch"));
    for (const category of ["bully", "awoo", "glomp", "kill", "cringe"]) {
        await assert.rejects(getImages({ category }), { status: 503 });
    }
    for (const category of ["waifu", "neko", "trap", "blowjob"]) {
        await assert.rejects(getImages({ type: "nsfw", category }), { status: 503 });
    }
    assert.equal(mocked.mock.callCount(), 0);
});

test("invalid requests are rejected before fetching", async t => {
    t.mock.method(globalThis, "fetch", () => assert.fail("Unexpected fetch"));
    for (const input of [{ type: "invalid" }, { category: "../hug" }, { page: -1 }, { page: 1.5 }, { page: 1001 }]) {
        await assert.rejects(getImages(input), { status: 400 });
    }
});

test("upstream HTTP errors produce a retryable error", async t => {
    t.mock.method(globalThis, "fetch", async () => new Response("Rate limited", { status: 429 }));
    await assert.rejects(getImages(), { status: 502, message: "Images could not be loaded. Please try again." });
});

test("malformed responses produce a retryable error", async t => {
    t.mock.method(globalThis, "fetch", async () => Response.json({ unexpected: true }));
    await assert.rejects(getImages(), { status: 502 });
});

test("empty character results remain empty without unrelated fallback images", async t => {
    t.mock.method(globalThis, "fetch", async () => Response.json([]));
    assert.deepEqual(await getImages({ category: "megumin" }), []);
});
