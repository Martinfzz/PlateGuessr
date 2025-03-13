import loadingTypes from "../../../shared/helpers/LoadingTypes";

describe("loadingTypes", () => {
  test("should have correct properties and values", () => {
    expect(loadingTypes).toEqual({
      none: "",
      index: "index",
      create: "create",
      update: "update",
      delete: "delete",
      edit: "edit",
      cancel: "cancel",
      error: "error",
    });
  });
});
