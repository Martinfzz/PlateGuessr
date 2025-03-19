const { sendVerificationMail } = require("../../utils/sendVerificationMail");
const { createMailTransporter } = require("../../utils/createMailTransporter");

jest.mock("../../utils/createMailTransporter");

describe("sendVerificationMail", () => {
  let mockSendMail;

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
      emailToken: "testToken",
    };

    sendVerificationMail(user);

    expect(createMailTransporter).toHaveBeenCalled();
    expect(mockSendMail).toHaveBeenCalledWith(
      {
        from: '"Plateguessr" <plateguessr@outlook.com>',
        to: user.email,
        subject: "Verify your account",
        html: `
    <p>Hello ${user.email}</p>
    <p>Thank you for signing up! Please verify your email by clicking the link below:</p>
    <a href='${process.env.CLIENT_URL}?emailToken=${user.emailToken}'>Verify my email</a>
    <p>If you didn’t sign up, you can ignore this email.</p>
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
      emailToken: "testToken",
    };

    sendVerificationMail(user);

    expect(consoleSpy).toHaveBeenCalledWith(new Error("Failed to send email"));
    consoleSpy.mockRestore();
  });

  test("should log success message if sendMail succeeds", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    const user = {
      email: "test@example.com",
      emailToken: "testToken",
    };

    sendVerificationMail(user);

    expect(consoleSpy).toHaveBeenCalledWith("Verification email sent");
    consoleSpy.mockRestore();
  });
});
