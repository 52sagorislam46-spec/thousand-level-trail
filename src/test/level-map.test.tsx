import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LevelMapPage } from "@/routes/index";

async function renderMap() {
  render(<LevelMapPage />);
  await waitFor(() =>
    expect(screen.getAllByRole("button", { name: /^লেভেল \d+$/ })).toHaveLength(1000),
  );
}

afterEach(() => {
  localStorage.clear();
  cleanup();
});

describe("Level map", () => {
  it("renders all 1000 levels", async () => {
    await renderMap();
    expect(screen.getAllByRole("button", { name: /^লেভেল \d+$/ })).toHaveLength(1000);
  });

  it("starts with levels 1–5 completed and level 6 as the current level", async () => {
    await renderMap();
    // Levels 1–2 earned 3 stars, levels 3–5 earned 2 stars.
    expect(screen.getAllByLabelText("৩ তারা")).toHaveLength(2);
    expect(screen.getAllByLabelText("২ তারা")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "লেভেল 6" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("playing a level earns 3 stars and unlocks the next level", async () => {
    await renderMap();
    fireEvent.click(screen.getByRole("button", { name: "লেভেল 6" }));
    fireEvent.click(screen.getByRole("button", { name: "খেলুন" }));
    await waitFor(() => expect(screen.getByLabelText("৩ তারা")).toHaveLength(3));
    expect(screen.getByRole("button", { name: "লেভেল 7" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });
});
