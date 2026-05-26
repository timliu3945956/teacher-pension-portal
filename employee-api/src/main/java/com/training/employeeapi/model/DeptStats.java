package com.training.employeeapi.model;

public class DeptStats {

    private String department;
    private long headcount;
    private double totalSalary;
    private double avgSalary;
    private double minSalary;
    private double maxSalary;

    public DeptStats(String department, long headcount, double totalSalary,
                     double avgSalary, double minSalary, double maxSalary) {
        this.department = department;
        this.headcount = headcount;
        this.totalSalary = totalSalary;
        this.avgSalary = avgSalary;
        this.minSalary = minSalary;
        this.maxSalary = maxSalary;
    }

    public String getDepartment() { return department; }
    public long getHeadcount() { return headcount; }
    public double getTotalSalary() { return totalSalary; }
    public double getAvgSalary() { return avgSalary; }
    public double getMinSalary() { return minSalary; }
    public double getMaxSalary() { return maxSalary; }
}
