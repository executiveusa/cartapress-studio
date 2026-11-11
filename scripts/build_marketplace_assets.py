from pathlib import Path
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import cairosvg
ROOT=Path(__file__).resolve().parents[1]
SAMPLES=ROOT/'marketplace/samples';OUT=ROOT/'marketplace/gig-assets';OUT.mkdir(parents=True,exist_ok=True)
cream='#f7f1e6';forest='#1e392b';rust='#c76d53';muted='#b6c3b2';gold='#bd9266'
FONTS=['/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf']
fonts=[ImageFont.truetype(f,1) for f in FONTS]
def font(size,idx=0):return ImageFont.truetype(FONTS[idx],size)
def letterspace(draw, xy, text, fill, ft, spacing=2):
 x,y=xy
 for char in text:
  draw.text((x,y),char,font=ft,fill=fill)
  x+=draw.textlength(char,font=ft)+spacing

def open_image(name):return Image.open(SAMPLES/name).convert('RGB')
def fake_paper(canvas, fname, xy, size, deg):
 p=open_image(fname);p.thumbnail(size,Image.Resampling.LANCZOS)
 alpha=Image.new('RGBA',(p.width+20,p.height+20),(0,0,0,0));alpha.paste(p,(10,10));
 d=ImageDraw.Draw(alpha);d.rectangle((9,9,p.width+10,p.height+10),outline='#d5c9b8',width=2)
 skew=alpha.rotate(deg,Image.Resampling.BICUBIC,expand=True)
 shadow=Image.new('RGBA',skew.size,(0,0,0,0));shadow.putalpha(skew.getchannel('A'))
 tint=Image.new('RGBA',skew.size,(0,0,0,190));tint.putalpha(shadow.getchannel('A'));tint=tint.filter(ImageFilter.GaussianBlur(16))
 canvas.alpha_composite(tint,(xy[0]+13,xy[1]+20));canvas.alpha_composite(skew,xy)

def base(w=1280,h=769,bg=forest):
 im=Image.new('RGBA',(w,h),bg);d=ImageDraw.Draw(im)
 grid='#365142' if bg==forest else '#e2d8c9'
 for x in range(0,w,55):d.line((x,0,x,h),fill=grid,width=1)
 for y in range(0,h,55):d.line((0,y,w,y),fill=grid,width=1)
 return im,d

def export(im,name):
 o=OUT/name
 im.convert('RGB').save(o,quality=94,subsampling=0)
 print(o,o.stat().st_size)

# Main listing image
im,d=base();d.rounded_rectangle((49,45,600,715),radius=5,fill=(20,45,32,150))
letterspace(d,(78,102),'CARTAPRESS',rust,font(17,2),2)
d.text((76,185),'A MENU',font=font(83),fill=cream)
d.text((76,285),'WORTH',font=font(83),fill=cream)
d.text((76,385),'KEEPING.',font=font(83),fill=cream)
d.rectangle((79,514,245,518),fill=rust)
d.text((79,549),'PRINT  •  DIGITAL  •  EDITABLE',font=font(19,1),fill=muted)
d.text((78,672),'CONCEPT SAMPLES',font=font(14,2),fill=gold)
fake_paper(im,'02-bistro-page-1.png',(702,124),(405,580),12)
fake_paper(im,'01-cantina-page-1.png',(865,44),(380,560),-10)
export(im,'fiverr-01-main.jpg')

# Three style samples
im,d=base(bg='#eee5d6');d.rectangle((0,0,1280,140),fill=forest)
letterspace(d,(50,40),'THREE DIRECTIONS. ONE ORIGINAL MENU.',cream,font(21,2),1.3)
for i,(name,caption) in enumerate([('01-cantina-page-1.png','BOLD'),('02-bistro-page-1.png','CLASSIC'),('03-cafe-page-1.png','FRESH')]):
 x=78+i*408;p=open_image(name);p.thumbnail((310,470),Image.Resampling.LANCZOS)
 d.rounded_rectangle((x-11,162,x+330,664),radius=5,fill='#fffefa',outline='#d4cabc',width=2)
 im.paste(p,(x+int((310-p.width)/2),174))
 d.text((x+15,681),caption,font=font(21,2),fill=forest)
 d.text((x+15,719),'',font=font(14,1),fill='#6f8178')
export(im,'fiverr-02-styles.jpg')

# Deliverables
im,d=base(bg='#f3ecdf');d.rectangle((0,0,650,769),fill=forest)
letterspace(d,(75,80),'ONE MENU. EVERY FILE.',rust,font(19,2),2)
d.text((75,167),'Print.',font=font(70),fill=cream)
d.text((75,251),'Digital.',font=font(70),fill=cream)
for i,(big,small) in enumerate([('PDF','PRINT PROOF'),('SVG','EDITABLE MASTER'),('PNG','HIGH-RES IMAGE'),('HTML','MOBILE MENU'),('JSON','SOURCE DATA')]):
 y=386+i*62;d.rectangle((76,y,159,y+44),outline=rust,width=2);d.text((84,y+8),big,font=font(15,2),fill=cream)
 d.text((187,y+10),small,font=font(20,1),fill=muted)
fake_paper(im,'03-cafe-page-1.png',(754,80),(450,625),-5)
export(im,'fiverr-03-deliverables.jpg')

# Upwork 4:3 cropped/laid-out cover
im,d=base(1000,750);d.text((58,58),'CARTAPRESS STUDIO',font=font(24,2),fill=rust)
d.text((55,159),'Restaurant menu',font=font(62),fill=cream)
d.text((55,237),'design that',font=font(62),fill=cream)
d.text((55,315),'works everywhere.',font=font(52),fill=cream)
d.rectangle((58,422,206,426),fill=rust)
d.text((58,465),'Print proof  /  Editable SVG',font=font(20,1),fill=muted)
d.text((58,502),'Digital HTML  /  Source JSON',font=font(20,1),fill=muted)
d.text((58,690),'ORIGINAL FICTIONAL CONCEPT',font=font(14,2),fill=gold)
fake_paper(im,'02-bistro-page-1.png',(610,110),(355,540),-8)
export(im,'upwork-cover-1000x750.jpg')

# Concept PDF samples (not certified CMYK print files)
for svg in SAMPLES.glob('*-page-1.svg'):
 dest=OUT/(svg.name.replace('-page-1.svg','-concept.pdf'))
 cairosvg.svg2pdf(url=str(svg),write_to=str(dest))
 print(dest,dest.stat().st_size)
