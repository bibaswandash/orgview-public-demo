const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const source = fs.readFileSync(path.join(__dirname, "..", "src", "orgview.html"), "utf8");

test("public application source has no remote endpoints or original internal sample content", () => {
  assert.doesNotMatch(source, /https?:\/\/|mailto:|@microsoft\.com|Satya|Charles|Shameen|Microsoft/i);
  assert.doesNotMatch(source, /fetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/);
  assert.match(source, /connect-src 'none'/);
  assert.match(source, /OrgViewPublicFictionalDB-v1/);
  assert.doesNotMatch(source, /['"]OrgViewDB['"]/);
});

test("original views, planning and exports remain in the application", () => {
  for (const id of ["view-tree", "view-radial", "view-swimlane", "view-roles", "view-credits"]) assert.ok(source.includes(`id="${id}"`));
  for (const name of ["playSessionChanges", "saveSessionFile", "loadSessionFile", "exportReplayVideo", "openTickTock", "addRolePosition", "clearPublicDemoStorage"]) {
    assert.ok(source.includes(`function ${name}(`), name);
  }
  for (const script of source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
    new vm.Script(script[1]);
  }
});

test("fictional seed has complete acyclic manager references and no real-person identifiers", () => {
  const seed = source.match(/const CURRENT = (\[[\s\S]*?\n\]);/);
  assert.ok(seed);
  const nodes = JSON.parse(seed[1]);
  assert.equal(nodes.length, 16);
  const byId = new Map(nodes.map((node) => [node.id, node]));
  assert.equal(nodes.filter((node) => node.mgr === null).length, 1);
  for (let node of nodes) {
    assert.match(node.employeeId, /^DEMO-/);
    assert.match(node.alias, /^fictional-/);
    const seen = new Set();
    while (node.mgr !== null) {
      assert.equal(seen.has(node.id), false);
      seen.add(node.id);
      node = byId.get(node.mgr);
      assert.ok(node);
    }
  }
});
