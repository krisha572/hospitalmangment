using Microsoft.Extensions.Logging;

namespace backend.Shared.Services;

public interface ISmsService
{
    Task<bool> SendSmsAsync(string phoneNumber, string message);
    Task<bool> SendOtpAsync(string phoneNumber, string otpCode);
}

public class TwilioService : ISmsService
{
    private readonly ILogger<TwilioService> _logger;

    public TwilioService(ILogger<TwilioService> logger)
    {
        _logger = logger;
    }

    public Task<bool> SendSmsAsync(string phoneNumber, string message)
    {
        _logger.LogInformation("Sending SMS to {PhoneNumber}: {Message}", phoneNumber, message);
        // Twilio integration point - placeholder for production API credentials
        return Task.FromResult(true);
    }

    public Task<bool> SendOtpAsync(string phoneNumber, string otpCode)
    {
        var message = $"Your Hospital Management verification code is: {otpCode}. Valid for 10 minutes.";
        return SendSmsAsync(phoneNumber, message);
    }
}
