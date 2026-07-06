import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import HomePage from "./page";

test("renders the home page", () => {
  render(<HomePage />);
  expect(screen.getByText("Hello world")).toBeInTheDocument();
});
