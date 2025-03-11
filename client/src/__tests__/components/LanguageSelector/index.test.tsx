import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import LanguageDropdown from "../../../components/LanguageSelector";
import { useTranslation } from "react-i18next";

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

describe("LanguageDropdown Component", () => {
  const setup = () => {
    render(<LanguageDropdown />);
  };

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      i18n: {
        changeLanguage: jest.fn(),
        language: "en",
      },
    });
    localStorage.setItem("i18nextLng", "en");
    setup();
    const dropdownToggle = screen.getByRole("button");
    fireEvent.click(dropdownToggle);
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders dropdown with languages", () => {
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Français")).toBeInTheDocument();
    expect(screen.getByText("Deutsch")).toBeInTheDocument();
    const displayedImg = screen.getByAltText("country flag");
    expect(displayedImg).toHaveAttribute("src", "/media/flags/uk.svg");
    const ukImg = screen.getByAltText("country flag en");
    expect(ukImg).toHaveAttribute("src", "/media/flags/uk.svg");
    const frImg = screen.getByAltText("country flag fr");
    expect(frImg).toHaveAttribute("src", "/media/flags/france.svg");
    const deImg = screen.getByAltText("country flag de");
    expect(deImg).toHaveAttribute("src", "/media/flags/germany.svg");
  });

  test("changes language on selection", () => {
    const frenchItem = screen.getByText("Français");
    fireEvent.click(frenchItem);

    expect(localStorage.getItem("i18nextLng")).toBe("fr");
    expect(useTranslation().i18n.changeLanguage).toHaveBeenCalledWith("fr");
  });

  test('should default to "en" if "i18nextLng" is not in localStorage', () => {
    localStorage.removeItem("i18nextLng");

    const displayedImg = screen.getByAltText("country flag");
    expect(displayedImg).toHaveAttribute("src", "/media/flags/uk.svg");
  });
});
