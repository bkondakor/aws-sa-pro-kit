#!/usr/bin/env python3
"""
Build custom navigation pages for the study materials.
"""

import json
from pathlib import Path

def create_domain_overview_page(domain_num, domain_info):
    """Create an overview page for each domain."""

    domain_configs = {
        1: {
            'name': 'Design Solutions for Organizational Complexity',
            'weight': '26%',
            'questions': '~20 out of 75',
            'description': 'Multi-account environments, hybrid networking, enterprise security, and cost optimization at scale.',
            'icon': '🏢'
        },
        2: {
            'name': 'Design for New Solutions',
            'weight': '29%',
            'questions': '~22 out of 75',
            'description': 'Deployment strategies, business continuity, security controls, and reliability for new applications.',
            'icon': '🚀'
        },
        3: {
            'name': 'Continuous Improvement for Existing Solutions',
            'weight': '25%',
            'questions': '~19 out of 75',
            'description': 'Operational excellence, security improvements, performance optimization, and cost reduction.',
            'icon': '📈'
        },
        4: {
            'name': 'Accelerate Workload Migration and Modernization',
            'weight': '20%',
            'questions': '~15 out of 75',
            'description': 'Migration strategies, architecture redesign, modernization opportunities, and cloud-native adoption.',
            'icon': '☁️'
        }
    }

    config = domain_configs[domain_num]

    # Get list of study materials
    study_dir = Path(__file__).parent / 'study' / f'domain-{domain_num}'
    files = sorted(study_dir.glob('*.html'))

    tasks = []
    supplementary = []

    for f in files:
        filename = f.name
        title = f.stem.replace('-', ' ').replace('_', ' ').title()

        if f.stem == 'README':
            title = 'Domain Overview'

        if filename.startswith('task-'):
            tasks.append({'file': filename, 'title': title})
        else:
            supplementary.append({'file': filename, 'title': title})

    # Build materials HTML
    tasks_html = '\n'.join([
        f'<div class="material-item"><a href="domain-{domain_num}/{item["file"]}">{item["title"]}</a></div>'
        for item in tasks
    ])

    supplementary_html = '\n'.join([
        f'<div class="material-item"><a href="domain-{domain_num}/{item["file"]}">{item["title"]}</a></div>'
        for item in supplementary
    ]) if supplementary else '<div class="material-item">No supplementary materials</div>'

    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Domain {domain_num}: {config['name']} - AWS SA Pro Kit</title>
    <link rel="stylesheet" href="../styles/study.css">
</head>
<body>
    <nav class="top-nav">
        <div class="nav-container">
            <a href="../index.html" class="nav-brand">AWS SA Pro Kit</a>
            <div class="nav-links">
                <a href="../index.html">Home</a>
                <a href="index.html" class="active">Study Materials</a>
                <a href="../exam/index.html">Practice Exam</a>
                <a href="https://github.com/bkondakor/aws-sa-pro-kit" target="_blank">GitHub</a>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="breadcrumb">
            <a href="index.html">Study Materials</a> › Domain {domain_num}
        </div>

        <main class="content">
            <article>
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="font-size: 5rem; margin-bottom: 1rem;">{config['icon']}</div>
                    <h1>Domain {domain_num}: {config['name']}</h1>
                    <div class="page-metadata">
                        <span class="meta-item"><strong>Weight:</strong> {config['weight']}</span>
                        <span class="meta-item"><strong>Expected Questions:</strong> {config['questions']}</span>
                    </div>
                </div>

                <div style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: 12px; margin: 2rem 0;">
                    <p style="font-size: 1.1rem; margin: 0;">{config['description']}</p>
                </div>

                <h2>Core Tasks</h2>
                <div class="card-grid" style="margin-bottom: 3rem;">
                    {tasks_html}
                </div>

                <h2>Supplementary Materials</h2>
                <div class="card-grid">
                    {supplementary_html}
                </div>

                <div style="margin-top: 3rem; padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; text-align: center;">
                    <h3 style="color: white; margin-bottom: 1rem;">Ready to test your knowledge?</h3>
                    <p style="margin-bottom: 1.5rem;">Try the practice exam to see how well you understand this domain.</p>
                    <a href="../exam/index.html" style="display: inline-block; background: white; color: #667eea; padding: 12px 32px; border-radius: 8px; font-weight: 600; text-decoration: none;">Take Practice Exam</a>
                </div>
            </article>
        </main>

        <aside class="sidebar">
            <div class="sidebar-section">
                <h3>All Domains</h3>
                <ul>
                    <li><a href="domain-1.html" {'class="active"' if domain_num == 1 else ''}>Domain 1 (26%)</a></li>
                    <li><a href="domain-2.html" {'class="active"' if domain_num == 2 else ''}>Domain 2 (29%)</a></li>
                    <li><a href="domain-3.html" {'class="active"' if domain_num == 3 else ''}>Domain 3 (25%)</a></li>
                    <li><a href="domain-4.html" {'class="active"' if domain_num == 4 else ''}>Domain 4 (20%)</a></li>
                </ul>
            </div>
            <div class="sidebar-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="study-plan.html">Study Plan</a></li>
                    <li><a href="../exam/index.html">Practice Exam</a></li>
                </ul>
            </div>
        </aside>
    </div>

    <footer class="footer">
        <p>AWS Solutions Architect Professional Exam Preparation Kit</p>
        <p>Last updated: 2025</p>
    </footer>
</body>
</html>'''

    return html

def main():
    """Generate domain overview pages."""
    project_root = Path(__file__).parent
    study_dir = project_root / 'study'

    for domain_num in range(1, 5):
        html = create_domain_overview_page(domain_num, {})
        output_file = study_dir / f'domain-{domain_num}.html'

        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html)

        print(f"Created: {output_file}")

    print("\n✅ Domain overview pages created!")

if __name__ == '__main__':
    main()
