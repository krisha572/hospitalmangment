namespace backend.DTOs;

public class BranchDto
{
    public int Id { get; set; }
    public string BranchCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    public string WorkingHours { get; set; } = string.Empty;
    public string BranchManagerName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int HospitalId { get; set; }
    public string HospitalName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class BranchCreateDto
{
    public string BranchCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    public string WorkingHours { get; set; } = string.Empty;
    public string BranchManagerName { get; set; } = string.Empty;
    public int HospitalId { get; set; }
}

public class DepartmentDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string HeadOfDepartment { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int? BranchId { get; set; }
    public int DoctorCount { get; set; }
}

public class DepartmentCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string HeadOfDepartment { get; set; } = string.Empty;
    public int? BranchId { get; set; }
}
