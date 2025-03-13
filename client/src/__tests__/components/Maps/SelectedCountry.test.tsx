import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider, useDispatch } from "react-redux";
import configureStore from "redux-mock-store";
import SelectedCountry from "../../../components/Maps/SelectedCountry";
import { setPopupInfo } from "../../../features/game/gameSlice";

const mockStore = configureStore([]);
const store = mockStore({
  game: {
    popupInfo: {
      longitude: 10,
      latitude: 20,
      zoom: 5,
      countryId: 1,
      name: "Test",
      color: "#000",
    },
  },
});

jest.mock("react-map-gl", () => ({
  Popup: ({
    children,
    onClose,
  }: {
    children: React.ReactNode;
    onClose: () => void;
    [key: string]: any;
  }) => (
    <div data-testid="popup" onClick={onClose}>
      {children}
    </div>
  ),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

describe("SelectedCountry Component", () => {
  const handleOnPlay = jest.fn();

  const setup = (store: any) => {
    const dispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatch);

    render(
      <Provider store={store}>
        <SelectedCountry handleOnPlay={handleOnPlay} />
      </Provider>
    );

    return { dispatch };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders SelectedCountry component with popup", () => {
    setup(store);

    expect(screen.getByText("app_common.play")).toBeInTheDocument();
  });

  test("calls handleOnPlay when Play button is clicked", () => {
    setup(store);

    fireEvent.click(screen.getByText("app_common.play"));
    expect(handleOnPlay).toHaveBeenCalled();
  });

  test("does not render popup when popupInfo is null", () => {
    const store = mockStore({
      game: {
        popupInfo: null,
      },
    });

    setup(store);

    expect(screen.queryByText("app_common.play")).not.toBeInTheDocument();
  });

  test("should render country flag image", () => {
    setup(store);

    const img = screen.getByAltText("country flag") as HTMLImageElement;
    expect(img).toHaveAttribute("src", "/images/test.jpg");
  });

  test("should render country name", () => {
    setup(store);

    expect(screen.getByText("countries.names.test")).toBeInTheDocument();
  });

  test("calls dispatch with setPopupInfo on popup close", () => {
    const { dispatch } = setup(store);

    const popup = screen.getByTestId("popup");
    fireEvent.click(popup);

    expect(dispatch).toHaveBeenCalledWith(
      setPopupInfo({
        longitude: null,
        latitude: null,
        zoom: null,
        countryId: null,
        name: "",
        color: "#fff",
      })
    );
  });
});
