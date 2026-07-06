import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { PopulationTypeSelector } from "./population-type-selector";

test("renders the four population types as a radio group", () => {
  render(<PopulationTypeSelector selectedType="総人口" onChange={vi.fn()} />);

  expect(screen.getAllByRole("radio")).toHaveLength(4);
  expect(screen.getByRole("radio", { name: "総人口" })).toBeChecked();
  expect(screen.getByRole("radio", { name: "老年人口" })).not.toBeChecked();
});

test("clicking a type name reports that type", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<PopulationTypeSelector selectedType="総人口" onChange={onChange} />);

  // Clicking the visible text must work — the label is the hit target
  await user.click(screen.getByText("生産年齢人口"));

  expect(onChange).toHaveBeenCalledExactlyOnceWith("生産年齢人口");
});
