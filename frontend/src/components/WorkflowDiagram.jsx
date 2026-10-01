import React from 'react';

// Import the SVG workflow diagram (placed in the assets folder)
import workflowSvg from '../../assets/workflow_it_ops_4783c9ca96.svg';

export default function WorkflowDiagram() {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Alur Kerja IT Ops (N8N‑style)</h2>
      <img src={workflowSvg} alt="Workflow Diagram" className="max-w-full h-auto" />
    </div>
  );
}
