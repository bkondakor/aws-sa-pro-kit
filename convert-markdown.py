#!/usr/bin/env python3
"""
Convert Obsidian-formatted Markdown files to HTML for GitHub Pages.
Handles YAML frontmatter, wiki-style links, and standard markdown.
"""

import os
import re
import yaml
import markdown
from pathlib import Path
from markdown.extensions import tables, fenced_code, toc
import html

def parse_frontmatter(content):
    """Extract YAML frontmatter from markdown content."""
    frontmatter = {}
    body = content

    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            try:
                frontmatter = yaml.safe_load(parts[1])
                body = parts[2].strip()
            except yaml.YAMLError:
                pass

    return frontmatter, body

def convert_wiki_links(content):
    """Convert Obsidian wiki-style links to HTML links."""
    # Pattern: [[path/to/file|Display Text]] or [[path/to/file]]
    def replace_link(match):
        full_match = match.group(0)
        link_content = match.group(1)

        if '|' in link_content:
            path, display = link_content.split('|', 1)
        else:
            path = link_content
            # Use the last part of the path as display text
            display = path.split('/')[-1].replace('-', ' ').title()

        # Convert file path to HTML path
        html_path = path.strip()
        if not html_path.endswith('.html'):
            html_path = html_path.replace('.md', '.html')
            if '/' not in html_path:
                html_path += '.html'

        return f'<a href="{html_path}">{display.strip()}</a>'

    # Replace wiki-style links
    content = re.sub(r'\[\[([^\]]+)\]\]', replace_link, content)

    return content

def create_html_page(title, content, frontmatter=None, base_path='..'):
    """Create a complete HTML page with navigation and styling."""

    # Extract metadata for page header
    domain = frontmatter.get('domain', '') if frontmatter else ''
    domain_name = frontmatter.get('domain_name', '') if frontmatter else ''
    task = frontmatter.get('task', '') if frontmatter else ''
    weight = frontmatter.get('weight', '') if frontmatter else ''

    breadcrumb = ''
    if domain:
        breadcrumb = f'''
        <div class="breadcrumb">
            <a href="{base_path}/study/index.html">Study Materials</a> ›
            <a href="{base_path}/study/domain-{domain}.html">Domain {domain}</a>
            {f' › Task {task}' if task else ''}
        </div>
        '''

    metadata_html = ''
    if frontmatter:
        meta_items = []
        if domain_name:
            meta_items.append(f'<span class="meta-item"><strong>Domain:</strong> {domain_name}</span>')
        if weight:
            meta_items.append(f'<span class="meta-item"><strong>Weight:</strong> {weight}</span>')
        if task:
            meta_items.append(f'<span class="meta-item"><strong>Task:</strong> {task}</span>')

        if meta_items:
            metadata_html = f'''
            <div class="page-metadata">
                {' '.join(meta_items)}
            </div>
            '''

    html_template = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{html.escape(title)} - AWS SA Pro Kit</title>
    <link rel="stylesheet" href="{base_path}/styles/study.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
