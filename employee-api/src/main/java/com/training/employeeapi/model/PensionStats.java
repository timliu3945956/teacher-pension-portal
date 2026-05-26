package com.training.employeeapi.model;

public class PensionStats {

    private long totalRetirees;
    private long activeCount;
    private long suspendedCount;
    private long deceasedCount;
    private double totalMonthlyPayout;
    private double avgMonthlyPension;

    public PensionStats(long totalRetirees, long activeCount, long suspendedCount,
                        long deceasedCount, double totalMonthlyPayout, double avgMonthlyPension) {
        this.totalRetirees = totalRetirees;
        this.activeCount = activeCount;
        this.suspendedCount = suspendedCount;
        this.deceasedCount = deceasedCount;
        this.totalMonthlyPayout = totalMonthlyPayout;
        this.avgMonthlyPension = avgMonthlyPension;
    }

    public long getTotalRetirees()       { return totalRetirees; }
    public long getActiveCount()         { return activeCount; }
    public long getSuspendedCount()      { return suspendedCount; }
    public long getDeceasedCount()       { return deceasedCount; }
    public double getTotalMonthlyPayout(){ return totalMonthlyPayout; }
    public double getAvgMonthlyPension() { return avgMonthlyPension; }
}
