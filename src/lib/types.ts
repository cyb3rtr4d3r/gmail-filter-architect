export interface FilterRule {
  id: string; // Internal unique ID for the tool
  from?: string;
  to?: string;
  subject?: string;
  hasTheWord?: string;
  doesNotHaveTheWord?: string;
  hasAttachment?: string; // 'true' | 'false'
  excludeChats?: string; // 'true' | 'false'
  sizeOperator?: string;
  sizeUnit?: string;
  size?: string;
  label?: string;
  shouldArchive?: string; // 'true' | 'false'
  shouldMarkAsRead?: string; // 'true' | 'false'
  shouldStar?: string; // 'true' | 'false'
  shouldTrash?: string; // 'true' | 'false'
  shouldNeverSpam?: string; // 'true' | 'false'
  shouldAlwaysMarkAsImportant?: string; // 'true' | 'false'
  shouldNeverMarkAsImportant?: string; // 'true' | 'false'
  forwardTo?: string;
  smartLabelToApply?: string;
  
  // Custom tool properties
  status?: 'active' | 'draft';
  domains?: string[];
  auditWarning?: 'duplicate' | 'conflict';
  complexityScore?: number;
}