</head>
<body>
    <nav class="top-nav">
        <div class="nav-container">
            <a href="{base_path}/index.html" class="nav-brand">AWS SA Pro Kit</a>
            <div class="nav-links">
                <a href="{base_path}/index.html">Home</a>
                <a href="{base_path}/study/index.html" class="active">Study Materials</a>
                <a href="{base_path}/exam/index.html">Practice Exam</a>
                <a href="https://github.com/bkondakor/aws-sa-pro-kit" target="_blank">GitHub</a>
            </div>
        </div>
    </nav>

    <div class="container">
        {breadcrumb}
        <main class="content">
            <article>
                {metadata_html}
                {content}
            </article>
        </main>

        <aside class="sidebar">
            <div class="sidebar-section">
                <h3>Navigation</h3>
                <ul>
                    <li><a href="{base_path}/study/index.html">Study Home</a></li>
                    <li><a href="{base_path}/study/domain-1.html">Domain 1 (26%)</a></li>
                    <li><a href="{base_path}/study/domain-2.html">Domain 2 (29%)</a></li>
                    <li><a href="{base_path}/study/domain-3.html">Domain 3 (25%)</a></li>
                    <li><a href="{base_path}/study/domain-4.html">Domain 4 (20%)</a></li>
                </ul>
            </div>
            <div class="sidebar-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="{base_path}/exam/index.html">Practice Exam</a></li>
                    <li><a href="https://aws.amazon.com/certification/certified-solutions-architect-professional/" target="_blank">Official Exam</a></li>
                </ul>
            </div>
        </aside>
    </div>

    <footer class="footer">
        <p>AWS Solutions Architect Professional Exam Preparation Kit</p>
        <p>Last updated: {frontmatter.get('last_updated', '2025') if frontmatter else '2025'}</p>
    </footer>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script>hljs.highlightAll();</script>
</body>
</html>'''

    return html_template

def convert_markdown_to_html(md_content, title='Study Material'):
    """Convert markdown content to HTML."""
    # Parse frontmatter
    frontmatter, body = parse_frontmatter(md_content)

    # Convert wiki-style links
    body = convert_wiki_links(body)

    # Convert markdown to HTML
    md = markdown.Markdown(extensions=[
        'tables',
        'fenced_code',
        'toc',
        'nl2br',
        'sane_lists'
    ])
    html_content = md.convert(body)

    # Extract title from frontmatter or content
    if frontmatter and 'title' in frontmatter:
        title = frontmatter['title']

    return html_content, frontmatter, title

def process_markdown_file(input_path, output_path, base_path='..'):
    """Process a single markdown file and convert to HTML."""
    print(f"Processing: {input_path}")

    with open(input_path, 'r', encoding='utf-8') as f:
        md_content = f.read()

    html_content, frontmatter, title = convert_markdown_to_html(md_content)
    full_html = create_html_page(title, html_content, frontmatter, base_path)

    # Ensure output directory exists
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_html)

    print(f"Created: {output_path}")
    return title, frontmatter

def main():
    """Main conversion process."""
    project_root = Path(__file__).parent
    study_output = project_root / 'study'

    # Create output directory
    study_output.mkdir(exist_ok=True)

    # Track all files for navigation
    domain_files = {
        1: [],
        2: [],
        3: [],
        4: []
    }

    # Convert INDEX.md to the main study page
    index_md = project_root / 'INDEX.md'
    if index_md.exists():
        process_markdown_file(
            index_md,
            study_output / 'index.html',
            base_path='..'
        )

    # Convert MASTER_STUDY_PLAN.md
    plan_md = project_root / 'MASTER_STUDY_PLAN.md'
    if plan_md.exists():
        process_markdown_file(
            plan_md,
            study_output / 'study-plan.html',
            base_path='..'
        )

    # Process each domain
    domain_names = {
        1: 'organizational-complexity',
        2: 'new-solutions',
        3: 'continuous-improvement',
        4: 'migration-modernization'
    }

    for domain_num in range(1, 5):
        domain_dir = project_root / f'domain-{domain_num}-{domain_names[domain_num]}'

        if not domain_dir.exists():
            continue

        domain_output = study_output / f'domain-{domain_num}'
        domain_output.mkdir(exist_ok=True)

        # Process all markdown files in domain
        for md_file in sorted(domain_dir.glob('*.md')):
            output_file = domain_output / md_file.with_suffix('.html').name
            title, frontmatter = process_markdown_file(
                md_file,
                output_file,
                base_path='../..'
            )

            domain_files[domain_num].append({
                'path': f'domain-{domain_num}/{output_file.name}',
                'title': title,
                'frontmatter': frontmatter,
                'filename': md_file.stem
            })

    print("\n✅ Conversion complete!")
    print(f"Output directory: {study_output}")

    return domain_files

if __name__ == '__main__':
    main()
