// import { renderHook, act } from "@testing-library/react-hooks";
// import { useGame } from "../useGame"; // Assurez-vous que le chemin est correct
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setGameOptions,
//   setHoverInfo,
//   setPopupInfo,
//   setPlayedCountryInfo,
//   setMarkers,
//   setIsPlaying,
// } from "../features/game/gameSlice";
// import { GameOptions, PlayedCountryInfo, PopupInfo } from "shared.types";

// jest.mock("react-redux");

// describe("useGame", () => {
//   const mockDispatch = jest.fn();

//   beforeEach(() => {
//     (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
//     (useSelector as jest.Mock).mockImplementation((callback) => {
//       return callback({
//         game: {
//           gameOptions: {
//             toggleColors: true,
//             toggleBorders: true,
//             toggleLabels: true,
//             color: "#fff",
//             gameMode: "",
//             numberOfRounds: 20,
//           },
//           popupInfo: null,
//           playedCountryInfo: {
//             countryId: "",
//             countryName: "",
//             score: 0,
//           },
//         },
//       });
//     });
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test("should initialize game state correctly", () => {
//     const { result } = renderHook(() => useGame());

//     expect(result.current.gameOptions).toEqual({
//       toggleColors: true,
//       toggleBorders: true,
//       toggleLabels: true,
//       color: "#fff",
//       gameMode: "",
//       numberOfRounds: 20,
//     });
//     expect(result.current.popupInfo).toBeNull();
//     expect(result.current.playedCountryInfo).toEqual({
//       countryId: "",
//       countryName: "",
//       score: 0,
//     });
//   });

//   test("should dispatch setGameOptions action", () => {
//     const { result } = renderHook(() => useGame());

//     const newGameOptions: GameOptions = {
//       toggleColors: false,
//       toggleBorders: false,
//       toggleLabels: false,
//       color: "#000",
//       gameMode: "test",
//       numberOfRounds: 10,
//     };

//     act(() => {
//       result.current.setGameOptions(newGameOptions);
//     });

//     expect(mockDispatch).toHaveBeenCalledWith(setGameOptions(newGameOptions));
//   });

//   test("should dispatch setHoverInfo action", () => {
//     const { result } = renderHook(() => useGame());

//     const hoverInfo = {
//       countryId: "testCountryId",
//       countryName: "testCountryName",
//     };

//     act(() => {
//       result.current.setHoverInfo(hoverInfo);
//     });

//     expect(mockDispatch).toHaveBeenCalledWith(setHoverInfo(hoverInfo));
//   });

//   test("should dispatch setPopupInfo action", () => {
//     const { result } = renderHook(() => useGame());

//     const popupInfo: PopupInfo = {
//       longitude: 10,
//       latitude: 50,
//       countryName: "testCountryName",
//     };

//     act(() => {
//       result.current.setPopupInfo(popupInfo);
//     });

//     expect(mockDispatch).toHaveBeenCalledWith(setPopupInfo(popupInfo));
//   });

//   test("should dispatch setPlayedCountryInfo action", () => {
//     const { result } = renderHook(() => useGame());

//     const playedCountryInfo: PlayedCountryInfo = {
//       countryId: "testCountryId",
//       countryName: "testCountryName",
//       score: 100,
//     };

//     act(() => {
//       result.current.setPlayedCountryInfo(playedCountryInfo);
//     });

//     expect(mockDispatch).toHaveBeenCalledWith(
//       setPlayedCountryInfo(playedCountryInfo)
//     );
//   });

//   test("should dispatch setMarkers action", () => {
//     const { result } = renderHook(() => useGame());

//     const markers = {
//       user: [{ longitude: 10, latitude: 50 }],
//       correct: [{ longitude: 20, latitude: 60 }],
//     };

//     act(() => {
//       result.current.setMarkers(markers);
//     });

//     expect(mockDispatch).toHaveBeenCalledWith(setMarkers(markers));
//   });

//   test("should dispatch setIsPlaying action", () => {
//     const { result } = renderHook(() => useGame());

//     act(() => {
//       result.current.setIsPlaying(true);
//     });

//     expect(mockDispatch).toHaveBeenCalledWith(setIsPlaying(true));
//   });
// });
