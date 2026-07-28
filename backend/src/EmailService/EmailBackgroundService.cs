using System.Collections.Concurrent;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace backend.EmailService;

public class EmailMessage
{
    public string ToAddress { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public bool IsBodyHtml { get; set; } = true;
}

public interface IEmailQueue
{
    void QueueEmail(EmailMessage email);
    bool TryDequeue(out EmailMessage? email);
}

public class EmailQueue : IEmailQueue
{
    private readonly ConcurrentQueue<EmailMessage> _queue = new();

    public void QueueEmail(EmailMessage email)
    {
        _queue.Enqueue(email);
    }

    public bool TryDequeue(out EmailMessage? email)
    {
        return _queue.TryDequeue(out email);
    }
}

public class EmailBackgroundService : BackgroundService
{
    private readonly IEmailQueue _emailQueue;
    private readonly ILogger<EmailBackgroundService> _logger;

    public EmailBackgroundService(IEmailQueue emailQueue, ILogger<EmailBackgroundService> logger)
    {
        _emailQueue = emailQueue;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Background Email Service started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            if (_emailQueue.TryDequeue(out var email) && email != null)
            {
                try
                {
                    _logger.LogInformation("Processing queued email to {ToAddress}: {Subject}", email.ToAddress, email.Subject);
                    // SMTP delivery simulation / integration point
                    await Task.Delay(100, stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send queued email to {ToAddress}", email.ToAddress);
                }
            }
            else
            {
                await Task.Delay(1000, stoppingToken);
            }
        }

        _logger.LogInformation("Background Email Service stopped.");
    }
}
