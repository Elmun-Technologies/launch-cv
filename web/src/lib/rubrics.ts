export function rubricForVertical(vertical: string): string {
  const v = vertical;
  const map: Record<string, string> = {
    software: `Software rubric: system design, code quality, scale, security, CI/CD, monitoring, teamwork, technical decisions, metrics (latency, throughput, error rate).`,
    data: `Data rubric: SQL, experiment design, metric definition, data modeling, visualization, stakeholder collaboration, causal vs correlational.`,
    sales: `Sales rubric: pipeline, quota, cycle, win-rate, discovery, objection handling, territory, cross-sell/upsell, CRM discipline.`,
    marketing: `Marketing rubric: funnel, CAC/LTV, campaigns, content strategy, brand, analytics, experimentation, channel fit.`,
    product: `Product rubric: prioritization, discovery, roadmap, stakeholder management, outcome vs output, metrics, UX collaboration, risk management.`,
    design: `Design rubric: user research, IA, visual system, prototyping, accessibility, collaboration, portfolio impact.`,
    finance: `Finance rubric: reporting, forecast, internal controls, audit readiness, Excel/modeling, compliance tone.`,
    operations: `Operations rubric: KPI, process improvement, vendor management, inventory, cost, incident response.`,
    healthcare_ops: `Healthcare ops: HIPAA-aware copy (avoid PHI), ops metrics, regulation, multi-stakeholder.`,
    education: `Education: learner outcomes, curriculum ops, assessment, compliance, community.`,
    legal: `Legal/paralegal: conservative tone, confidentiality, research accuracy, formatting discipline (fabricated metrics prohibited).`,
    engineering_non_swe: `Non-SWE engineering: project management, CAD/sim (if applicable), safety, standards, cross-functional.`,
  };
  return map[v] ?? map.software;
}
