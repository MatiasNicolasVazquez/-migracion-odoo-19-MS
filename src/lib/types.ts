export type ModuleStatusValue =
  | "pending"
  | "in_progress"
  | "blocked"
  | "passed"
  | "failed";

export type TestResult = "pending" | "pass" | "fail" | "skip";

export type Priority = "P0" | "P1" | "P2" | "P3";

export type Category =
  | "ecommerce"
  | "payments"
  | "product"
  | "stock"
  | "account"
  | "analytics"
  | "theme"
  | "warranty";

export interface TestStep {
  id: string;
  title: string;
  detail?: string;
}

export interface ModuleDef {
  id: string;
  technicalName: string;
  displayName: string;
  version: string;
  depends: string[];
  category: Category;
  priority: Priority;
  importance: number;
  summary: string;
  testPlan: TestStep[];
}

export interface ModuleStatusRow {
  module_id: string;
  status: ModuleStatusValue;
  assignee: string | null;
  notes: string | null;
  updated_at: string;
  updated_by: string | null;
}

export interface TestProgressRow {
  module_id: string;
  step_id: string;
  done: boolean;
  result: TestResult;
  note: string | null;
  updated_at: string;
}
