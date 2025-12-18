import type { Workflow, WorkflowRun } from '../types';
import { generateId } from '../utils/common';
import { generateResponse } from './gemini';

export async function executeWorkflow(
  workflow: Workflow,
  inputs: Record<string, string>,
  onStepComplete?: (stepId: string, result: string) => void
): Promise<WorkflowRun> {
  const runId = generateId();
  const results: Record<string, string> = { ...inputs };
  const stepResults: Record<string, string> = {};

  const run: WorkflowRun = {
    id: runId,
    workflowId: workflow.id,
    status: 'running',
    results,
    stepResults,
    createdAt: new Date().toISOString()
  };

  try {
    for (const step of workflow.steps) {
      // 1. Prepare Content (Replace variables with current values)
      let content = step.content;

      // Simple variable replacement
      // Sort keys by length (descending) to prevent partial replacements
      const sortedKeys = Object.keys(results).sort((a, b) => b.length - a.length);

      for (const key of sortedKeys) {
        const value = results[key] || '';
        // Replace {{variable}} and [variable]
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
        content = content.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
      }

      // 2. Execute
      // TODO: Handle different step types (Delay, Conditional, etc.)
      const result = await generateResponse(content);

      // 3. Store result
      stepResults[step.id] = result;
      if (step.outputVariable) {
        results[step.outputVariable] = result;
      }

      if (onStepComplete) {
        onStepComplete(step.id, result);
      }
    }

    run.status = 'completed';
    run.completedAt = new Date().toISOString();
  } catch (error) {
    run.status = 'failed';
    run.error = String(error);
    run.completedAt = new Date().toISOString();
  }

  return run;
}
