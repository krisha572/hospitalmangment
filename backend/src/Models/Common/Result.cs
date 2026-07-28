namespace backend.Models.Common;

public class Result<T>
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string> Errors { get; set; } = new();

    public static Result<T> Success(T data, string message = "Operation completed successfully.") =>
        new() { IsSuccess = true, Data = data, Message = message };

    public static Result<T> Failure(string message, List<string>? errors = null) =>
        new() { IsSuccess = false, Message = message, Errors = errors ?? new() };
}
