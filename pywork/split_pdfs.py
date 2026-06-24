import subprocess, sys, os, glob

pdfdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
outdir = os.path.join(pdfdir, 'pdfpages')

volumes = {
    1: {'pdf': os.path.join(pdfdir, 'rvps1.pdf'), 'pages': range(22, 150)},
    2: {'pdf': os.path.join(pdfdir, 'rvps2.pdf'), 'pages': range(8, 237)},
}

os.makedirs(outdir, exist_ok=True)

total = 0
for vol, info in volumes.items():
    pdf_path = info['pdf']
    if not os.path.exists(pdf_path):
        print(f'ERROR: {pdf_path} not found', file=sys.stderr)
        sys.exit(1)
    for p in info['pages']:
        outfile = os.path.join(outdir, f'rvps{vol}_{p:03d}.pdf')
        if os.path.exists(outfile):
            continue
        cmd = ['qpdf', '--pages', pdf_path, str(p), '--', pdf_path, outfile]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f'Error extracting vol {vol} page {p}: {result.stderr}', file=sys.stderr)
            sys.exit(1)
        if result.stderr and 'error' in result.stderr.lower():
            print(f'Error extracting vol {vol} page {p}: {result.stderr}', file=sys.stderr)
            sys.exit(1)
        total += 1
        if total % 50 == 0:
            print(f'  {total} files created...')

print(f'Done. {total} new PDF files created in {outdir}')

files = sorted(os.listdir(outdir))
print(f'Total files in pdfpages/: {len(files)}')
