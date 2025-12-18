import React, { useState } from 'react';
import { Plus, X, ArrowDown, Play } from 'lucide-react';
import type { Workflow, WorkflowStep } from '../types';
import { useWorkflowStore } from '../stores/workflowStore';
import AIEditor from './AIEditor';
import { executeWorkflow } from '../services/workflowExecutor';
import { toast } from 'sonner';

interface WorkflowEditorProps {
  workflow: Workflow;
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ workflow }) => {
  const { updateWorkflow } = useWorkflowStore();
  const [steps, setSteps] = useState(workflow.steps);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});

  const handleAddStep = () => {
    const newStep: WorkflowStep = {
      id: crypto.randomUUID(),
      name: `Step ${steps.length + 1}`,
      content: '',
      inputs: {},
      outputVariable: `result${steps.length + 1}`
    };
    const newSteps = [...steps, newStep];
    setSteps(newSteps);
    updateWorkflow(workflow.id, { steps: newSteps });
  };

  const handleUpdateStep = (id: string, updates: Partial<WorkflowStep>) => {
    const newSteps = steps.map(s => s.id === id ? { ...s, ...updates } : s);
    setSteps(newSteps);
    updateWorkflow(workflow.id, { steps: newSteps });
  };

  const handleDeleteStep = (id: string) => {
    const newSteps = steps.filter(s => s.id !== id);
    setSteps(newSteps);
    updateWorkflow(workflow.id, { steps: newSteps });
  };

  const handleRun = async () => {
    setIsRunning(true);
    setResults({});
    toast.loading('Running workflow...', { id: 'run-workflow' });

    try {
      const run = await executeWorkflow(workflow, {}, (stepId, result) => {
        setResults(prev => ({ ...prev, [stepId]: result }));
      });

      if (run.status === 'completed') {
        toast.success('Workflow completed!', { id: 'run-workflow' });
      } else {
        toast.error(`Failed: ${run.error}`, { id: 'run-workflow' });
      }
    } catch (e) {
      toast.error('Execution Error', { id: 'run-workflow' });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="workflow-editor">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button className="btn btn-primary" onClick={handleRun} disabled={isRunning}>
          <Play size={16} className={isRunning ? 'spinning' : ''} />
          {isRunning ? 'Running...' : 'Run Workflow'}
        </button>
      </div>

      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={step.id} style={{ marginBottom: '20px' }}>
            <div className="step-card" style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <input
                  value={step.name}
                  onChange={e => handleUpdateStep(step.id, { name: e.target.value })}
                  className="form-input"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    padding: '0',
                    fontSize: '16px',
                    width: 'auto'
                  }}
                />
                <button onClick={() => handleDeleteStep(step.id)} className="action-btn" style={{ color: 'var(--danger)' }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="form-label">Prompt Template</label>
                <AIEditor
                  value={step.content}
                  onChange={val => handleUpdateStep(step.id, { content: val })}
                  minHeight="100px"
                  placeholder="Use {{variable}} to reference inputs"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Output Variable</label>
                  <input
                    className="form-input"
                    value={step.outputVariable || ''}
                    onChange={e => handleUpdateStep(step.id, { outputVariable: e.target.value })}
                    placeholder="Variable Name"
                  />
                </div>
              </div>

              {results[step.id] && (
                <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Result:</div>
                  <div style={{ whiteSpace: 'pre-wrap', fontSize: '13px' }}>{results[step.id]}</div>
                </div>
              )}
            </div>

            {index < steps.length - 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                <ArrowDown size={20} color="var(--text-muted)" />
              </div>
            )}
          </div>
        ))}

        <button className="btn btn-secondary" style={{ width: '100%', borderStyle: 'dashed' }} onClick={handleAddStep}>
          <Plus size={16} /> Add Step
        </button>
      </div>
    </div>
  );
};

export default WorkflowEditor;
