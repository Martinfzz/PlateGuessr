const { sendResetPasswordMail } = require("../../utils/sendResetPasswordMail");
const { createMailTransporter } = require("../../utils/createMailTransporter");

jest.mock("../../utils/createMailTransporter");

describe("sendResetPasswordMail", () => {
  let mockSendMail;
  const token = "testToken";

  beforeEach(() => {
    mockSendMail = jest.fn((_, callback) => callback(null));
    createMailTransporter.mockReturnValue({ sendMail: mockSendMail });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should send verification email with correct options", () => {
    const user = {
      email: "test@example.com",
    };

    sendResetPasswordMail(user, token);

    expect(createMailTransporter).toHaveBeenCalled();
    expect(mockSendMail).toHaveBeenCalledWith(
      {
        from: '"Plateguessr" <plateguessr@outlook.com>',
        to: user.email,
        subject: "Password Reset",
        html: `
    <p>Hello ${user.email}</p>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href='${process.env.CLIENT_URL}/set-password/${token}'>Reset my password</a>
    <p>If you didn’t request a password reset, you can ignore this email.</p>
    <p>Best,</p>
    <p>Plateguessr Team</p>`,
      },
      expect.any(Function)
    );
  });

  test("should log error if sendMail fails", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    mockSendMail.mockImplementation((_, callback) =>
      callback(new Error("Failed to send email"))
    );

    const user = {
      email: "test@example.com",
    };

    sendResetPasswordMail(user, "testToken");

    expect(consoleSpy).toHaveBeenCalledWith(new Error("Failed to send email"));
    consoleSpy.mockRestore();
  });

  test("should log success message if sendMail succeeds", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    const user = {
      email: "test@example.com",
    };

    sendResetPasswordMail(user, "testToken");

    expect(consoleSpy).toHaveBeenCalledWith("Reset password email sent");
    consoleSpy.mockRestore();
  });
});
