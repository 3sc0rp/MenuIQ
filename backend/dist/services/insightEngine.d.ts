import { MenuItem } from '../types/menu';
export interface MenuIQScore {
    score: number;
    category: 'excellent' | 'good' | 'average' | 'poor' | 'critical';
    breakdown: {
        profitMargin: number;
        salesVolume: number;
        wasteRisk: number;
        seasonalityRisk: number;
    };
    insights: string[];
    recommendations: string[];
    suggestedAction: string;
    actionType: 'promote' | 'remove' | 'reprice' | 'seasonal' | 'top-performer' | 'monitor';
    salesTrend: 'increasing' | 'stable' | 'declining';
}
export interface InsightCategory {
    profitability: MenuItem[];
    popularity: MenuItem[];
    waste: MenuItem[];
    seasonality: MenuItem[];
}
export interface ItemCluster {
    tag: string;
    items: MenuItem[];
    count: number;
}
export declare class MenuIQInsightEngine {
    private maxVolume;
    private maxPrice;
    private maxCost;
    /**
     * Calculate MenuIQ Score for a single menu item
     */
    calculateMenuIQScore(item: MenuItem, allItems: MenuItem[]): MenuIQScore;
    /**
     * Generate suggested action based on item performance
     */
    private generateSuggestedAction;
    /**
     * Determine sales trend (simulated based on current data)
     */
    private determineSalesTrend;
    /**
     * Cluster items by similar tags
     */
    clusterItemsByTags(items: MenuItem[]): ItemCluster[];
    /**
     * Calculate profit margin score (0-100)
     */
    private calculateProfitMarginScore;
    /**
     * Calculate sales volume score (0-100)
     */
    private calculateSalesVolumeScore;
    /**
     * Calculate waste risk score (0-100)
     */
    private calculateWasteRiskScore;
    /**
     * Calculate seasonality risk score (0-100)
     */
    private calculateSeasonalityRiskScore;
    /**
     * Get score category based on final score
     */
    private getScoreCategory;
    /**
     * Generate insights for the menu item
     */
    private generateInsights;
    /**
     * Generate recommendations based on score and category
     */
    private generateRecommendations;
    /**
     * Categorize all menu items by insight type
     */
    categorizeItems(items: MenuItem[]): InsightCategory;
    /**
     * Get overall menu health score
     */
    calculateMenuHealthScore(items: MenuItem[]): number;
}
//# sourceMappingURL=insightEngine.d.ts.map