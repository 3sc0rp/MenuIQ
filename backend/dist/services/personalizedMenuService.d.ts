import { MenuItem, CustomerPreferences, PersonalizedMenuResponse } from '../types/menu';
export declare class PersonalizedMenuService {
    private seasonalTrends;
    private guestFeedbackData;
    /**
     * Generate personalized menu suggestions based on customer preferences
     */
    generatePersonalizedSuggestions(menuItems: MenuItem[], preferences: CustomerPreferences, limit?: number): PersonalizedMenuResponse;
    /**
     * Calculate a personalized score for a menu item
     */
    private calculateItemScore;
    /**
     * Calculate seasonal relevance score
     */
    private calculateSeasonalScore;
    /**
     * Calculate preference matching score
     */
    private calculatePreferenceScore;
    /**
     * Calculate budget compliance score
     */
    private calculateBudgetScore;
    /**
     * Calculate dietary compliance score
     */
    private calculateDietaryScore;
    /**
     * Check dietary compliance for a specific requirement
     */
    private checkDietaryCompliance;
    /**
     * Match spice level preferences
     */
    private matchSpiceLevel;
    /**
     * Create a detailed menu suggestion
     */
    private createMenuSuggestion;
    /**
     * Generate reasons for suggesting this item
     */
    private generateReasons;
    /**
     * Generate notes about the item
     */
    private generateNotes;
    /**
     * Calculate match score (0-100)
     */
    private calculateMatchScore;
    /**
     * Get price category
     */
    private getPriceCategory;
    /**
     * Get dietary compliance list
     */
    private getDietaryCompliance;
    /**
     * Get preference matches
     */
    private getPreferenceMatches;
    /**
     * Generate summary statistics
     */
    private generateSummary;
    /**
     * Generate insights about the menu
     */
    private generateInsights;
    /**
     * Get budget range from suggestions
     */
    private getBudgetRange;
    /**
     * Get current season
     */
    private getCurrentSeason;
    /**
     * Parse tags string into array
     */
    private parseTags;
    /**
     * Get guest feedback for an item
     */
    private getGuestFeedback;
    /**
     * Get all menu items (placeholder - in real app this would come from database)
     */
    private getAllMenuItems;
}
//# sourceMappingURL=personalizedMenuService.d.ts.map