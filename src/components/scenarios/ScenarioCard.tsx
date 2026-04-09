'use client';

import type { Scenario } from '@/lib/scenarios';

interface ScenarioCardProps {
  scenario: Scenario;
  onSelect: (scenario: Scenario) => void;
}

const difficultyColor: Record<Scenario['difficulty'], string> = {
  beginner: 'badge-success',
  intermediate: 'badge-warning',
  advanced: 'badge-accent',
};

export default function ScenarioCard({ scenario, onSelect }: ScenarioCardProps) {
  return (
    <button
      id={`scenario-${scenario.id}`}
      className="scenario-card"
      onClick={() => onSelect(scenario)}
      aria-label={`Practice ${scenario.name}`}
    >
      <div className="scenario-icon" aria-hidden="true">{scenario.icon}</div>
      <div className="scenario-body">
        <div className="scenario-header">
          <h3 className="scenario-title">{scenario.name}</h3>
          <span className={`badge ${difficultyColor[scenario.difficulty]}`}>
            {scenario.difficulty}
          </span>
        </div>
        <p className="scenario-desc">{scenario.description}</p>
        <span className="scenario-count">
          {scenario.prompts.length} prompts
        </span>
      </div>
      <span className="scenario-arrow" aria-hidden="true">→</span>

      <style>{`
        .scenario-card {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          padding: 18px 20px;
          background: #fff;
          border: 1px solid rgba(46,31,39,0.06);
          border-radius: 14px;
          cursor: pointer;
          text-align: left;
          transition: all 160ms ease;
          color: inherit;
        }
        .scenario-card:hover {
          border-color: #dd7230;
          transform: translateX(3px);
          box-shadow: 0 4px 20px rgba(221,114,48,0.1);
        }
        .scenario-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(221,114,48,0.08);
          border-radius: 12px;
        }
        .scenario-body {
          flex: 1;
          min-width: 0;
        }
        .scenario-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 3px;
          flex-wrap: wrap;
        }
        .scenario-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #2e1f27;
        }
        .scenario-desc {
          font-size: 0.8125rem;
          color: rgba(46,31,39,0.5);
          margin-bottom: 4px;
          max-width: none;
        }
        .scenario-count {
          font-size: 0.75rem;
          color: rgba(46,31,39,0.35);
        }
        .scenario-arrow {
          font-size: 1.125rem;
          color: rgba(46,31,39,0.25);
          flex-shrink: 0;
          transition: transform 160ms, color 160ms;
        }
        .scenario-card:hover .scenario-arrow {
          transform: translateX(3px);
          color: #dd7230;
        }
        /* Badge override */
        .badge {
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: 99px;
        }
        .badge-success {
          background: rgba(16,185,129,0.1);
          color: #065f46;
        }
        .badge-warning {
          background: rgba(221,114,48,0.12);
          color: #854d27;
        }
        .badge-accent {
          background: rgba(46,31,39,0.07);
          color: rgba(46,31,39,0.6);
        }
      `}</style>
    </button>
  );
}
