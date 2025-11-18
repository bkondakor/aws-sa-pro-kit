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
                    <li><a href="cheatsheet.html" style="background: linear-gradient(135deg, #FFB84D 0%, #FF8C42 100%); padding: 8px 12px; border-radius: 6px; color: #0f0f1e; font-weight: 700; display: block; text-align: center; margin-bottom: 8px;">📋 Cheatsheet</a></li>
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

def create_comparisons_index_page():
    """Create the comparisons landing page."""

    html = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AWS Service Comparisons - AWS SA Pro Kit</title>
    <link rel="stylesheet" href="../../styles/study.css">
</head>
<body>
    <button id="darkModeToggle" class="dark-mode-toggle" aria-label="Toggle dark mode">
        <span class="icon">🌙</span>
    </button>

    <nav class="top-nav">
        <div class="nav-container">
            <a href="../../index.html" class="nav-brand">AWS SA Pro Kit</a>
            <div class="nav-links">
                <a href="../../index.html">Home</a>
                <a href="../index.html" class="active">Study Materials</a>
                <a href="../../exam/index.html">Practice Exam</a>
                <a href="https://github.com/bkondakor/aws-sa-pro-kit" target="_blank">GitHub</a>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="breadcrumb">
            <a href="../index.html">Study Materials</a> › Service Comparisons
        </div>

        <main class="content">
            <article>
                <h1>🔀 AWS Service Comparisons</h1>

                <p class="intro-text">
                    Understanding when to use each AWS service is critical for the Solutions Architect Professional exam.
                    These comparison guides help you make the right architectural decisions by highlighting key differences,
                    use cases, and decision criteria.
                </p>

                <div class="comparison-cards">
                    <div class="comparison-card">
                        <div class="card-header">
                            <span class="card-icon">📊</span>
                            <h2>Big Data Services</h2>
                        </div>
                        <div class="card-content">
                            <p>Compare EMR, Athena, Glue, Kinesis, Redshift, and more. Learn when to use each service for data processing, analytics, and streaming workloads.</p>
                            <ul class="feature-list">
                                <li>Amazon EMR vs Glue vs Athena</li>
                                <li>Kinesis Data Streams vs Firehose</li>
                                <li>Redshift vs Athena vs EMR</li>
                                <li>MSK vs Kinesis</li>
                                <li>Real-world use case examples</li>
                            </ul>
                            <a href="big-data-services-comparison.html" class="btn-card">View Guide →</a>
                        </div>
                    </div>

                    <div class="comparison-card">
                        <div class="card-header">
                            <span class="card-icon">🚀</span>
                            <h2>Migration Services</h2>
                        </div>
                        <div class="card-content">
                            <p>Comprehensive comparison of AWS migration services including MGN, DMS, DataSync, Snow Family, and Storage Gateway.</p>
                            <ul class="feature-list">
                                <li>Application Migration Service (MGN)</li>
                                <li>Database Migration Service (DMS)</li>
                                <li>DataSync vs Transfer Family</li>
                                <li>Snow Family devices</li>
                                <li>Migration decision trees</li>
                            </ul>
                            <a href="migration-services-comparison.html" class="btn-card">View Guide →</a>
                        </div>
                    </div>
                </div>

                <div class="tips-section">
                    <h3>💡 How to Use These Guides</h3>
                    <ul>
                        <li><strong>Decision Trees:</strong> Follow the flowcharts to quickly identify the right service for your scenario</li>
                        <li><strong>Comparison Tables:</strong> Side-by-side feature comparisons help you understand key differences</li>
                        <li><strong>Real Scenarios:</strong> Practice with exam-style scenarios and explanations</li>
                        <li><strong>Quick Reference:</strong> Use the summary tables during your final review before the exam</li>
                    </ul>
                </div>
            </article>
        </main>

        <aside class="sidebar">
            <div class="sidebar-section">
                <h3>Navigation</h3>
                <ul>
                    <li><a href="../index.html">Study Home</a></li>
                    <li><a href="../domain-1.html">Domain 1 (26%)</a></li>
                    <li><a href="../domain-2.html">Domain 2 (29%)</a></li>
                    <li><a href="../domain-3.html">Domain 3 (25%)</a></li>
                    <li><a href="../domain-4.html">Domain 4 (20%)</a></li>
                </ul>
            </div>
            <div class="sidebar-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="../cheatsheet.html" style="background: linear-gradient(135deg, #FFB84D 0%, #FF8C42 100%); padding: 8px 12px; border-radius: 6px; color: #0f0f1e; font-weight: 700; display: block; text-align: center; margin-bottom: 8px;">📋 Cheatsheet</a></li>
                    <li><a href="../../exam/index.html">Practice Exam</a></li>
                    <li><a href="https://aws.amazon.com/certification/certified-solutions-architect-professional/" target="_blank">Official Exam</a></li>
                </ul>
            </div>
        </aside>
    </div>

    <footer class="footer">
        <p>AWS Solutions Architect Professional Exam Preparation Kit</p>
        <p>Last updated: 2025</p>
    </footer>

    <script>
        // Dark Mode Functionality
        const darkModeToggle = document.getElementById('darkModeToggle');
        const icon = darkModeToggle.querySelector('.icon');

        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            icon.textContent = '☀️';
        }

        // Toggle dark mode
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');

            // Update icon and save preference
            if (document.body.classList.contains('dark-mode')) {
                icon.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            } else {
                icon.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            }
        });
    </script>

    <style>
        .intro-text {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
            color: var(--text-secondary);
        }

        .comparison-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }

        .comparison-card {
            background: var(--card-bg);
            border-radius: 12px;
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid var(--border-color);
        }

        .comparison-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .card-header {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            padding: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .card-icon {
            font-size: 2.5rem;
        }

        .card-header h2 {
            margin: 0;
            color: white;
            font-size: 1.5rem;
        }

        .card-content {
            padding: 1.5rem;
        }

        .card-content p {
            margin-bottom: 1rem;
            line-height: 1.6;
        }

        .feature-list {
            list-style: none;
            padding: 0;
            margin: 1.5rem 0;
        }

        .feature-list li {
            padding: 0.5rem 0;
            padding-left: 1.5rem;
            position: relative;
        }

        .feature-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: var(--success-color);
            font-weight: bold;
        }

        .btn-card {
            display: inline-block;
            background: linear-gradient(135deg, #FFB84D 0%, #FF8C42 100%);
            color: #0f0f1e;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            margin-top: 1rem;
        }

        .btn-card:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 12px rgba(255, 184, 77, 0.3);
        }

        .tips-section {
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 12px;
            margin-top: 2rem;
            border-left: 4px solid var(--primary-color);
        }

        .tips-section h3 {
            margin-top: 0;
            margin-bottom: 1rem;
        }

        .tips-section ul {
            margin-left: 1.5rem;
        }

        .tips-section li {
            margin-bottom: 0.75rem;
            line-height: 1.6;
        }

        @media (max-width: 768px) {
            .comparison-cards {
                grid-template-columns: 1fr;
            }
        }
    </style>
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

    # Create comparisons index page
    comparisons_dir = study_dir / 'comparisons'
    comparisons_dir.mkdir(exist_ok=True)

    comparisons_html = create_comparisons_index_page()
    comparisons_index = comparisons_dir / 'index.html'

    with open(comparisons_index, 'w', encoding='utf-8') as f:
        f.write(comparisons_html)

    print(f"\n✅ Comparisons index page created: {comparisons_index}")

if __name__ == '__main__':
    main()
