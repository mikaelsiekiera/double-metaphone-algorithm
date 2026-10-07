import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { doubleMetaphone } from "../src/index.js";

describe("doubleMetaphone", () => {
  it("encodes a simple word to a 4-char primary code", () => {
    const r = doubleMetaphone("Smith");
    assert.equal(typeof r.primary, "string");
    assert.equal(typeof r.alternate, "string");
    assert.ok(r.primary.length <= 4);
  });

  it("drops the silent K in KN", () => {
    const r = doubleMetaphone("knight");
    assert.equal(r.primary[0], "N");
  });

  it("drops the silent G in GN", () => {
    const r = doubleMetaphone("gnaw");
    assert.equal(r.primary[0], "N");
  });

  it("drops the silent W in WR", () => {
    const r = doubleMetaphone("wrestle");
    assert.equal(r.primary[0], "R");
  });

  it("treats initial X as S", () => {
    const r = doubleMetaphone("xavier");
    assert.equal(r.primary[0], "S");
  });

  it("encodes PH as F", () => {
    const r = doubleMetaphone("phone");
    assert.ok(r.primary.startsWith("F"));
  });

  it("encodes SH as X", () => {
    const r = doubleMetaphone("shore");
    assert.ok(r.primary.includes("X"));
  });

  it("encodes TH (documented as T, not theta)", () => {
    const r = doubleMetaphone("this");
    assert.ok(r.primary.includes("T"));
  });

  it("treats Z as S (documented simplification)", () => {
    const r = doubleMetaphone("zoo");
    assert.equal(r.primary[0], "S");
  });

  it("returns equal primary and alternate for a plain word", () => {
    const r = doubleMetaphone("cat");
    assert.equal(r.primary, r.alternate);
  });

  it("is case-insensitive", () => {
    const a = doubleMetaphone("Smith");
    const b = doubleMetaphone("SMITH");
    assert.equal(a.primary, b.primary);
    assert.equal(a.alternate, b.alternate);
  });

  it("returns empty strings for non-letter input", () => {
    const r = doubleMetaphone("12345");
    assert.equal(r.primary, "");
    assert.equal(r.alternate, "");
  });

  it("strips punctuation before encoding", () => {
    const r = doubleMetaphone("O'Brien");
    const plain = doubleMetaphone("OBrien");
    assert.equal(r.primary, plain.primary);
  });
});
