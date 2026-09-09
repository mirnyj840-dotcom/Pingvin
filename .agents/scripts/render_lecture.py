import fitz
from pathlib import Path
pdf = Path('attached_assets/Lektsia_1_Zadanie_6_Chisla_i_vychislenia_1788961433472.pdf')
out = Path('.agents/outputs/lecture-pages')
out.mkdir(parents=True, exist_ok=True)
doc = fitz.open(pdf)
print('pages', doc.page_count)
for i, page in enumerate(doc):
    pix = page.get_pixmap(matrix=fitz.Matrix(1.2, 1.2), alpha=False)
    path = out / f'page-{i+1}.png'
    pix.save(path)
    print(path)
