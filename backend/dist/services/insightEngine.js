"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuIQInsightEngine = void 0;
class MenuIQInsightEngine {
    constructor() {
        this.maxVolume = 0;
        this.maxPrice = 0;
        this.maxCost = 0;
    }
    /**
     * Calculate MenuIQ Score for a single menu item
     */
    calculateMenuIQScore(item, allItems) {
        // Initialize max values if not set
        if (this.maxVolume === 0) {
            this.maxVolume = Math.max(...allItems.map(i => i.sales_count || 0), 1);
            this.maxPrice = Math.max(...allItems.map(i => i.price || 0), 1);
            this.maxCost = Math.max(...allItems.map(i => i.cost || 0), 1);
        }
        // Calculate individual scores
        const profitMarginScore = this.calculateProfitMarginScore(item);
        const salesVolumeScore = this.calculateSalesVolumeScore(item);
        const wasteRiskScore = this.calculateWasteRiskScore(item);
        const seasonalityRiskScore = this.calculateSeasonalityRiskScore(item);
        // Calculate weighted raw score
        const rawScore = ((profitMarginScore * 0.4) +
            (salesVolumeScore * 0.3) +
            (wasteRiskScore * 0.2) +
            (seasonalityRiskScore * 0.1));
        const finalScore = Math.min(Math.round(rawScore), 100);
        // Determine category
        const category = this.getScoreCategory(finalScore);
        // Generate insights and recommendations
        const insights = this.generateInsights(item, {
            profitMarginScore,
            salesVolumeScore,
            wasteRiskScore,
            seasonalityRiskScore
        });
        const recommendations = this.generateRecommendations(item, category, {
            profitMarginScore,
            salesVolumeScore,
            wasteRiskScore,
            seasonalityRiskScore
        });
        // Generate suggested action
        const suggestedAction = this.generateSuggestedAction(item, {
            profitMarginScore,
            salesVolumeScore,
            wasteRiskScore,
            seasonalityRiskScore
        });
        // Determine sales trend (simulated for now)
        const salesTrend = this.determineSalesTrend(item);
        return {
            score: finalScore,
            category,
            breakdown: {
                profitMargin: profitMarginScore,
                salesVolume: salesVolumeScore,
                wasteRisk: wasteRiskScore,
                seasonalityRisk: seasonalityRiskScore
            },
            insights,
            recommendations,
            suggestedAction: suggestedAction.action,
            actionType: suggestedAction.type,
            salesTrend
        };
    }
    /**
     * Generate suggested action based on item performance
     */
    generateSuggestedAction(item, scores) {
        const margin = (item.price || 0) - (item.cost || 0);
        const marginPercentage = item.price > 0 ? (margin / item.price) * 100 : 0;
        const salesCount = item.sales_count || 0;
        const tags = item.tags ? JSON.parse(item.tags) : [];
        const isSeasonal = tags.some((tag) => tag.toLowerCase().includes('seasonal') ||
            tag.toLowerCase().includes('summer') ||
            tag.toLowerCase().includes('winter') ||
            tag.toLowerCase().includes('spring') ||
            tag.toLowerCase().includes('fall'));
        // High margin + low sales = Promote
        if (marginPercentage >= 50 && salesCount < 10) {
            return {
                action: 'Promote this item',
                type: 'promote'
            };
        }
        // Low margin + low sales = Remove
        if (marginPercentage < 20 && salesCount < 5) {
            return {
                action: 'Consider removing',
                type: 'remove'
            };
        }
        // High sales + low margin = Reprice
        if (salesCount >= 20 && marginPercentage < 30) {
            return {
                action: 'Reprice for profit',
                type: 'reprice'
            };
        }
        // Seasonal items
        if (isSeasonal) {
            return {
                action: 'Seasonal – monitor performance',
                type: 'seasonal'
            };
        }
        // High sales + high margin = Top performer
        if (salesCount >= 30 && marginPercentage >= 50) {
            return {
                action: 'Top Performer',
                type: 'top-performer'
            };
        }
        // Default monitoring for items that don't fit other categories
        return {
            action: 'Monitor performance',
            type: 'monitor'
        };
    }
    /**
     * Determine sales trend (simulated based on current data)
     */
    determineSalesTrend(item) {
        const salesCount = item.sales_count || 0;
        // Simulate trend based on sales volume
        // In a real implementation, this would compare week-over-week data
        if (salesCount >= 50)
            return 'increasing';
        if (salesCount >= 20)
            return 'stable';
        return 'declining';
    }
    /**
     * Cluster items by similar tags
     */
    clusterItemsByTags(items) {
        const tagMap = new Map();
        items.forEach(item => {
            const tags = item.tags ? JSON.parse(item.tags) : [];
            tags.forEach((tag) => {
                const normalizedTag = tag.toLowerCase().trim();
                if (!tagMap.has(normalizedTag)) {
                    tagMap.set(normalizedTag, []);
                }
                tagMap.get(normalizedTag).push(item);
            });
        });
        // Convert to array and filter clusters with multiple items
        const clusters = [];
        tagMap.forEach((items, tag) => {
            if (items.length > 1) {
                clusters.push({
                    tag,
                    items,
                    count: items.length
                });
            }
        });
        // Sort by cluster size (largest first)
        return clusters.sort((a, b) => b.count - a.count);
    }
    /**
     * Calculate profit margin score (0-100)
     */
    calculateProfitMarginScore(item) {
        const margin = (item.price || 0) - (item.cost || 0);
        const marginPercentage = item.price > 0 ? (margin / item.price) * 100 : 0;
        // Score based on margin percentage
        if (marginPercentage >= 70)
            return 100;
        if (marginPercentage >= 50)
            return 80;
        if (marginPercentage >= 30)
            return 60;
        if (marginPercentage >= 15)
            return 40;
        if (marginPercentage >= 5)
            return 20;
        return 0;
    }
    /**
     * Calculate sales volume score (0-100)
     */
    calculateSalesVolumeScore(item) {
        const salesCount = item.sales_count || 0;
        const normalizedVolume = salesCount / this.maxVolume;
        // Score based on relative sales volume
        if (normalizedVolume >= 0.8)
            return 100;
        if (normalizedVolume >= 0.6)
            return 80;
        if (normalizedVolume >= 0.4)
            return 60;
        if (normalizedVolume >= 0.2)
            return 40;
        if (normalizedVolume >= 0.1)
            return 20;
        return 0;
    }
    /**
     * Calculate waste risk score (0-100)
     */
    calculateWasteRiskScore(item) {
        const salesCount = item.sales_count || 0;
        // Higher score = lower waste risk
        if (salesCount >= 20)
            return 100;
        if (salesCount >= 15)
            return 80;
        if (salesCount >= 10)
            return 60;
        if (salesCount >= 5)
            return 40;
        if (salesCount >= 2)
            return 20;
        return 0; // High waste risk
    }
    /**
     * Calculate seasonality risk score (0-100)
     */
    calculateSeasonalityRiskScore(item) {
        const tags = item.tags ? JSON.parse(item.tags) : [];
        const isSeasonal = tags.some((tag) => tag.toLowerCase().includes('seasonal') ||
            tag.toLowerCase().includes('summer') ||
            tag.toLowerCase().includes('winter') ||
            tag.toLowerCase().includes('spring') ||
            tag.toLowerCase().includes('fall'));
        // Higher score = lower seasonality risk
        return isSeasonal ? 60 : 100;
    }
    /**
     * Get score category based on final score
     */
    getScoreCategory(score) {
        if (score >= 85)
            return 'excellent';
        if (score >= 70)
            return 'good';
        if (score >= 50)
            return 'average';
        if (score >= 30)
            return 'poor';
        return 'critical';
    }
    /**
     * Generate insights for the menu item
     */
    generateInsights(item, scores) {
        const insights = [];
        const margin = (item.price || 0) - (item.cost || 0);
        const marginPercentage = item.price > 0 ? (margin / item.price) * 100 : 0;
        // Profitability insights
        if (scores.profitMarginScore >= 80) {
            insights.push('Excellent profit margin - consider premium pricing');
        }
        else if (scores.profitMarginScore <= 20) {
            insights.push('Low profit margin - review pricing strategy');
        }
        // Sales volume insights
        if (scores.salesVolumeScore >= 80) {
            insights.push('High sales volume - star performer');
        }
        else if (scores.salesVolumeScore <= 20) {
            insights.push('Low sales volume - consider promotion or removal');
        }
        // Waste risk insights
        if (scores.wasteRiskScore <= 20) {
            insights.push('High waste risk - low turnover item');
        }
        // Seasonality insights
        if (scores.seasonalityRiskScore <= 60) {
            insights.push('Seasonal item - plan for off-season');
        }
        return insights;
    }
    /**
     * Generate recommendations based on score and category
     */
    generateRecommendations(item, category, scores) {
        const recommendations = [];
        const margin = (item.price || 0) - (item.cost || 0);
        const marginPercentage = item.price > 0 ? (margin / item.price) * 100 : 0;
        switch (category) {
            case 'excellent':
                recommendations.push('Consider featuring this item prominently');
                recommendations.push('Monitor for supply chain issues');
                break;
            case 'good':
                recommendations.push('Maintain current pricing strategy');
                recommendations.push('Consider cross-promotion opportunities');
                break;
            case 'average':
                recommendations.push('Review pricing to improve margins');
                recommendations.push('Consider menu placement optimization');
                break;
            case 'poor':
                recommendations.push('Immediate pricing review required');
                recommendations.push('Consider cost reduction strategies');
                break;
            case 'critical':
                recommendations.push('Urgent action needed - consider removal');
                recommendations.push('Review entire item strategy');
                break;
        }
        // Specific recommendations based on individual scores
        if (scores.profitMarginScore <= 20) {
            recommendations.push('Increase price by 10-15% or reduce costs');
        }
        if (scores.salesVolumeScore <= 20) {
            recommendations.push('Promote item or consider removal');
        }
        if (scores.wasteRiskScore <= 20) {
            recommendations.push('Reduce portion sizes or remove from menu');
        }
        return recommendations;
    }
    /**
     * Categorize all menu items by insight type
     */
    categorizeItems(items) {
        const categories = {
            profitability: [],
            popularity: [],
            waste: [],
            seasonality: []
        };
        items.forEach(item => {
            const margin = (item.price || 0) - (item.cost || 0);
            const marginPercentage = item.price > 0 ? (margin / item.price) * 100 : 0;
            const salesCount = item.sales_count || 0;
            const tags = item.tags ? JSON.parse(item.tags) : [];
            // Categorize by profitability
            if (marginPercentage < 20) {
                categories.profitability.push(item);
            }
            // Categorize by popularity
            if (salesCount < 5) {
                categories.popularity.push(item);
            }
            // Categorize by waste risk
            if (salesCount < 3) {
                categories.waste.push(item);
            }
            // Categorize by seasonality
            const isSeasonal = tags.some((tag) => tag.toLowerCase().includes('seasonal') ||
                tag.toLowerCase().includes('summer') ||
                tag.toLowerCase().includes('winter') ||
                tag.toLowerCase().includes('spring') ||
                tag.toLowerCase().includes('fall'));
            if (isSeasonal) {
                categories.seasonality.push(item);
            }
        });
        return categories;
    }
    /**
     * Get overall menu health score
     */
    calculateMenuHealthScore(items) {
        if (items.length === 0)
            return 0;
        const scores = items.map(item => this.calculateMenuIQScore(item, items));
        const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
        return Math.round(totalScore / items.length);
    }
}
exports.MenuIQInsightEngine = MenuIQInsightEngine;
//# sourceMappingURL=insightEngine.js.map