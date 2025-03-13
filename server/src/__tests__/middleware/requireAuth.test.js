const requireAuth = require("../../middleware/requireAuth");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");
jest.mock("../../models/userModel");

describe("requireAuth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: "Bearer testToken",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 401 if no authorization header", async () => {
    req.headers.authorization = undefined;

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Authorization token required",
    });
  });

  test("should return 401 if token verification fails", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Request is not authorized",
    });
  });

  // test("should call next if token is valid", async () => {
  //   jwt.verify.mockReturnValue({ _id: "testUserId" });
  //   User.findOne.mockResolvedValue({ _id: "testUserId" });

  //   await requireAuth(req, res);

  //   expect(User.findOne).toHaveBeenCalledWith({ _id: "testUserId" });
  //   expect(req.user).toEqual({ _id: "testUserId" });
  //   expect(next).toHaveBeenCalled();
  // });
});
