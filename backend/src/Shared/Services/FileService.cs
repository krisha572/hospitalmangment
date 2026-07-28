using Microsoft.AspNetCore.Http;

namespace backend.Shared.Services;

public interface IFileService
{
    Task<string> UploadFileAsync(IFormFile file, string subFolder);
    bool DeleteFile(string relativeFilePath);
}

public class FileService : IFileService
{
    private readonly string _baseUploadPath;

    public FileService()
    {
        _baseUploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(_baseUploadPath))
        {
            Directory.CreateDirectory(_baseUploadPath);
        }
    }

    public async Task<string> UploadFileAsync(IFormFile file, string subFolder)
    {
        if (file == null || file.Length == 0)
            return string.Empty;

        var folderPath = Path.Combine(_baseUploadPath, subFolder);
        if (!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
        }

        var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
        var filePath = Path.Combine(folderPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Path.Combine("uploads", subFolder, fileName).Replace("\\", "/");
    }

    public bool DeleteFile(string relativeFilePath)
    {
        if (string.IsNullOrWhiteSpace(relativeFilePath)) return false;

        var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", relativeFilePath);
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
            return true;
        }

        return false;
    }
}
