#!/usr/bin/env python3
"""Create 1200x630 social sharing preview from actual portfolio assets."""
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
W,H=1200,630
ROOT=Path(__file__).resolve().parent.parent
PORTRAIT=ROOT/'assets'/'profil_fotografi_web.webp'
LOGO=ROOT/'assets'/'selim-monogram.webp'
OUTPUT=ROOT/'assets'/'og-cover.png'
def f(n,bold=False):
    files=(['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf','/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf'] if bold else ['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf'])
    for path in files:
        if Path(path).exists(): return ImageFont.truetype(path,n)
    return ImageFont.load_default()
def cover(src,size,fx=.5,fy=.47):
    w,h=size
    factor=max(w/src.width,h/src.height)
    iw,ih=round(src.width*factor),round(src.height*factor)
    src=src.resize((iw,ih),Image.Resampling.LANCZOS)
    ox=max(0,min(iw-w,round(iw*fx-w/2)))
    oy=max(0,min(ih-h,round(ih*fy-h/2)))
    return src.crop((ox,oy,ox+w,oy+h))
def main():
    im=Image.new('RGB',(W,H))
    p=im.load()
    for y in range(H):
        for x in range(W):
            a=x/W
            glow=max(0,1-math.sqrt(((x-600)/820)**2+((y-260)/640)**2))
            p[x,y]=(round(6+12*a+3*glow),round(25+19*a+7*glow),round(25+13*a+4*glow))
    d=ImageDraw.Draw(im,'RGBA')
    d.rectangle((0,0,13,H),fill=(195,145,74,255))
    for y in range(0,H,40): d.line((0,y,1200,y),fill=(213,187,122,8),width=1)
    for x in range(0,W,40): d.line((x,0,x,H),fill=(213,187,122,7),width=1)
    d.ellipse((410,-290,1260,560),outline=(207,157,83,29),width=2)
    d.ellipse((550,-150,1250,550),outline=(207,157,83,20),width=1)
    d.rounded_rectangle((38,38,1163,592),radius=24,outline=(196,151,78,95),width=2)
    px,py,pw,ph=776,58,366,514
    photo=cover(Image.open(PORTRAIT).convert('RGB'),(pw,ph),.5,.45)
    mask=Image.new('L',(pw,ph),0)
    ImageDraw.Draw(mask).rounded_rectangle((0,0,pw-1,ph-1),radius=21,fill=255)
    im.paste(photo,(px,py),mask)
    d=ImageDraw.Draw(im,'RGBA')
    d.rounded_rectangle((px-1,py-1,px+pw,py+ph),radius=21,outline=(215,175,98,190),width=3)
    d.rounded_rectangle((px+18,py+ph-54,px+pw-18,py+ph-17),radius=12,fill=(6,33,30,225))
    d.ellipse((px+35,py+ph-42,px+45,py+ph-32),fill=(205,159,83,255))
    d.text((px+59,py+ph-45),'SOFTWARE ENGINEER',font=f(16,True),fill=(244,237,216,255))
    logo=Image.open(LOGO).convert('RGB').resize((112,112),Image.Resampling.LANCZOS)
    mm=Image.new('L',(112,112),0)
    ImageDraw.Draw(mm).rounded_rectangle((0,0,111,111),radius=17,fill=255)
    im.paste(logo,(75,72),mm)
    d=ImageDraw.Draw(im,'RGBA')
    d.rounded_rectangle((75,72,187,184),radius=17,outline=(201,152,80,180),width=2)
    d.text((214,102),'PERSONAL PORTFOLIO',font=f(19,True),fill=(227,219,201,255))
    d.text((214,134),'SOFTWARE  ·  RESEARCH  ·  AI',font=f(13),fill=(174,187,171,255))
    d.line((75,207,724,207),fill=(201,157,89,90),width=2)
    d.text((71,248),'Selim Uysal',font=f(68,True),fill=(246,248,241,255))
    d.text((75,347),'Software Engineer',font=f(33,True),fill=(217,175,106,255))
    d.text((76,424),'Building software solutions.',font=f(23),fill=(233,239,228,255))
    d.text((76,465),'Exploring intelligent systems.',font=f(22),fill=(168,193,183,255))
    d.line((75,523,724,523),fill=(201,157,89,85),width=2)
    d.text((75,547),'selimuysal.github.io/selim/',font=f(17,True),fill=(219,195,152,255))
    OUTPUT.parent.mkdir(parents=True,exist_ok=True)
    im.save(OUTPUT,format='PNG',optimize=True)
    print('Created',OUTPUT,im.size,OUTPUT.stat().st_size)
if __name__=='__main__': main()
