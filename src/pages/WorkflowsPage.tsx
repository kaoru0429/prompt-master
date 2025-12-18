import React from 'react';
import { Plus, Play, MoreVertical, Workflow, ArrowLeft } from 'lucide-react';
import { useWorkflowStore } from '../stores/workflowStore';
import { useNavigate, useParams } from 'react-router-dom';
import WorkflowEditor from '../components/WorkflowEditor';

const WorkflowsPage: React.FC = () => {
  const { workflows, addWorkflow, deleteWorkflow } = useWorkflowStore();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleCreate = () => {
    const name = window.prompt('輸入工作流名稱:');
    if (name) {
      addWorkflow({
        name,
        description: '尚未加入描述',
        steps: [],
        variables: []
      });
      // Navigate to the new workflow? We need the ID. 
      // Current store addWorkflow doesn't return ID easily unless we refactor.
      // For now just stay on list.
    }
  };

  if (id) {
    const workflow = workflows.find(w => w.id === id);
    if (!workflow) return <div>Workflow not found</div>;

    return (
      <div>
        <div className="header" style={{ marginBottom: '20px' }}>
          <button className="action-btn" onClick={() => navigate('/workflows')} style={{ marginRight: '12px' }}>
            <ArrowLeft size={18} />
          </button>
          <h1>{workflow.name}</h1>
        </div>
        <WorkflowEditor workflow={workflow} />
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <h1>Prompt Workflows</h1>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Plus size={16} /> 新增工作流
        </button>
      </div>

      <div className="prompt-grid">
        {workflows.map(w => (
          <div key={w.id} className="prompt-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/workflows/${w.id}`)}>
            <div className="prompt-card-header">
              <div className="prompt-card-title">
                <Workflow size={18} className="text-accent" />
                {w.name}
              </div>
              <div className="prompt-card-description">{w.description}</div>
            </div>
            <div className="prompt-card-meta">
              <span>{w.steps.length} 個步驟</span>
              <span style={{ marginLeft: 'auto', fontSize: '11px' }}>
                更新於 {new Date(w.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="prompt-card-actions">
              <button
                className="action-btn"
                onClick={(e) => { e.stopPropagation(); /* TODO: Run */ }}
              >
                <Play size={14} /> 執行
              </button>
              <button
                className="action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('刪除此工作流?')) deleteWorkflow(w.id);
                }}
                style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}
              >
                <MoreVertical size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {workflows.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '8px'
          }}>
            <Workflow size={32} style={{ opacity: 0.5 }} />
          </div>
          <h3>尚未建立工作流</h3>
          <p>透過串聯多個 Prompts 來自動化您的工作任務</p>
          <button className="btn btn-primary" onClick={handleCreate} style={{ marginTop: '8px' }}>
            建立第一個工作流
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkflowsPage;
