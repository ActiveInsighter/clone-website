import assert from "node:assert/strict";
import test from "node:test";

import {
  openAiFeatureCards,
  openAiPromptSuggestions,
} from "../src/sites/openai/components/openai-home-data.ts";

test("keeps real prompt content and the featured card contract", () => {
  assert.ok(openAiPromptSuggestions.length > 0);
  assert.equal(openAiFeatureCards[0].size, "large");
  assert.equal(openAiFeatureCards[1].size, "medium");
});
