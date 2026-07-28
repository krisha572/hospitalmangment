using System.Collections.Concurrent;
using backend.Shared.Services;

namespace backend.Infrastructure.Services;

public interface IOtpService
{
    Task<string> GenerateAndSendOtpAsync(string phoneNumber);
    bool VerifyOtp(string phoneNumber, string otpCode);
}

public class OtpService : IOtpService
{
    private static readonly ConcurrentDictionary<string, (string Code, DateTime Expiry)> OtpStore = new();
    private readonly ISmsService _smsService;

    public OtpService(ISmsService smsService)
    {
        _smsService = smsService;
    }

    public async Task<string> GenerateAndSendOtpAsync(string phoneNumber)
    {
        var random = new Random();
        var otpCode = random.Next(100000, 999999).ToString();
        var expiry = DateTime.UtcNow.AddMinutes(10);

        OtpStore[phoneNumber] = (otpCode, expiry);

        await _smsService.SendOtpAsync(phoneNumber, otpCode);
        return otpCode;
    }

    public bool VerifyOtp(string phoneNumber, string otpCode)
    {
        if (OtpStore.TryGetValue(phoneNumber, out var entry))
        {
            if (entry.Expiry >= DateTime.UtcNow && entry.Code == otpCode)
            {
                OtpStore.TryRemove(phoneNumber, out _);
                return true;
            }
        }
        return false;
    }
}
