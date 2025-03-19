const nodemailer = require("nodemailer");
const { createMailTransporter } = require("../../utils/createMailTransporter");

jest.mock("nodemailer");

describe("createMailTransporter", () => {
  test("should create a mail transporter with correct configuration", () => {
    const mockCreateTransport = jest.fn();
    nodemailer.createTransport.mockReturnValue(mockCreateTransport);

    const transporter = createMailTransporter();

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    expect(transporter).toBe(mockCreateTransport);
  });
});
